"use client";
import { useEffect, useState } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import { getABI, getNetworkName } from '../../../hardhat/scripts/utils.js';

const RoundApplications = () => {
  const [futureRounds, setFutureRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        // Get RoundFactory ABI and contract instance
        const networkName = await getNetworkName(provider);
        const roundFactory = getABI(networkName, 'RoundFactory');
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
        // Filter rounds owned by the current user
        const currentTime = new Date().toISOString();
        const future = details.filter((round) => {
          const keyValues = round.options.metadata.keyvalues;
          const applicationsStartTime = keyValues.applicationsStartTime;
          const applicationsEndTime = keyValues.applicationsEndTime;

          return (
            !round.error &&
            applicationsStartTime <= currentTime &&
            applicationsEndTime >= currentTime &&
            
            round.options.metadata.keyvalues.ownerAddress.toLowerCase() === userAddress.toString().toLowerCase()
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

  // Render loading state while fetching data
  if (loading) return <div>Loading...</div>;

  // Render error message if there was an error fetching data
  if (error) return <div>Error: {error}</div>;

  // Render the fetched rounds once loaded
  return (
    <div>
      <h2>My Future Rounds</h2>
      <ul>
        {futureRounds.map((round, index) => (
          <div key={index} className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{round.name}</h2>
            <strong>Round Name: {round.name}</strong>
            <strong>Round Description: {round.description}</strong>
            <strong>Application Start Time: {round.applicationsStartTime}</strong>
            <strong>Application End Time: {round.applicationsEndTime}</strong>
            <strong>Round Start Time: {round.roundStartTime}</strong>
            <strong>Round End Time: {round.roundEndTime}</strong>
            {/* Display other round details as needed */}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default RoundApplications;
