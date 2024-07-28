"use client"
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getABI, getNetworkName } from '../../../hardhat/scripts/utils.js';
import { useEthersProvider } from '../../utils/useEthersProvider';

interface RoundData {
  name: string;
  description: string;
  token: string;
  matchAmount: string;
  address: string;
  applicationsEndTime: string;
  applicationsStartTime: string;
  roundStartTime: string;
  roundEndTime: string;
}

const ExploreActiveRounds = () => {
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { provider, signer, owner, isLoading: providerLoading, error: providerError } = useEthersProvider();

  const setupPayout = async (roundAddress: string) => {
    if (!signer) {
      console.error('No signer available');
      return;
    }

    try {
      const roundABI = getABI(await getNetworkName(provider!), 'Round');
      const roundContract = new ethers.Contract(roundAddress, roundABI.abi, signer);

      const tx = await roundContract.setUpPayout();
      await tx.wait();

      console.log('Payout set up successfully for round:', roundAddress);
      // Optionally, update the UI or refetch the rounds here
    } catch (error) {
      console.error('Error setting up payout:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  useEffect(() => {
    const fetchRounds = async () => {
      if (!provider || !owner) return;

      try {
        const roundFactory = getABI(await getNetworkName(provider), 'RoundFactory');
        const contract = new ethers.Contract(roundFactory.address, roundFactory.abi, provider);

        // Fetch events directly from the contract
        const filter = contract.filters.RoundCreated();
        const events = await contract.queryFilter(filter);

        const roundsMapping: Record<string, string> = events.reduce((acc: Record<string, string>, event: any) => {
          acc[event.args[3]] = event.args[0]; // Map roundAddress to roundMetaPtrCID
          return acc;
        }, {});

        // Fetch round details from IPFS
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

        const currentDate = new Date().toISOString();
        const ended = details
          .filter((round) => !round.error && round.body.message.ownerAddress === owner && round.body.message.roundEndTime < currentDate)
          .map((round) => ({
            name: round.body.message.name,
            description: round.body.message.description,
            token: round.body.message.token,
            matchAmount: round.body.message.matchAmount,
            address: round.body.message.address,
            applicationsEndTime: round.body.message.applicationsEndTime,
            applicationsStartTime: round.body.message.applicationsStartTime,
            roundStartTime: round.body.message.roundStartTime,
            roundEndTime: round.body.message.roundEndTime,
          }));

        setRounds(ended);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching rounds');
      } finally {
        setLoading(false);
      }
    };

    if (provider && owner) {
      fetchRounds();
    }
  }, [provider, owner]);

  if (providerLoading) return <div>Loading provider...</div>;
  if (providerError) return <div>Provider Error: {providerError}</div>;
  if (!provider || !signer) return <div>No Ethereum provider found</div>;
  if (loading) return <div>Loading rounds...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
    <h1>View Rounds Ended</h1>
    {rounds.length === 0 ? (
        <p>No ended rounds found.</p>
    ) : (
        <ul>
        {rounds.map((roundData, index) => (
            <li key={`${roundData.address}-${index}`}>
            <div className="card-body">
                <h2 className="card-title">Round {roundData.name}</h2>
                <p>Round Description: {roundData.description}</p>
                <p>Round Token: {roundData.token}</p>
                <p>Round Match Amount: {roundData.matchAmount}</p>
                <p>Round Application Start Time: {roundData.applicationsStartTime}</p>
                <p>Round Application End Time: {roundData.applicationsEndTime}</p>
                <p>Round Start Time: {roundData.roundStartTime}</p>
                <p>Round End Time: {roundData.roundEndTime}</p>
                <div className="card-actions justify-end">
                <button 
                    className="btn btn-primary"
                    onClick={() => setupPayout(roundData.address)}
                >
                    Set Up Payout
                </button>
                </div>
            </div>
            </li>
        ))}
        </ul>
    )}
    </div>
  );
};

export default ExploreActiveRounds;