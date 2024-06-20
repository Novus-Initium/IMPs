"use client";
import Head from 'next/head';
import Link from 'next/link';

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Head>
        <title>Projects</title>
      </Head>
      <div className="bg-white shadow-md rounded-lg p-10 max-w-lg w-full text-center">
        <h1 className="text-3xl font-extrabold mb-8 text-indigo-600">Projects</h1>
        <div>
          <Link href="/grants/projects/create" passHref>
            <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              Create Project
            </button>
          </Link>
          <Link href="/projects/manage" passHref>
            <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              Manage Project
            </button>
          </Link>
          <Link href="/grants/projects/explore" passHref>
            <button className="w-full py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              Explore Projects
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
