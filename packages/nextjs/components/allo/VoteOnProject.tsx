"use client";
import { useEffect, useState } from 'react';
import { ethers, BrowserProvider, EventLog, Contract, toUtf8Bytes, zeroPadValue } from 'ethers';
import { getABI, getNetworkName } from '../../utils/utils.js';
import parsePointer from "../../utils/allo/parsePointer";
import { encodeQFVotes} from "../../../hardhat/scripts/utils";
import { useAccount } from 'wagmi';
import deployedContracts from '../../contracts/deployedContracts'; // Adjust the import path as needed
import { parseUnits} from "viem"

interface Round {
    name: string;
    description: string;
    address: string;
    applicationsStartTime: number;
    applicationsEndTime: number;
    roundStartTime: number;
    roundEndTime: number;
    token: string;
  }

const VoteOnProject = () => {
  const { address } = useAccount();
  const [futureRounds, setFutureRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [networkName, setNetworkName] = useState(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [roundApplicationsMapping, setApplicationsMapping] = useState<any>({});
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const fetchRounds = async () => {
      setLoading(true);
      try {
        // Ensure the user is connected to an Ethereum-enabled browser
        if (!window.ethereum) {
          throw new Error('Ethereum provider not found. Please install MetaMask or another Ethereum provider.');
        }

        // Initialize ethers provider and request account access
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        // Get RoundFactory ABI and contract instance
        const networkName = await getNetworkName(provider);
        const roundFactory = getABI(networkName, 'RoundFactory');
        setNetworkName(networkName);
        const contract = new ethers.Contract(roundFactory.address, roundFactory.abi, provider);

        // Fetch all RoundCreated events
        const filter = contract.filters.RoundCreated();
        const events = await contract.queryFilter(filter);

        // Map roundMetaPtrCID to roundAddress
        const roundsMapping: { [key: string]: string } = events.reduce((acc: { [key: string]: string }, event: any) => {
            acc[event.args[3]] = event.args[0]; // Map roundMetaPtrCID to roundAddress
            return acc;
        }, {});

        // Fetch details for each round using IPFS hash
        const details = await Promise.all(
          Object.keys(roundsMapping).map(async (ipfsHash) => {
            try {
              const response = await fetch(`/api/getPinata/${ipfsHash}`);
              if (!response.ok) throw new Error('Failed to fetch data');
              const data = await response.json();
              return { ipfsHash, ...data, address: roundsMapping[ipfsHash] };
            } catch (err) {
              console.error(`Error fetching data for ${ipfsHash}:`, err);
              return { ipfsHash, error: 'Failed to fetch data' };
            }
          })
        );
        console.log('Round Details:', details);
        // Filter rounds in round time
        const currentTime = new Date().toISOString();
        const future = details.filter((round) => {
          const keyValues = round.options.metadata.keyvalues;
          const roundStartTime = keyValues.roundStartTime;
          const roundEndTime = keyValues.roundEndTime;

          return (
            !round.error &&
            roundStartTime <= currentTime &&
            roundEndTime >= currentTime
          );
        }).map((round) => ({
          ...round.options.metadata.keyvalues,
          address: round.address // Add the address to the round data
        }));

        console.log('Future Rounds:', future);
        setFutureRounds(future);
      } catch (error: any) {
        console.error('Error loading rounds:', error);
      } finally {
        setLoading(false);
      }
    };

    // Call fetchRounds function when the component mounts
    fetchRounds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures fetchRounds runs once on component mount

  const handleViewApplications = async (round: any): Promise<void> => {
    setSelectedRound(round); // Set selected round state
    console.log('Selected Round:', round);
    const roundImplementationAbi = getABI(networkName, "RoundImplementation").abi;
    const roundContract = new ethers.Contract(round.address, roundImplementationAbi, provider);
    
    const filter = roundContract.filters.NewProjectApplication();
    const events = await roundContract.queryFilter(filter);
    const applicationsMapping: { [key: string]: any } = {};

    events.forEach((event: any) => {

        const eventData = event.args; // Assuming args array contains necessary data
        const parsedEvent = roundContract.interface.parseLog(event);

        // TODO: Fix Project ID
        const metaData = parsePointer(eventData[2][1]);
        const projectId = eventData.projectID[3]
        const applicationIndex: any = roundContract.applicationsIndexesByProjectID

        applicationsMapping[projectId] = {
          name: metaData["name"],
          description: metaData["description"],
          website: metaData["website"],
          twitterHandle: metaData["twitterHandle"],
          githubUsername: metaData["githubUsername"],
          githubOrganization: metaData["githubOrganization"],
          token: metaData["token"],
        }

      setApplicationsMapping(applicationsMapping);
    });

    console.log('application mapping: ', applicationsMapping);
  };

const handleDonate = async (projectId: string, round: Round, amount: any) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      const donationAmount = parseUnits(amount.toString(), 18);
      const grantAddress = await fetchGrantAddress(projectId);
      console.log("Project Id: ", projectId);
      console.log('Grant Address:', grantAddress);
      console.log("Amount:", amount);
      console.log("Round token: ", round.token);
      console.log("Donation Amount: ", donationAmount.toString());
  
      const projectIDBytes32 = zeroPadValue(toUtf8Bytes(projectId), 32);
      const applicationIndex = 0; // Assuming applicationIndex is 0
      console.log
      // Encode the vote using the function from the test
      const donations = [{
        applicationIndex,
        projectRegistryId: projectIDBytes32,
        recipient: grantAddress,
        amount: amount.toString(),
      }];
      const votes = encodeQFVotes({ address: round.token, decimals: 18 }, donations);
  
      const networkName = await getNetworkName(provider);
      const roundContract = new ethers.Contract(round.address, getABI(networkName, "RoundImplementation").abi, signer);

      try {
        const tx = await roundContract.vote(votes , { value: donationAmount });
        const receipt = await tx.wait(); // Wait for the transaction to be mined
        console.log('Gas Used:', receipt.gasUsed.toString());
      } catch (voteError) {
        console.error('Error during vote transaction:', voteError);
      }
  
    } catch (err) {
      console.error('Error donating to project:', err);
    }
  };

type DeployedContractsType = typeof deployedContracts;

const isValidChainId = (chainId: number): chainId is keyof DeployedContractsType => {
    return chainId in deployedContracts;
  };

const fetchGrantAddress = async (projectId: string) => {

    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
  
      if (!isValidChainId(chainId)) {
        throw new Error(`No deployment found for chain ID: ${chainId}`);
      }
  
      const projectRegistryDetails = deployedContracts[chainId].ProjectRegistry;
  
      if (!projectRegistryDetails) {
        throw new Error(`ProjectRegistry not deployed on chain ID: ${chainId}`);
      }
  
      const projectRegistryContractAddress = projectRegistryDetails.address;
      const projectRegistryAbi = projectRegistryDetails.abi;
      console.log('Project Registry Address:', projectRegistryContractAddress);
      const contract = new Contract(projectRegistryContractAddress, projectRegistryAbi, provider);
      const filter = contract.filters.ProjectCreated();
      const events = await contract.queryFilter(filter);
      console.log('Events:', events);

      for (const event of events) {
        if (event instanceof EventLog) {
            const parsedEvent = contract.interface.parseLog(event);
            const eventData = event.args;
            // console.log('Project Id: ',Number(projectId))
            console.log('Project Id: ',Number(eventData[0]));
            // console.log('Evennt Data: ', eventData)
            if (Number(eventData[0]) === Number(projectId)) {
                return eventData[1];
            }
        }
    }
    
    } catch (err) {
      console.error('Error fetching project events:', err);
    }
  };

  // Render loading state while fetching data
  if (loading) return <div>Loading...</div>;

  // Render error message if there was an error fetching data
  if (error) return <div>Error: {error}</div>;

  // Render the fetched rounds once loaded
  return (
    <div className="p-4 sm:p-6 md:p-8">
      {!selectedRound ? (
        <>
          <h2 className="text-3xl font-bold text-white text-center mb-8">Active Rounds</h2>
          <ul className="flex flex-wrap gap-6 justify-center">
            {futureRounds.map((round, index) => (
              <div key={index} className="card bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full sm:w-5/6 md:w-2/3 max-w-4xl mx-auto">
                <div className="card-body p-6 sm:p-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">{round.name}</h2>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <p className="text-gray-300 sm:col-span-2"><strong className="font-medium text-white">Description:</strong> {round.description}</p>
                    <p className="text-gray-300"><strong className="font-medium text-white">Application Start:</strong> {new Date(round.applicationsStartTime).toLocaleString()}</p>
                    <p className="text-gray-300"><strong className="font-medium text-white">Application End:</strong> {new Date(round.applicationsEndTime).toLocaleString()}</p>
                    <p className="text-gray-300"><strong className="font-medium text-white">Round Start:</strong> {new Date(round.roundStartTime).toLocaleString()}</p>
                    <p className="text-gray-300"><strong className="font-medium text-white">Round End:</strong> {new Date(round.roundEndTime).toLocaleString()}</p>
                    <p className="text-gray-300"><strong className="font-medium text-white">Token:</strong> {round.token}</p>
                  </div>
                  <button onClick={() => handleViewApplications(round)} className="btn btn-primary">View Applications</button>
                </div>
              </div>
            ))}
          </ul>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedRound(null)} className="btn btn-secondary mb-4">Back to Rounds</button>
          <h3 className="text-2xl font-bold text-white mb-8">Applications for {selectedRound.name}</h3>
          <ul className="flex flex-wrap gap-6 justify-center">
            {Object.keys(roundApplicationsMapping).map((projectId) => {
              const application = roundApplicationsMapping[projectId];
              return (
                <div key={projectId} className="card bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full sm:w-5/6 md:w-2/3 max-w-4xl mx-auto">
                  <div className="card-body p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold text-white mb-4">{application.name}</h2>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <p className="text-gray-300 sm:col-span-2"><strong className="font-medium text-white">Description:</strong> {application.description}</p>
                      <p className="text-gray-300"><strong className="font-medium text-white">Website:</strong> <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{application.website}</a></p>
                      <p className="text-gray-300"><strong className="font-medium text-white">Twitter:</strong> {application.twitterHandle}</p>
                      <p className="text-gray-300"><strong className="font-medium text-white">GitHub Username:</strong> {application.githubUsername}</p>
                      <p className="text-gray-300"><strong className="font-medium text-white">GitHub Organization:</strong> {application.githubOrganization}</p>
                    </div>
                    <button 
                      onClick={() =>  {
                        setSelectedProject(projectId);
                        const amount = prompt("Enter the amount in Ether:");
                        handleDonate(projectId, selectedRound, amount);
                      }} 
                      className="mt-4 btn btn-primary"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default VoteOnProject;
