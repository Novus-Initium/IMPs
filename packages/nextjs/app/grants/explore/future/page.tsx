"use client"
import React from 'react';
import dynamic from 'next/dynamic';

const ExploreFutureRounds = dynamic(() => import('../../../../components/allo/ExploreFutureRounds'), { ssr: false });

const ExploreFutureRoundsPage = () => {
  return (
    <div>
      <ExploreFutureRounds />
    </div>
  );
};

export default ExploreFutureRoundsPage;