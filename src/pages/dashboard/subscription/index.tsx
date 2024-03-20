import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from '../../../layout/AppLayout';

function Index() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="w-full flex px-4 sm:px-6 lg:px-8 border-2 p-8 rounded-md justify-self-center">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full ">
              <div className="w-full flex justify-between items-center my-4">
                <h1 className="font-bold text-lg">My Subscription</h1>
              </div>

            <div className='mt-6 md:grid md:grid-cols-2 md:gap-6 justify-between'>
            <div className='my-2 font-bold'>
                <p>Status: {}</p>
             </div>
             <div className='my-2 font-bold'>
                <p>Total per Month: {}</p>
             </div>
             <div className='my-2 font-bold'>
                Subscription Type: {}
             </div>
             <div className='my-2 font-bold'>
                Renewal Date: {}
            </div>
            <div className='w-full flex my-1 font-bold py-2'>
             <a href='#' className='flex w-full justify-center font-bold border-2 hover:border-black rounded-md p-2 text-center'>Change Plan</a>
            </div>
            <div className='w-full flex my-1 font-bold py-2'>
            <a href='#' className='flex w-full justify-center font-bold border-2 hover:border-black rounded-md p-2 text-center'>Update Card</a>
            </div>
            
            </div>
            <div className='my-6 font-bold'>
                
                <table className='w-full'>
                <colgroup>
                  <col className="w-full sm:w-6/12" />
                  <col className="w-full sm:w-6/12" />
                </colgroup>
                    <thead className=' bg-gray-200 w-full '>
                        <tr className='w-full'>
                            <th scope='col' className='text-start py-4 pl-2'>Subscription Plan</th>
                            <th scope='col'></th>
                        </tr>
                    </thead>
                    <tbody className='divide-y devide-white/5' >
                        <tr >
                            <td className='p-2'>Educator Monthly Core</td>
                            <td className='text-end'>$10.24</td>
                        </tr>
                    </tbody>
                    <thead className=' bg-gray-200 w-full '>
                    <tr className='w-full'>
                       <th scope='col' className='text-start py-4 pl-2'>Taxes</th>
                       <th scope='col'></th>
                    </tr>
                    </thead>
                    <tbody className='divide-y devide-white/5' >
                    <tr className='w-full'>
                            <td className='p-2'>Vat(20%)</td>
                            <td className='text-end'>$1.05</td>
                        </tr>
                        <tr className='w-full'>
                            <td className='p-2'>Monthly Total</td>
                            <td className='text-end underline font-bolder'>$11.29</td>
                        </tr>
                    </tbody>
                </table>
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


