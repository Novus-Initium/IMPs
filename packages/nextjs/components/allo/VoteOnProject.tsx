"use client";
import { useEffect, useState } from 'react';
import { ethers, BrowserProvider, EventLog } from 'ethers';
import { getABI, getNetworkName } from '../../../hardhat/scripts/utils.js';
import parsePointer from "../../utils/allo/parsePointer";

interface Round {
    name: string;
    description: string;
    address: string;
    applicationsStartTime: number;
    applicationsEndTime: number;
    roundStartTime: number;
    roundEndTime: number;
  }

const VoteOnProject = () => {
  const [futureRounds, setFutureRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [networkName, setNetworkName] = useState(null);
  const [provider, setProvider] = useState<ethers.providers.BrowserProvider | null>(null);
  const [applicationsMapping, setApplicationsMapping] = useState<any>({});

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
    const roundImplementationAbi = getABI(networkName, "RoundImplementation").abi;
    const roundContract = new ethers.Contract(round.address, roundImplementationAbi, provider);
    const filter = roundContract.filters.NewProjectApplication();
    const events = await roundContract.queryFilter(filter);
    const applicationsMapping: { [key: string]: any } = {};

    events.forEach((event) => {
      if (event instanceof EventLog) {
        const eventData = event.args; // Assuming args array contains necessary data

        const metaData = parsePointer(eventData[2][1]);
        const projectId = Number(eventData[1])
        // const index = eventData[0][0];
        const applicationIndex: any = roundContract.applicationsIndexesByProjectID

        applicationsMapping[projectId] = {
          name: metaData["name"],
          description: metaData["description"],
          website: metaData["website"],
          twitterHandle: metaData["twitterHandle"],
          githubUsername: metaData["githubUsername"],
          githubOrganization: metaData["githubOrganization"],
        }

      }
      setApplicationsMapping(applicationsMapping);
    });


    console.log('application mapping: ', applicationsMapping);
  };


  // Render loading state while fetching data
  if (loading) return <div>Loading...</div>;

  // Render error message if there was an error fetching data
  if (error) return <div>Error: {error}</div>;

  // Render the fetched rounds once loaded
  return (
    <div>
      {!selectedRound ? (
        <>
          <h2>Active Rounds</h2>
          <ul className="flex flex-wrap gap-4">
            {futureRounds.map((round, index) => (
              <div key={index} className="card bg-base-100 w-96 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{round.name}</h2>
                  <p><strong>Round Name:</strong> {round.name}</p>
                  <p><strong>Round Description:</strong> {round.description}</p>
                  <p><strong>Application Start Time:</strong> {new Date(round.applicationsStartTime).toLocaleString()}</p>
                  <p><strong>Application End Time:</strong> {new Date(round.applicationsEndTime).toLocaleString()}</p>
                  <p><strong>Round Start Time:</strong> {new Date(round.roundStartTime).toLocaleString()}</p>
                  <p><strong>Round End Time:</strong> {new Date(round.roundEndTime).toLocaleString()}</p>
                  <button onClick={() => handleViewApplications(round)}>View Applications</button>
                </div>
              </div>
            ))}
          </ul>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedRound(null)}>Back to Rounds</button>
          <h3>Applications for {selectedRound.name}</h3>
          <ul className="flex flex-wrap gap-4">
            {Object.keys(applicationsMapping).map((projectId) => {
              const application = applicationsMapping[projectId];
              return (
                <div key={projectId} className="card bg-base-100 w-96 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">{application.name}</h2>
                    <p><strong>Description:</strong> {application.description}</p>
                    <p><strong>Website:</strong> <a href={application.website} target="_blank" rel="noopener noreferrer">{application.website}</a></p>
                    <p><strong>Twitter:</strong> {application.twitterHandle}</p>
                    <p><strong>GitHub Username:</strong> {application.githubUsername}</p>
                    <p><strong>GitHub Organization:</strong> {application.githubOrganization}</p>
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
