"use client";
import Head from 'next/head';
import ProjectEvents from '../../../components/allo/ViewYourProjects';

function CreateProjectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Head>
        <title>View Projects</title>
      </Head>
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <ProjectEvents />
      </div>
    </div>
  );
}

export default CreateProjectPage;
