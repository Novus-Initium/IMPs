
// const ipfsHash = "QmSoa7SDiNXmNLU34nHKwUchZdfgeqpDhtj8jzcHh4upaW";
// const response = await fetch(`/api/ipfs/${ipfsHash}`);
// const data = await response.json()
"use client"
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getABI,getNetworkName } from '../../utils/utils.js'; // Update with the correct path

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
    const [error, setError] = useState(null);
    const [owner, setOwner] = useState<string | null>(null);

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        // Initialize provider using MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []); // Request account access
        const signer = await provider.getSigner();
        const owner = await signer.getAddress();

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
        console.log("Details" , details)
        // Filter active rounds based on current time
        const currentDate = new Date().toISOString();
        console.log("Current Time:", currentDate);
        const ended = details
          .filter((round) => !round.error 
            && round['body']['message']['ownerAddress'] == owner 
            && round['body']['message']['roundEndTime'] < currentDate)
          .map((round) => {
            const endedRound = {
                'name': round['body']['message']['name'],
                'description': round['body']['message']['description'],
                'token': round['body']['message']['token'],
                'matchAmount': round['body']['message']['matchAmount'],
                'address': round['body']['message']['address'],
                'applicationsEndTime': round['body']['message']['applicationsEndTime'],
                'applicationsStartTime': round['body']['message']['applicationsStartTime'],
                'roundStartTime': round['body']['message']['roundStartTime'],
                'roundEndTime': round['body']['message']['roundEndTime'],
            }
            return endedRound;
          });
        
        setRounds(ended);
        console.log("Ended", ended);
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
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-8">View Rounds Ended</h1>
      <div className="space-y-6">
        {Object.entries(rounds).map(([address, roundData]) => (
          <div key={address} className="card bg-gray-800 shadow-lg rounded-lg overflow-hidden w-lg max-w-4xl mx-auto">
            <div className="card-body p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Round: {roundData.name}</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <p className="text-gray-300 sm:col-span-2"><strong className="font-medium text-white">Description:</strong> {roundData.description}</p>
                <p className="text-gray-300"><strong className="font-medium text-white">Token:</strong> {roundData.token}</p>
                <p className="text-gray-300"><strong className="font-medium text-white">Match Amount:</strong> {roundData.matchAmount}</p>
                <p className="text-gray-300"><strong className="font-medium text-white">Application Start:</strong> {new Date(roundData.applicationsStartTime).toLocaleString()}</p>
                <p className="text-gray-300"><strong className="font-medium text-white">Application End:</strong> {new Date(roundData.applicationsEndTime).toLocaleString()}</p>
                <p className="text-gray-300"><strong className="font-medium text-white">Round Start:</strong> {new Date(roundData.roundStartTime).toLocaleString()}</p>
                <p className="text-gray-300"><strong className="font-medium text-white">Round End:</strong> {new Date(roundData.roundEndTime).toLocaleString()}</p>
              </div>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Set Up Payout</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreActiveRounds;
