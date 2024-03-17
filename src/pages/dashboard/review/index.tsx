import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link'; 
import AppLayout from '../../../layout/AppLayout';
import { SchoolGrades } from '@/apollo/queries/dashboard';

interface Grade {
  _id: string;
  stage: number;
  year: string;
  ages: string;
  subject: {
    _id: string;
    name: string;
    worksheet: {
      _id: string;
      title: string;
      levelId: string; 
    }[];
    topics: {
      _id: string;
      name: string;
      levelId: string; 
    }[];
  }[];
}

export default function Assign() {
  
  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className='font-bold '>COmpleted Activities</h1>
        <div className='mt-4 -my-2 sm:-mx-6 lg:-mx-8'>
            <table className='min-w-full divide-y devide-gray-300 mt-4'>
                <thead className='bg-[#00AE9A] bg-opacity-70 font-bold'>
                    <tr className=''>
                        <th scope='col' className='py-8'>Activity</th>
                        <th scope='col'>Subject</th>
                        <th scope='col'>Topic</th>
                        <th scope='col'>Level</th>
                        <th scope='col'>Year</th>
                        <th scope='col'>Date</th>
                        <th scope='col'>Score</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    
                </tbody>
            </table>
        </div>
      </div>
    </AppLayout>
  );
}
