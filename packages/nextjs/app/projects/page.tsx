"use client";

import Head from 'next/head';
import Link from 'next/link';

const ProjectsPage = () => {
  return (
    
<div className="glass min-h-screen py-10 bg-secondary-100 flex flex-col items-center justify-center">
      <Head>
        <title>Projects</title>
      </Head>
      <div className="card bg-base-100 px-10 mb-2 max-w-lg shadow-xl">
        <div className="card-body flex items-center text-center ">
          <h1 className="card-title text-3xl font-extrabold py-4">Projects</h1>
          <div className="card-actions flex-col items-center rounded-md mb-2">
            <Link href="/projects/create" passHref>
              <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-300 hover:bg-secondary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
                Create a Project
              </button>
            </Link>
            <Link href="/projects/manage" passHref>
              <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-300 hover:bg-secondary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
                View Your Projects
              </button>
            </Link>
            <Link href="/projects/explore" passHref>
              <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-300 hover:bg-secondary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
                Explore Projects
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
