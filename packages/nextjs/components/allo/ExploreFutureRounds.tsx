"use client";
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useScaffoldReadContract } from '~~/hooks/scaffold-eth';
import { getABI, getNetworkName } from '../../utils/utils.js';
import {applyToRound} from "../../utils/allo/applyToRound"
import parsePointer from "../../utils/allo/parsePointer"

type ProjectMetadata = {
  id: number;
  metadata: {
    protocol: string;
    pointer: string;
  };
};

const ExploreFutureRounds = () => {
  const [futureRounds, setFutureRounds] = useState<any[]>([]);
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provider] = useState(new ethers.BrowserProvider(window.ethereum));
  // Hook to read all projects
  const { data: projectsData, error: projectsError } = useScaffoldReadContract({
    contractName: 'ProjectRegistry',
    functionName: 'getAllProjects',
  });

  useEffect(() => {
    // Fetch projects
    if (projectsError) {
      setError(projectsError.message);
      setLoading(false);
      return;
    }

    if (projectsData) {
      console.log('Projects Data:', projectsData);
      setProjects(projectsData.map((project: any) => ({
        id: Number(project.id),
        metadata: {
          protocol: project.metadata.protocol.toString(),
          pointer: project.metadata.pointer,
        },
      })));
      setLoading(false);
    }
  }, [projectsData, projectsError]);

  useEffect(() => {

    const fetchRounds = async () => {
      try {
        // const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []); // Request account access

        const roundFactory = getABI(await getNetworkName(provider), 'RoundFactory');
        const contract = new ethers.Contract(roundFactory.address, roundFactory.abi, provider);

        const filter = contract.filters.RoundCreated();
        const events = await contract.queryFilter(filter);

        const roundsMapping: { [key: string]: string } = events.reduce((acc: { [key: string]: string }, event: any) => {
          acc[event.args[3]] = event.args[0]; // Map roundMetaPtrCID to roundAddress
          return acc;
        }, {});

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
        }).map((round) => ({
          ...round.options.metadata.keyvalues,
          address: round.address // Add the address to the round data
        }));
  

        console.log('Future Rounds:', future);

        setFutureRounds(future);
      } catch (error: any) {
        console.error(error);
        setError('Error loading rounds');
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
      <h1 className="text-3xl font-bold text-white mb-8">Explore Future Rounds</h1>
      <div className="space-y-6">
        {futureRounds.length === 0 ? (
          <p className="text-white text-xl">No future rounds available.</p>
        ) : (
          futureRounds.map((round, index) => (
            <div key={index} className="card bg-gray-800 shadow-lg rounded-lg overflow-hidden w-2/3 mx-auto">
              <div className="card-body p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <p className="text-gray-300 sm:col-span-2">{round.description}</p>
                  <p className="text-gray-300">
                    <strong className="font-medium text-white">Application Start:</strong> {new Date(round.applicationsStartTime).toLocaleString()}
                  </p>
                  <p className="text-gray-300">
                    <strong className="font-medium text-white">Application End:</strong> {new Date(round.applicationsEndTime).toLocaleString()}
                  </p>
                  <p className="text-gray-300">
                    <strong className="font-medium text-white">Round Start:</strong> {new Date(round.roundStartTime).toLocaleString()}
                  </p>
                  <p className="text-gray-300">
                    <strong className="font-medium text-white">Round End:</strong> {new Date(round.roundEndTime).toLocaleString()}
                  </p>
                  <p className="text-gray-300">
                    <strong className="font-medium text-white">Match Amount (ETH):</strong> {round.matchAmount}
                  </p>
                </div>
                <div className="card-actions justify-end">
                  <details className="dropdown dropdown-top dropdown-end">
                    <summary className="btn btn-primary m-1">Apply to Round</summary>
                    <ul className="menu dropdown-content bg-base-200 rounded-box z-[1] w-52 p-2 shadow mt-2">
                      {projects.map((project) => {
                        const pointerData = parsePointer(project.metadata.pointer);
                        return (
                          <li key={project.id}>
                            <a
                              onClick={async () => {
                                console.log(`Applying ${pointerData.name || `Project ${project.id}`} to ${round.name}`);
                                try {
                                  await applyToRound(provider, round.address.toString(), project.id, project.metadata.pointer);
                                  console.log(`Successfully applied ${pointerData.name || `Project ${project.id}`} to ${round.name}`);
                                } catch (error) {
                                  console.error("Error applying to round:", error);
                                }
                              }}
                              className="text-gray-200 hover:bg-gray-700"
                            >
                              {pointerData.name || `Project ${project.id}`}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExploreFutureRounds;