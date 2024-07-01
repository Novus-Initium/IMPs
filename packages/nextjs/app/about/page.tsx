"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { SparklesIcon, CodeBracketSquareIcon,} from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <div className="glass flex items-center flex-col flex-grow pt-3 bg-base-300">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-3xl mb-2 py-4 secondary-100">About IMPs</span>
            <span className="block text-2xl text-secondary-200 font-bold">some hisDori(c) stuff</span>
          </h1>
          <div className="avatar justify-center flex py-4">
            <div class="w-24 rounded-md">
              <img src="/IMPsLogo.svg"/>
            </div>
          </div>
          <div className="bg-secondary-100 flex flex-col items-center justify-center">
            <div className="card bg-base-100 px-10 max-w-lg shadow-xl">
              <div className="card-body flex items-center text-center ">
                <h1 className="card-title text-3xl font-extrabold text-secondary">Our Mission</h1>
                <div className="card-actions flex-col items-center rounded-md mb-12">
                  <p className="flex text-lg leading-relaxed mb-3 text-center font-medium">
                    At IMPs we believe in the power of impact measurement. We are a community of developers, designers, and impact enthusiasts who are    passionate about creating a better world. Our mission is to provide a platform for people to create, fund, and review impactful projects.
                  </p>
                  <Link href="https://github.com/Novus-Initium/IMPs" passHref>
                    <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-300 hover:bg-secondary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
                      Check out our Github
                    </button>
                  </Link>
                  <CodeBracketSquareIcon className="h-8 w-8 fill-accent-content" />
                  <p className="flex font-extrabold text-lg leading-relaxed mb-0 text-center">
                    Impact Measurement Protocols
                  </p>
                  <SparklesIcon className="h-10 w-10 fill-accent-content" />
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
