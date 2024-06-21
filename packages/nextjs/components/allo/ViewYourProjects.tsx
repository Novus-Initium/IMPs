import React, { useEffect, useState } from 'react';
import { useAccount, useClient } from 'wagmi';
import { BrowserProvider, Contract, Log } from 'ethers';
import { useScaffoldReadContract } from '~~/hooks/scaffold-eth';
import deployedContracts from '../../contracts/deployedContracts'; // Adjust the import path as needed
import '../../styles/ProjectMetadataComponent.css';

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
    <div>
      <h2 style={{ color: 'black' }}>Your Projects</h2>
      {userProjects.map((project, index) => {
        const pointerData = parsePointer(project.metadata.pointer);
        return (
          <div key={index} className="project-pane">
            <h3 style={{ color: 'black' }}>Project ID: {project.id}</h3>
            {pointerData.name && <p style={{ color: 'black' }}><strong>Name:</strong> {pointerData.name}</p>}
            {pointerData.description && <p style={{ color: 'black' }}><strong>Description:</strong> {pointerData.description}</p>}
            {pointerData.website && (
              <p style={{ color: 'black' }}>
                <strong>Website:</strong> <a href={pointerData.website} target="_blank" rel="noopener noreferrer">{pointerData.website}</a>
              </p>
            )}
            {pointerData.twitterHandle && <p style={{ color: 'black' }}><strong>Twitter Handle:</strong> @{pointerData.twitterHandle}</p>}
            {pointerData.githubUsername && <p style={{ color: 'black' }}><strong>Github Username:</strong> {pointerData.githubUsername}</p>}
            {pointerData.githubOrganization && <p style={{ color: 'black' }}><strong>Github Organization:</strong> {pointerData.githubOrganization}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectEvents;
