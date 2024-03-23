import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppLayout from '../../../layout/AppLayout';
import { XCircleIcon } from '@heroicons/react/20/solid';
import { Notification } from '@/utils/nav';

function Index() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="w-full flex px-4 sm:px-6 lg:px-8 border-2 p-8 rounded-md justify-self-center">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full ">
              <div className="w-full flex justify-between items-center my-4">
                <h1 className="font-bold text-lg">My Notification <span className='text-green-500'>({Notification.length})</span></h1>
              </div>
              <div className="">
                {Notification.map((message: any) => (
                  <div key={message} className="flex">
                    {message.score >= message.averageScore ? (
                      <p className='my-4'>
                        <span className='font-bold'>{message.by}</span> successfully attempted <span className='font-bold'> &quot;{message.topic}&quot;</span>, scoring <span className='font-bold'>{message.score}%</span> 
                      </p>
                    ) : (
                      <p className='my-4'>
                        <span className='font-bold'>{message.by}</span> unsuccessfully attempted <span className='font-bold'>&quot;{message.topic}&quot;</span>, scoring below <span className='font-bold'>{message.averageScore}%</span> 
                      </p>
                    )}
                    <XCircleIcon className="flex text-sm w-6 ml-4 cursor-pointer" />
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </AppLayout>
  );
}

export default Index;
