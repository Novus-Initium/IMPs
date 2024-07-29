import React, { useEffect, useState } from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-eth';

type ProjectMetadata = {
  id: number;
  metadata: {
    protocol: string;
    pointer: string;
  };
};

const ProjectMetadataComponent = () => {
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hook to read all projects
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

  const parsePointer = (pointer: string) => {
    try {
      // Log the raw pointer string
      console.log('Raw Pointer String:', pointer);

      // Remove leading and trailing whitespace, including newlines
      const sanitizedPointer = pointer.trim();
      console.log('Sanitized Pointer String:', sanitizedPointer);

      // Additional sanitization: Replace single quotes with double quotes, remove trailing commas
      const cleanPointer = sanitizedPointer.replace(/'/g, '"').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      console.log('Clean Pointer String:', cleanPointer);

      return JSON.parse(cleanPointer);
    } catch (e) {
      console.error('Failed to parse pointer:', e);
      console.log('Invalid JSON:', pointer); // Log the invalid JSON
      return {};
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Projects</h2>
      <div className="space-y-6">
        {projects.map((project, index) => {
          const pointerData = parsePointer(project.metadata.pointer);
          console.log('Pointer Data:', project.metadata.pointer); // Debugging log
          return (
            <div key={index} className="card bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
              <div className="card-body p-6 sm:p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Project ID: {project.id}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {pointerData.name && (
                    <p className="text-gray-300">
                      <strong className="font-medium text-white">Name:</strong> {pointerData.name}
                    </p>
                  )}
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

export default ProjectMetadataComponent;
