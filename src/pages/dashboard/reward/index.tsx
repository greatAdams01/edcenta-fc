import React from 'react'

import { PlusIcon } from '@heroicons/react/24/outline';
import AppLayout from '@/layout/AppLayout'
import { useQuery } from '@apollo/client';
import { STUDENTS } from '@/apollo/queries/dashboard';

export default function Reward() {
  const { data } = useQuery(STUDENTS);
  const students = data?.students || [];

  return (
    <AppLayout>
        <div className='grid justify-items-stretch'>
        <div className='w-full px-4 sm:px-6 lg:px-8 border-2 p-8 rounded-md justify-self-center'>
          <h1 className="font-bold text-lg">Rewards</h1>
          <section className='flex w-full justify-between my-4'>
            <select className='border border-black rounded-md w-60 px-2'>
                {students.map((student: any) => (
                  <option key={student} className='font-bold'>{student.name}</option>
                ))}
                
            </select>
            <a href={'/dashboard/students/add_student'} className='bg-[#00AE9A] bg-opacity-70 hover:bg-opacity-100 border rounded-md py-4 px-4 flex items-center justify-center text-center font-bold'>
              <PlusIcon className='w-4 mr-2' /> Create Reward
            </a>
            
          </section>

          <section className='font-bold flex bg-'>
              <p>Total Reward: {}</p>
              <p>Upcoming Reward: {}</p>
          </section>
        </div>
        </div>
    </AppLayout>
  )
}
