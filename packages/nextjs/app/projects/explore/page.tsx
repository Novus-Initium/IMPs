"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ethers } from 'ethers';
import ExploreProjects from '../../../components/allo/ExploreProjects';
import { notification } from '~~/utils/scaffold-eth';

function CreateProjectPage() {
  const [address, setAddress] = useState('');

  useEffect(() => {
    const getAddress = async () => {
      // Check if we're in a browser environment and MetaMask is available
      if (typeof window !== 'undefined' && (window as any).ethereum !== undefined) {
        try {
          // Updated for ethers v6.x
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          setAddress(userAddress);
        } catch (error) {
          notification.error('Failed to connect to MetaMask');
        }
      } else {
        notification.error('MetaMask is not installed');
      }
    };

    getAddress();
  }, []);

  return (
    <div className="min-h-screen py-10 flex items-center justify-center">
      <Head>
        <title>Explore Projects</title>
      </Head>
      <div className="bg-base-100 shadow-md rounded-lg p-8 max-w-lg w-full">
        <ExploreProjects></ExploreProjects>
      </div>
    </div>
  );
}

export default CreateProjectPage;
