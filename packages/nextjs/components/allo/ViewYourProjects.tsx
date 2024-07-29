import React, { useEffect, useState } from 'react';
import { useAccount, useClient } from 'wagmi';
import { BrowserProvider, Contract, Log } from 'ethers';
import { useScaffoldReadContract } from '~~/hooks/scaffold-eth';
import deployedContracts from '../../contracts/deployedContracts'; // Adjust the import path as needed

type DeployedContractsType = typeof deployedContracts;

type ProjectMetadata = {
  id: number;
  metadata: {
    protocol: string;
    pointer: string;
  };
};

const ProjectEvents = () => {
  const { address } = useAccount();
  const client = useClient();
  const [userProjectIds, setUserProjectIds] = useState<number[]>([]);
  const [userProjects, setUserProjects] = useState<ProjectMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isValidChainId = (chainId: number): chainId is keyof DeployedContractsType => {
    return chainId in deployedContracts;
  };

  // Fetch ProjectCreated events
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (address && client) {
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

          const contract = new Contract(projectRegistryContractAddress, projectRegistryAbi, provider);
          const filter = contract.filters.ProjectCreated(null, address);
          const events: Log[] = await contract.queryFilter(filter);

          const projectIds = events.map((event: Log) => {
            const parsedEvent = contract.interface.parseLog(event);
            if (parsedEvent) {
              return Number(parsedEvent.args.projectID);
            }
            return null;
          }).filter((projectId): projectId is number => projectId !== null);

          setUserProjectIds(projectIds);
        } catch (err) {
          console.error('Error fetching project events:', err);
          setError('Failed to fetch project events.');
        }
      }
    };

    fetchUserProjects();
  }, [address, client]);

  // Fetch all projects and filter by user's project IDs
  const { data: projectsData, error: projectsError } = useScaffoldReadContract({
    contractName: 'ProjectRegistry',
    functionName: 'getAllProjects',
  });

  useEffect(() => {
    if (projectsError) {
      setError(projectsError.message);
      setLoading(false);
      return;
    }

    if (projectsData) {
      const filteredProjects = projectsData
        .map((project: any) => ({
          id: Number(project.id),
          metadata: {
            protocol: project.metadata.protocol.toString(),
            pointer: project.metadata.pointer,
          },
        }))
        .filter((project: ProjectMetadata) => userProjectIds.includes(project.id));

      setUserProjects(filteredProjects);
      setLoading(false);
    }
  }, [projectsData, projectsError, userProjectIds]);

  const parsePointer = (pointer: string) => {
    try {
      const sanitizedPointer = pointer.trim();
      const cleanPointer = sanitizedPointer.replace(/'/g, '"').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      return JSON.parse(cleanPointer);
    } catch (e) {
      console.error('Failed to parse pointer:', e);
      return {};
    }
  };

  if (loading) return <p style={{ color: 'black' }}>Loading...</p>;
  if (error) return <p style={{ color: 'black' }}>{error}</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Your Projects</h2>
      <div className="space-y-6">
        {userProjects.map((project, index) => {
          const pointerData = parsePointer(project.metadata.pointer);
          return (
            <div key={index} className="card bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
              <div className="card-body p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-white mb-4">{pointerData.name}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {pointerData.description && (
                    <p className="text-gray-300 sm:col-span-2">
                      <strong className="font-medium text-white">Description:</strong> {pointerData.description}
                    </p>
                  )}
                  {pointerData.website && (
                    <p className="text-gray-300">
                      <strong className="font-medium text-white">Website:</strong>{' '}
                      <a href={pointerData.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {pointerData.website}
                      </a>
                    </p>
                  )}
                  {pointerData.twitterHandle && (
                    <p className="text-gray-300">
                      <strong className="font-medium text-white">Twitter:</strong> @{pointerData.twitterHandle}
                    </p>
                  )}
                  {pointerData.githubUsername && (
                    <p className="text-gray-300">
                      <strong className="font-medium text-white">Github User:</strong> {pointerData.githubUsername}
                    </p>
                  )}
                  {pointerData.githubOrganization && (
                    <p className="text-gray-300">
                      <strong className="font-medium text-white">Github Org:</strong> {pointerData.githubOrganization}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectEvents;
