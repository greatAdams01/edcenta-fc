import { Fragment, useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { manrope } from '@/utils/font';
import { deleteCookie } from 'cookies-next';
import { useQuery } from '@apollo/client';
import { getCookie } from 'cookies-next';
import { STAGES } from '@/apollo/queries/dashboard'


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data } = useQuery(STAGES, {
    // variables: { _id },
  });

  const router = useRouter();
  const pathname = router.pathname;

  const stages = data?.schoolGrades || []

  const [accountType, setAccountType] = useState('' as string);
  const authData: any = getCookie('Authdata');

  useEffect(() => {
    if (!authData) {
      window.location.href = '/auth/login';
      return;
    }
    console.log(JSON.parse(authData).accountType);
    setAccountType(JSON.parse(authData).accountType);
  }, [authData])


  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className={`${manrope.className} flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4`}>
                  <div className="flex h-16 shrink-0 items-center">
                      <Image
                        width={200}
                        height={100}
                        className="h-14 w-auto"
                        src={'/logo1.png'}
                        alt="EdCenta"
                      />
                      <h1 className='ml-2 text-xl font-bold'>EdCenta</h1>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                        {stages.map((stage: any) => (
                          <li key={stage._id} className=''>
                            <p className={classNames(
                              'bg-[#00AE9A] bg-opacity-20 group flex gap-x-3 rounded-md p-2 text-lg leading-6 font-semibold'
                            )}
                            >
                            Key Stage {stage.stage}
                            </p>
                            {stages.map((stage: any) => (
                              <li key={stage._id} className='w-full pt-2'>
                                <a href={stage.stage} className='hover:bg-[#00AE9A] hover:bg-opacity-20 group flex gap-x-3 rounded-md p-2 pl-8 text-md leading-6 font-semibold'>
                                  {stage.year}
                                </a>
                              </li>
                            ))}
                          </li>
                        ))}
                        </ul>
                      </li>
                      <li>
                        
                      </li>
                      <li className="mt-auto">
                        <a
                          href="#"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        >
                          <Cog6ToothIcon
                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                            aria-hidden="true"
                          />
                          Settings
                        </a>
                      </li>
                    </ul>
                  </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
                      <Image
                        width={200}
                        height={100}
                        className="h-14 w-auto"
                        src={'/logo1.png'}
                        alt="EdCenta"
                      />
                      <h1 className='ml-2 text-xl font-bold'>EdCenta</h1>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                        {stages.map((stage: any) => (
                          <li key={stage._id} className=''>
                            <p className={classNames(
                              'bg-[#00AE9A] bg-opacity-20 group flex gap-x-3 rounded-md p-2 text-lg leading-6 font-semibold'
                            )}
                            >
                            Key Stage {stage.stage}
                            </p>
                            {stages.map((stage: any) => (
                              <li key={stage._id} className='w-full pt-2'>
                                <a href={stage.stage} className='hover:bg-[#00AE9A] hover:bg-opacity-20 group flex gap-x-3 rounded-md p-2 pl-8 text-md leading-6 font-semibold'>
                                  {stage.year}
                                </a>
                              </li>
                            ))}
                          </li>
                              ))}
                        </ul>
                      </li>
                      <li>
                        
                      </li>
                      <li className="mt-auto">
                        <a
                          href="#"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        >
                          <Cog6ToothIcon
                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                            aria-hidden="true"
                          />
                          Settings
                        </a>
                      </li>
                    </ul>
                  </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="flex my-6 lg:my-0 lg:mx-0 mx-4">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

            {/* <TopNav /> */}
          
        </div>

          <main className="py-0 -mt-20 lg:mt-0 md:py-0">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
