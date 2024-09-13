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
        <div className='flex justify-between'>
          <h1 className='font-bold my-auto'>Assigned Activities</h1>
          <select className='border p-2 rounded-md'>
            <option value="all">All</option>
            <option value="Worksheets">Worksheets</option>
            <option value="Assesment">Assesment</option>
          </select>
        </div>
        <div className='mt-4 -my-2 sm:-mx-6 lg:-mx-8'>
          <table className='min-w-full divide-y devide-gray-300 mt-4'>
            <thead className='bg-[#0075BC]  text-white font-bold'>
              <tr className='text-left'>
                <th scope='col' className='py-8 pl-3'>Activity</th>
                <th scope='col'>Subject</th>
                <th scope='col'>Topic</th>
                <th scope='col'>Level</th>
                <th scope='col'>Year</th>
              </tr>
            </thead>
            <tbody>
              <tr className=' border-y'>
                <td className='pl-3 py-6 font-bold'>Solve Quad Equeation</td>
                <td>Mathematics</td>
                <td className='font-bold'>Quad Equeation</td>
                <td></td>
                <td>4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
