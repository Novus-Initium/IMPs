"use client";
import Head from 'next/head';
import Link from 'next/link';

const GrantsPage = () => {
  return (
    <div className="min-h-screen bg-#2270a3 flex flex-col items-center justify-center">
      <Head>
        <title>Grant Rounds</title>
      </Head>
      <div className="bg-secondary shadow-md rounded-lg p-10 max-w-lg w-full text-center">
        <h1 className="text-3xl font-extrabold mb-8 text-white">Rounds</h1>
        <div>
          <Link href="/grants/create" passHref>
            <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              Create a Grant Round
            </button>
          </Link>
          <Link href="/grants/manage" passHref>
            <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              Manage Your Grant Rounds
            </button>
          </Link>
          <Link href="/grants/explore" passHref>
            <button className="w-full py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              Explore Grant Rounds
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GrantsPage;
