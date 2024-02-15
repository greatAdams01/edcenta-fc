'use client'
import React, { useState, Fragment, useRef } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

import { REQUEST_RESET_PASSWORD } from '@/apollo/mutations/auth';
import OTP from '@/components/ui/otp';
import Reset from '@/pages/auth/reset';

const Reset_password = () => {
  const route = useRouter();
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false); 

  const [sendOTP, { loading }] = useMutation(REQUEST_RESET_PASSWORD, {
    variables: {
      email,
    },
    onCompleted: (data) => {
      if (data) {
        setShowOTP(true); 
        toast.success('An OTP has been sent to your mail');
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(email === ''){
        toast.error('Inpute a valid email')
        return;
    }
    sendOTP();
  };

  return (
    <div className='w-full flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 '>
      <div className="p-4 mt-20 sm:mx-auto sm:w-3/6">
        <h1 className='text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Forgot Password</h1>
        <p className='text-center text-base font-bold leading-9 tracking-tight text-gray-900 mb-6'>Enter your email, an OTP will be sent to you</p>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target?.value)}
              autoComplete="email"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 p2"
          >Send OTP</button>
        </form>
        <div className='flex justify-between mt-2 block text-sm font-medium leading-6 text-gray-900'>
          <p>Dont have an account? 
            <Link href={'#'}>
              <span className='text-purple-950 ml-2'>Signup as Vendor</span>
            </Link>
          </p>
          <Link href={'#'}>
            <p className='text-purple-950'>Signup as Guest</p>
          </Link>
        </div>
      </div>
      <ToastContainer />
      {showOTP && <OTP />}
      
    </div>
  );
}

export default Reset_password;
