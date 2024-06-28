import React, { useEffect, useState } from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-eth';
import '../../styles/ProjectMetadataComponent.css';

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

  if (loading) return <p>Loading... ... ...<span class="loading loading-spinner text-primary"></span>
  <span class="loading loading-spinner text-secondary"></span>
  <span class="loading loading-spinner text-accent"></span>
  <span class="loading loading-spinner text-neutral"></span>
  <span class="loading loading-spinner text-info"></span>
  <span class="loading loading-spinner text-success"></span>
  <span class="loading loading-spinner text-warning"></span>
  <span class="loading loading-spinner text-error"></span></p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 style={{ color: 'black' }}>Projects</h2>
      {projects.map((project, index) => {
        const pointerData = parsePointer(project.metadata.pointer);
        console.log('Pointer Data:', project.metadata.pointer); // Debugging log
        return (
          <div key={index} className="project-pane">
            <h3>Project ID: {project.id}</h3>
            {<p><strong>Name:</strong> {pointerData.name}</p>}
            {pointerData.name && <p><strong>Name:</strong> {pointerData.name}</p>}
            {pointerData.description && <p><strong>Description:</strong> {pointerData.description}</p>}
            {pointerData.website && <p><strong>Website:</strong> <a href={pointerData.website} target="_blank" rel="noopener noreferrer">{pointerData.website}</a></p>}
            {pointerData.twitterHandle && <p><strong>Twitter Handle:</strong> @{pointerData.twitterHandle}</p>}
            {pointerData.githubUsername && <p><strong>Github Username:</strong> {pointerData.githubUsername}</p>}
            {pointerData.githubOrganization && <p><strong>Github Organization:</strong> {pointerData.githubOrganization}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectMetadataComponent;
