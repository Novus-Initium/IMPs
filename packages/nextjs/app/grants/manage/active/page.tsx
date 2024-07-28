"use client";
import Head from 'next/head';
import EndedRounds from '../../../../components/allo/ExploreEndedRounds';

function ViewEndedRoundPage() {
  return (
    <div className="font-bold min-h-screen flex items-center justify-center">
      <Head>
        <title>View Projects</title>
      </Head>
      <div className="bg-base-100 shadow-md rounded-lg p-8 max-w-lg w-full">
        <EndedRounds />
      </div>
    </div>
  );
}

export default ViewEndedRoundPage;
