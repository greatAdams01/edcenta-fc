'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

import '@/styles/tailwind.css'

import { REQUEST_RESET_PASSWORD } from '@/apollo/mutations/auth';
import OTP from '@/components/ui/otp';

const Reset_password = () => {
  const route = useRouter();
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false); 
  const [Loading, setLoading] = useState(false);

  const [sendOTP, { loading }] = useMutation(REQUEST_RESET_PASSWORD, {
    variables: {
      email,
    },
    onCompleted: (data) => {
      if (data) {
        setShowOTP(true); 
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(email === ''){
        toast.error('Inpute a valid email')
        return;
    }
    setLoading(true);
    sendOTP();
  };

  return (
    <div className={` w-full flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 `}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={'/'} className="cursor-pointer">
          <Image
            className="mx-auto h-10 w-16"
            src="/logo.png"
            alt="EdCenta"
            width={100}
            height={100}
          />
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Forgot Password
        </h2>
        <p className='text-center text-base font-bold leading-9 tracking-tight text-gray-900 mb-6'>Enter your email, an OTP will be sent to you</p>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>

            <div>
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
              </div>

            <div>
            {Loading ? (
                <div className="flex w-full justify-center rounded-md border-2 border-indigo-600  px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm  cursor-progress">
                  <img src="/loader.gif" alt="loader" className="w-6 rotating-loader" />

                </div>
                ) : (
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 p2"
                  >
                    Send OTP
                  </button>
                )}
            </div>
          </form>
          <ToastContainer />
          {showOTP && <OTP />}
    </div>
    </div>
    </div>
  );
}

export default Reset_password;
