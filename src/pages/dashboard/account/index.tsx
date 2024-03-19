import React from 'react';
import { useQuery } from '@apollo/client';
import AppLayout from '../../../layout/AppLayout';
import { USER } from '@/apollo/queries/dashboard'

function Index() {
  const { data } = useQuery(USER);
  const user = data?.user || {};

  

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="font-bold text-lg">My Details</h1>
        <form className="mt-4">
          <label htmlFor="first name" className="lg:w-4/6 flex items-center">
            <div className="w-full">
              First name <span className="text-red-500">*</span>
            </div>
            <div className="flex w-full justify-right">
              <input type="text" value={user.firstName || ''} className="w-full sm:w-[30rem] my-2 border-2 h-14 rounded-md px-4" />
            </div>
          </label>
          <br />
          <label htmlFor='first name' className='lg:w-4/6 flex items-center'>
             <div className='w-full' >
              Last name <span className='text-red-500'>*</span>
             </div>
             <div className='flex w-full justify-right'>
             <input type='text' value={user.lastName || ''} className='w-full sm:w-[30rem] my-2 border-2 h-14 rounded-md px-4' />
             </div>
            </label>
            <br />
            <label htmlFor='first name' className='lg:w-4/6 flex items-center'>
             <div className='w-full' >
              Email <span className='text-red-500'>*</span>
             </div>
             <div className='flex w-full justify-right'>
             <input type='text' value={user.email || ''} className='w-full sm:w-[30rem] my-2 border-2 h-14 rounded-md px-4' />
             </div>
            </label>
            <br />
            <label htmlFor='first name' className='lg:w-4/6 flex items-center'>
             <div className='w-full' >
              Password <span className='text-red-500'>*</span>
             </div>
             <div className='flex w-full justify-right'>
             <a href='#' className='underline text-blue-500'>Change Password</a>
             </div>
            </label>
            <br />
            <label htmlFor='first name' className='lg:w-4/6 flex items-center'>
             <div className='w-full' >
              Contact <span className='text-red-500'>*</span>
             </div>
             <div className='flex w-full justify-right'>
             <input type='text' value={user.phone || ''} className='w-full sm:w-[30rem] my-2 border-2 h-14 rounded-md px-4' />
             </div>
            </label>
            <br />
            <label htmlFor='first name' className='lg:w-4/6 flex items-center'>
             <div className='w-full' >
              Address <span className='text-red-500'>*</span>
             </div>
             <div className='flex w-full justify-right'>
             <input type='text' value={user.address || ''} className='w-full sm:w-[30rem] my-2 border-2 h-14 rounded-md px-4' />
             </div>
            </label>
            <br />
            <label htmlFor='first name' className='lg:w-4/6 flex items-center'>
             <div className='w-full' >
              City <span className='text-red-500'>*</span>
             </div>
             <div className='flex w-full justify-right'>
             <input type='text' value={user.city || ''} className='w-full sm:w-[30rem] my-2 border-2 h-14 rounded-md px-4' />
             </div>
            </label>
            <br />
            <label htmlFor='first name' className='lg:w-4/6 flex items-center'>
             <div className='w-full' >
              Occupation <span className='text-red-500'>*</span>
             </div>
             <div className='flex w-full justify-right'>
             <input type='text' value={user.occupation || ''} className='w-full sm:w-[30rem] my-2 border-2 h-14 rounded-md px-4' />
             </div>
            </label>
            <br />
            <label htmlFor='first name' className='lg:w-4/6 flex items-center'>
             <div className='w-full' >
              Account Type <span className='text-red-500'>*</span>
             </div>
             <div className='flex w-full justify-right'>
             <input type='text' value={user.accountType || ''} className='w-full sm:w-[30rem] my-2 border-2 h-14 rounded-md px-4' />
             </div>
            </label>
            <br />
            <label htmlFor='first name' className='lg:w-4/6 flex items-center'>
             <div className='w-full' >
              Name in Bank <span className='text-red-500'>*</span>
             </div>
             <div className='flex w-full justify-right'>
             <input type='text' value={user.bName || ''} className='w-full sm:w-[30rem] my-2 border-2 h-14 rounded-md px-4' />
             </div>
            </label>
            <br />
            <label htmlFor='first name' className='lg:w-4/6 flex items-center'>
             <div className='w-full' >
              Account Number <span className='text-red-500'>*</span>
             </div>
             <div className='flex w-full justify-right'>
             <input type='text' value={user.acctNumber || ''} className='w-full sm:w-[30rem] my-2 border-2 h-14 rounded-md px-4' />
             </div>
            </label>
            <br />
        </form>
      </div>
    </AppLayout>
  );
}

export default Index;
