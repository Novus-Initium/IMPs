"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  BugAntIcon,
  MagnifyingGlassIcon,
  BanknotesIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen mx-4 md:mx-8 lg:mx-12">
      <header className="flex justify-center py-8">
        <h1 className="text-3xl font-bold text-center">
          About Impact Measurement Protocols
        </h1>
      </header>
      <main className="flex-grow flex flex-col items-center">
        <section className="max-w-md mx-auto p-4 pt-8">
          <h2 className="text-2xl font-bold mb-4">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            At IMPs we believe in the power of impact measurement. We are a community of developers, designers, and impact enthusiasts who are passionate about creating a better world. Our mission is to provide a platform for people to create, fund, and review impactful projects.
          </p>
          <Link href="/projects" passHref>
            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              Learn More About Our Projects
            </button>
          </Link>
        </section>
        <section className="max-w-md mx-auto p-4 pt-8">
          <h2 className="text-2xl font-bold mb-4">
            What We Do
          </h2>
          <div className="flex flex-wrap justify-center mb-6">
            <div className="w-full md:w-1/3 xl:w-1/3 p-4 lg:p-6">
              <div className="bg-base-100 p-6 rounded-3xl h-full">
                <h3 className="text-lg font-bold mb-2">
                  Create Impact
                </h3>
                <UserGroupIcon className="h-8 w-8 fill-secondary" />
                <p className="text-lg leading-relaxed mb-4">
                  Create a mission and start making an impact.
                </p>
                <Link href="/projects/create" passHref>
                  <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full">
                    Start a Mission
                  </button>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/3 xl:w-1/3 p-4 lg:p-6">
              <div className="bg-base-100 p-6 rounded-3xl h-full">
                <h3 className="text-lg font-bold mb-2">
                  Fund Rounds
                </h3>
                <BanknotesIcon className="h-8 w-8 fill-secondary" />
                <p className="text-lg leading-relaxed mb-4">
                  Fund a round and support impactful projects.
                </p>
                <Link href="/debug" passHref>
                  <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full">
                    Fund a Round
                  </button>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/3 xl:w-1/3 p-4 lg:p-6">
              <div className="bg-base-100 p-6 rounded-3xl h-full">
                <h3 className="text-lg font-bold mb-2">
                  Review Donations
                </h3>
                <BuildingLibraryIcon className="h-8 w-8 fill-secondary" />
                <p className="text-lg leading-relaxed mb-4">
                  Review all donations and track the impact.
                </p>
                <Link href="/debug" passHref>
                  <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full">
                    Review Donations
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex justify-center py-4">
        <p className="text-lg text-center">
          &copy; 2023 Impact Measurement Protocols
        </p>
      </footer>
    </div>
  );
};

export default Home;