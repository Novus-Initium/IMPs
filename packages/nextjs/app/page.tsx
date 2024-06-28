"use client";

import { Button } from 'daisyui';
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { PlusCircleIcon, BanknotesIcon, UserGroupIcon, BuildingLibraryIcon, MagnifyingGlassIcon, NewspaperIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-2 bg-teal-600">
        <div className="px-4">
          <h1 className="text-center">
            <span className="block text-2xl mb-1 text-yellow-100">Impact Measurement Protocols</span>
            <span className="block text-3xl font-bold">Fund A Round and Find Out</span>
          </h1>
        </div>
        <div className="flex-grow w-full mt-1 px-1 py-0">
          <div className="flex justify-center items-center gap-4 flex-col sm:flex-row">
          <div class="card m-5 w-33 bg-base-100 shadow hover:bg-base-300 hover:shadow-xl focus:outline-yellow-100 focus:ring-2 focus:ring-offset-2 focus:ring-neutral-content transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
  <div class="glass card-body m-2 w-33 p-1 items-center">
    <h2 class="card-title justify-center">Projects</h2>
    <UserGroupIcon className="h-8 w-8 fill-secondary flex justify-center" />
    <b>Create</b> a Mission.
    <b>Manage</b> a Project.
    <b>Explore</b> Live Missions.
    <b>Attest</b> an Impact.
    <ul class="menu menu-horizontal bg-base-200 rounded-md mt-4">
  <li>
    <a href="/projects/create" class="tooltip tooltip-info" data-tip="Create">
    <PlusCircleIcon className="flex h-6 w-6 fill-secondary justify-center" />
    </a>
  </li>
  <li>
    <a href="/projects/manage" class="tooltip tooltip-info" data-tip="Manage">
    <BuildingLibraryIcon className="flex h-6 w-6 fill-secondary justify-center" />
    </a>
  </li>
  <li>
    <a href="/projects/explore" class="tooltip tooltip-info" data-tip="Explore">
    <MagnifyingGlassIcon className="flex h-6 w-6 fill-secondary justify-center" />
    </a>
  </li>
</ul>
  </div>
</div>
<div class="card m-5 w-69 bg-base-100 shadow hover:bg-base-300 hover:shadow-xl focus:outline-yellow-100 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
  <div class="glass card-body m-3 w-42 p-1 items-center">
    <h2 class="card-title flex items-center justify-center">Rounds</h2>
    <BanknotesIcon className="h-8 w-8 fill-secondary justify-center"/>
    <b>Apply</b> for a Grant.
    <b>Donate</b> in a Round.
    <b>Fund</b> a Round.<b>Find</b> Out.
    <ul class="menu menu-horizontal bg-base-200 rounded-md mt-4">
  <li>
    <a href="/grants/create" class="tooltip tooltip-info" data-tip="Create">
    <PlusCircleIcon className="flex h-6 w-6 fill-secondary justify-center" />
    </a>
  </li>
  <li>
    <a href="/grants/manage" class="tooltip tooltip-info" data-tip="Manage">
    <BuildingLibraryIcon className="flex h-6 w-6 fill-secondary justify-center" />
    </a>
  </li>
  <li>
    <a href="/grants/explore" class="tooltip tooltip-info" data-tip="Explore">
    <MagnifyingGlassIcon className="flex h-6 w-6 fill-secondary justify-center" />
    </a>
  </li>
</ul>
  </div>
</div>
<div class="card m-5 w-42 bg-base-100 shadow hover:bg-base-300 hover:shadow-xl focus:outline-yellow-100 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
  <div class="glass card-body m-2 w-42 p-1 items-center">
    <h2 class="card-title justify-center">Manager</h2>
    <BuildingLibraryIcon className="h-8 w-8 fill-secondary justify-center" />
    <b>Create</b> a Round.
    <b>Manage</b> a Project.
    <b>Admin</b> a Fund.
    <b>Review</b> all Donations.
    <ul class="menu menu-horizontal bg-base-200 rounded-md mt-4">
  <li>
    <a href="/debug" class="tooltip tooltip-info" data-tip="Create">
    <NewspaperIcon className="flex h-6 w-6 fill-secondary justify-center" />
    </a>
  </li>
  <li>
    <a href="/manager" class="tooltip tooltip-info" data-tip="Manage">
    <BuildingLibraryIcon className="flex h-6 w-6 fill-secondary justify-center" />
    </a>
  </li>
  <li>
    <a href="/manager" class="tooltip tooltip-info" data-tip="Explore">
    <BanknotesIcon className="flex h-6 w-6 fill-secondary justify-center" />
    </a>
  </li>
</ul>
  </div>
</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
