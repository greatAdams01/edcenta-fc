import React, { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
import { CheckIcon } from '@heroicons/react/24/outline'
import {manrope} from '@/utils/font'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {USER} from '@/apollo/queries/dashboard'
import {CHANGE_PASSWORD} from '@/apollo/mutations/dashboard'
import { useMutation } from '@apollo/client'

export default function Password() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');

  const [setPassword, {loading}] = useMutation(CHANGE_PASSWORD, {
    variables:{
        oldPassword,
        newPassword
    },
    onError: (error) => {
        toast.error(error.message); 
      }
  })
  const [open, setOpen] = useState(true)

  const cancelButtonRef = useRef(null)

  const Change = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    if(oldPassword === '' || newPassword === ''){
        toast.error('Invalid credentials')
        return;
    }
    setPassword()
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className={`${manrope.className} fixed inset-0 z-10 w-screen overflow-y-auto`}>
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form onSubmit={Change}>
                <div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title as="h3" className="text-base leading-6 font-semibold text-center">
                    Change Password
                    </Dialog.Title>
                    <div className="mt-4 ">
                    <div>
                        <label htmlFor='Old' className='my-4'>Old Password
                        <input type='text' value={oldPassword} onChange={(e) => setOldPassword(e.target?.value)} className='border-2 w-full h-12 rounded-md px-4 my-2 cursor-pointer' />
                        </label>
                        <label htmlFor='New' className='my-4'>New Password
                        <input type='text' value={newPassword} onChange={(e) => setNewPassword(e.target?.value)} className='border-2 w-full h-12 rounded-md px-4 my-2 cursor-pointer' />
                        </label>
                     </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                  type='submit'
                    className="inline-flex w-full justify-center rounded-md font-semibold bg-indigo-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-red-400 px-3 py-2 text-sm text-black shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-300 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    cancel
                  </button>
                </div>
                {/* <ToastContainer /> */}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
