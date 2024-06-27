"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExploreActiveRounds = () => {
  const [activeRounds, setActiveRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(String);

  useEffect(() => {
    const fetchActiveRounds = async () => {
      try {
        const response = await axios.get('/api/getActiveRounds');
        setActiveRounds(response.data);
      } catch (error: any) {
        setError('Failed to fetch active rounds');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveRounds();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Explore Active Rounds</h1>
      <ul>
        {activeRounds.map((round) => (
          <li key={round.ipfsHash}>
            <h2>IPFS Hash: {round.ipfsHash}</h2>
            <p>Metadata: {round.metadata.name}</p>
            {/* Add more metadata fields as necessary */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExploreActiveRounds;
