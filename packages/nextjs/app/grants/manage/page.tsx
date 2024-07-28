import React from 'react';
import RoundApplications from '../../../components/allo/RoundApplications';
import Link
 from 'next/link';
const ManageApplications = () => {
  return (
    <div>
      <Link href="/grants/manage/active" passHref>
        <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-200 hover:bg-primary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
          View Your Active Rounds
        </button>
      </Link>    
      <Link href="/grants/manage/ended" passHref>
        <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-200 hover:bg-primary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
          View Ended Rounds
        </button>
      </Link>
    </div>
  );
};

export default ManageApplications;