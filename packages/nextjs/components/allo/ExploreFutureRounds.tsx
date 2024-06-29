"use client";
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getABI, getNetworkName } from '../../../hardhat/scripts/utils.js'; // Update with the correct path
import '../../styles/ExploreFutureRounds.css'; // Ensure you have a corresponding CSS file

const ExploreFutureRounds = () => {
  const [futureRounds, setFutureRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []); // Request account access

        const roundFactory = getABI(await getNetworkName(provider), 'RoundFactory');
        const contract = new ethers.Contract(roundFactory.address, roundFactory.abi, provider);

        const filter = contract.filters.RoundCreated();
        const events = await contract.queryFilter(filter);
        
        const roundsMapping: { [key: string]: string } = events.reduce((acc: { [key: string]: string }, event: any) => {
          acc[event.args[3]] = event.args[0]; // Map roundAddress to roundMetaPtrCID
          return acc;
        }, {});


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

        const currentTime = new Date().toISOString();
        const future = details.filter((round) => {
          const keyValues = round.options.metadata.keyvalues;
          const applicationsStartTime = keyValues.applicationsStartTime;
          const applicationsEndTime = keyValues.applicationsEndTime;
      
          return (
            !round.error &&
            applicationsStartTime <= currentTime &&
            applicationsEndTime >= currentTime
          );
        }).map((round) => round.options.metadata.keyvalues);

        console.log(future);

        setFutureRounds(future);
      } catch (error: any) {
        console.error(error);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRounds();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="explore-rounds-container">
      <h1>Explore Future Rounds</h1>
      <div className="rounds-grid">
        {futureRounds.length === 0 ? (
          <p>No future rounds available.</p>
        ) : (
          futureRounds.map((round, index) => (
            <div key={index} className="round-pane">
              <h2>{round.name}</h2>
              <p><strong>Description:</strong> {round.description}</p>
              <p><strong>Start Time:</strong> {new Date(round.applicationsStartTime).toLocaleString()}</p>
              <p><strong>End Time:</strong> {new Date(round.applicationsEndTime).toLocaleString()}</p>
              {/* <button onClick={() => applyToRound(round.ipfsHash)}>Apply</button> */}
            </div>
          ))
        )}
      </div>
    </div>
  );

  // function applyToRound(roundAddress: string) {
  //   // Logic to apply to the round
  //   console.log(`Applying to round with IPFS hash: ${ipfsHash}`);
  // }
};

export default ExploreFutureRounds;
