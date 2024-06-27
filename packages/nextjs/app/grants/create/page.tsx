"use client";
import Head from 'next/head';
import CreateRoundForm from '../../../components/allo/CreateGrantRound';

function CreateGrantPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Head>
        <title>Create a new project</title>
      </Head>
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Create a Grant Round</h1>
        <CreateRoundForm />
      </div>
    </div>
  );
}

export default CreateGrantPage;
