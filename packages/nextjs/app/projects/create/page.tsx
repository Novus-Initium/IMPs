"use client";
import Head from 'next/head';
import CreateProjectForm from '../../../components/allo/CreateProject';

function CreateProjectPage() {
  return (
    <div className="min-h-4 flex items-center justify-center p-6">
      <Head>
        <title>Create a new project</title>
      </Head>
      <div className="bg-secondary-content shadow-md rounded-lg p-5 max-w-lg w-full">
        <h1 className="text-2xl font-extrabold mb-2 text-center text-secondary">Create a New Project</h1>
        <CreateProjectForm />
      </div>
    </div>
  );
}

export default CreateProjectPage;
