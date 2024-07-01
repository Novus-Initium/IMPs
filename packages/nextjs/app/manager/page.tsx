"use client";

import Head from 'next/head';
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowPathRoundedSquareIcon, UserCircleIcon, DocumentMagnifyingGlassIcon, PlusCircleIcon, BanknotesIcon, UserGroupIcon, BuildingLibraryIcon, MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <div className="glass flex items-center flex-col flex-grow pt-3 bg-base-100">
      <Head>
        <title>Manager</title>
      </Head>
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-3xl mb-2 secondary-100">An Admin Station</span>
            <span className="block text-2xl text-secondary-200 font-bold">Manage it all from here.</span>
          </h1>
        </div>
        <div className="flex-grow w-full mt-2 px-8 py-6">
          <div className="flex justify-center items-center gap-6 flex-col sm:flex-row">
            <div className="flex items-center card bg-base-200 w-42 hover:bg-neutral-content hover:shadow transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              <div className="card-body items-center">
                <Link href="/projects" passHref className="link">
                  <h1 className="card-title text-2xl mb-2 bold">Profiles</h1>
                </Link>
                <UserCircleIcon className="h-8 w-8 fill-accent-content" />
                <p>
                  <b>Create</b> a User Profile.
                </p>
                <p>
                  <b>Edit</b> a Profile.
                </p>
                <p>
                  <b>Explore</b> current Users.{" "}
                </p>
                <div className="card-actions">
                  <ul className="menu menu-horizontal bg-base-200 rounded-box mt-6">
                    <li>
                      <a href="/projects/create" className="tooltip" data-tip="Create">
                        <PlusCircleIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                    <li>
                      <a href="/projects/manage" className="tooltip" data-tip="Manage">
                        <BuildingLibraryIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                    <li>
                      <a href="/projects/explore" className="tooltip" data-tip="Explore">
                        <MagnifyingGlassCircleIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex items-center card bg-base-200 w-42 hover:shadow-x1 hover:bg-neutral-content hover:shadow transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              <div className="card-body items-center">
                <Link href="/grants" passHref className="link">
                  <h1 className="card-title text-2xl mb-2 bold">Projects</h1>
                </Link>
                <UserGroupIcon className="h-8 w-8 fill-accent-content" />
                <p>
                  <b>Create</b> a Project Profile.
                </p>
                <p>
                  <b>Manage</b> a Projects Profile.
                </p>
                <p>
                  <b>Attest</b> to a Projects Milestones.{" "}
                </p>
                <div className="card-actions">
                  <ul className="menu menu-horizontal bg-base-200 rounded-box mt-6">
                    <li>
                      <a href="/projects/create" className="tooltip" data-tip="Create">
                        <PlusCircleIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                    <li>
                      <a href="/projects/manage" className="tooltip" data-tip="Manage">
                        <BuildingLibraryIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                    <li>
                      <a href="/attest" className="tooltip" data-tip="Explore">
                        <MagnifyingGlassCircleIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex items-center card bg-base-200 w-42 hover:bg-neutral-content hover:shadow transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              <div className="card-body items-center">
                <Link href="/manage" passHref className="link">
                  <h1 className="card-title text-2xl mb-2 bold">Rounds</h1>
                </Link>
                <ArrowPathRoundedSquareIcon className="h-8 w-8 fill-accent-content" />
                <p>
                  <b>Manage</b> a Round.
                </p>
                <p>
                  <b>Fund</b> a Round.
                </p>
                <p>
                  <b>Review</b> all Donations.{" "}
                </p>
                <div className="card-actions">
                  <ul className="menu menu-horizontal bg-base-200 rounded-box mt-6">
                    <li>
                      <a href="/projects/manage" className="tooltip" data-tip="Project Manage">
                        <BuildingLibraryIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                    <li>
                      <a href="/grants/manage" className="tooltip" data-tip="Round Manage">
                        <BanknotesIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                    <li>
                      <a href="/blockexplore"className="tooltip" data-tip="Review Donations">
                        <DocumentMagnifyingGlassIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
