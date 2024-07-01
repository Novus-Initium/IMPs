"use client";
import Head from 'next/head';
import CreateRoundForm from '../../../components/allo/CreateGrantRound';

function CreateGrantPage() {
  return (
    <div className="glass bg-base-100 min-h-screen flex items-center justify-center py-8">
      <Head>
        <title>Create a new Round</title>
      </Head>
      <div className="bg-accent-content shadow-md rounded-lg px-8 py-4 mb-4 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Create a Grant Round</h1>
        <CreateRoundForm />
      </div>
    </div>
  );
}

export default CreateGrantPage;
