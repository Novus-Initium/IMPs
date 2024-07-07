import { useState } from 'react';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { notification } from '~~/utils/scaffold-eth';
import { ScaffoldWriteContractVariables } from '~~/utils/scaffold-eth/contract';

const CreateProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [githubOrganization, setGithubOrganization] = useState('');
  const { writeContractAsync, isMining } = useScaffoldWriteContract('ProjectRegistry');
  const [grantAddress, setGrantAddress] = useState('');
  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!projectName || !description || !website) {
      notification.error('Please fill in all required fields');
      return;
    }

    try {
      const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setGrantAddress(address[0]);
      const metadata = `{
        "name": "${projectName}",
        "description": "${description}",
        "website": "${website}",
        ${twitterHandle ? `"twitterHandle": "${twitterHandle}",` : ''}
        ${githubUsername ? `"githubUsername": "${githubUsername}",` : ''}
        ${githubOrganization ? `"githubOrganization": "${githubOrganization}",` : ''}
      }`;

      const metaPtr = {
        protocol: BigInt(1), // Replace with the appropriate protocol value
        pointer: metadata,
      };

      const variables: ScaffoldWriteContractVariables<'ProjectRegistry', 'createProject'> = {
        functionName: 'createProject',
        args: [metaPtr],
      };

      await writeContractAsync(variables);
      notification.success('Project created successfully');
      setProjectName('');
      setDescription('');
      setWebsite('');
      setTwitterHandle('');
      setGithubUsername('');
      setGithubOrganization('');
    } catch (error: any) {
      notification.error(`Failed to create project: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleCreateProject} className="space-y-2">
      <div>
        <label htmlFor="projectName" id="theme-toggle" className="block text-sm font-medium text-theme-toggle">
          Project Name
        </label>
        <input
          id="projectName"
          id="theme-toggle"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-teal rounded-md shadow-sm focus:outline-none focus:ring-base-200 focus:border-base-200 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-theme-toggle">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-base-200 focus:border-base-200 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-theme-toggle">
          Website
        </label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-base-100 rounded-md shadow-sm focus:outline-none focus:ring-base-200 focus:border-base-200 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="twitterHandle" className="block text-sm font-medium theme-toggle">
          Twitter Handle
        </label>
        <input
          id="twitterHandle"
          type="text"
          value={twitterHandle}
          onChange={(e) => setTwitterHandle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-base-200 rounded-md shadow-sm focus:outline-none focus:ring-base-200 focus:border-base-200 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="githubUsername" className="block text-sm font-medium text-theme-toggle">
          Github Username
        </label>
        <input
          id="githubUsername"
          type="text"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-base-200 rounded-md shadow-sm focus:outline-none focus:ring-base-200 focus:border-base-200 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="githubOrganization" className="block text-sm font-medium text-theme-toggle">
          Github Organization
        </label>
        <input
          id="githubOrganization"
          type="text"
          value={githubOrganization}
          onChange={(e) => setGithubOrganization(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-base-200 rounded-md shadow-sm focus:outline-none focus:ring-base-200 focus:border-base-200 sm:text-sm"
        />
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isMining}
          className="w-full max-w-xs py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-base-500"
        >
          {isMining ? 'Creating Project...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
