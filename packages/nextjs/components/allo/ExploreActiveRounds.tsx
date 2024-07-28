
// const ipfsHash = "QmSoa7SDiNXmNLU34nHKwUchZdfgeqpDhtj8jzcHh4upaW";
// const response = await fetch(`/api/ipfs/${ipfsHash}`);
// const data = await response.json()
"use client"
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getABI,getNetworkName } from '../../utils/utils.js'; // Update with the correct path

const ExploreActiveRounds = () => {
  const [rounds, setRounds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        // Initialize provider using MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []); // Request account access

        const roundFactory = getABI(await getNetworkName(provider), 'RoundFactory');
        const contract = new ethers.Contract(roundFactory.address, roundFactory.abi, provider);

        // Fetch events directly from the contract
        const filter = contract.filters.RoundCreated();
        const events = await contract.queryFilter(filter);
        
        const roundsMapping: Record<string, string> = events.reduce((acc: RoundEvents, event: any) => {
          acc[event.args[3]] = event.args[0]; // Map roundAddress to roundMetaPtrCID
          return acc;
        }, {});

        // iterate through all created rounds and retrieve metadata
        // from ipfs using the roundMetaPtrCID
        const details = await Promise.all(
          Object.keys(roundsMapping).map(async (ipfsHash) => {
            try {
              const response = await fetch(`/api/getPinata/${ipfsHash}`);
              if (!response.ok) throw new Error('Failed to fetch data');
              const data = await response.json();
              return { ipfsHash, ...data };
            } catch (err) {
              console.error(`Error fetching data for ${ipfsHash}:`, err);
              return { ipfsHash, error: 'Failed to fetch data' };
            }
          })
        );

        // Filter active rounds based on current time
        const currentTime = Math.floor(Date.now() / 1000);
        const active = details.filter((round) => {
          return (
            !round.error &&
            round.roundStartTime <= currentTime &&
            round.roundEndTime >= currentTime
          );
        });

        setRounds(active)
        console.log(active);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRounds();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Explore Active Rounds</h1>
      <ul>
        {Object.entries(rounds).map(([roundAddress, roundMetaPtrCID]) => (
          <li key={roundAddress}>
            <p>Round Address: {roundAddress}</p>
            <p>MetaPtr CID: {roundMetaPtrCID}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExploreActiveRounds;
