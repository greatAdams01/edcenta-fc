import { Children, Fragment, useState } from 'react'
import Image from 'next/image'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'; 


import {dosis} from '@/utils/font'
import { navigation } from '@/utils/nav'
import { userNavigation } from '@/utils/nav'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


export default function Tutor() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <>
      <div className={``}>
        {/* Mobile nav */}
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
                  <div className={`${dosis.className} bg-white flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4`}>
                    <div className="flex h-16 mt-4 shrink-0 items-center">
                      <Image
                        width={200}
                        height={100}
                        className="h-16 w-auto "
                        src={'/logo1.png'}
                        alt="EdCenta"
                      />
                      <h1 className='ml-2 text-xl font-bold'>EdCenta</h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2  space-y-1">
                          {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.href === pathname
                                  ? 'bg-gray-500 text-indigo-600 font-semibold'
                                  : 'text-gray-700 hover:text-indigo-600',
                                'bg-green bg-opacity-20 group flex gap-x-3 rounded-md p-2 text-lg leading-6 font-semibold'
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  item.href === pathname ?  ' text-indigo-500' : ' group-hover:text-indigo-600',
                                  'h-6 w-6 shrink-0'
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>

                            {item.children && (
                              <ul className="pl-4 my-2">
                                {item.children.map((subItem) => (
                                  <li key={subItem.name}>
                                    <a href={subItem.href} className={classNames( subItem.href === pathname 
                                      ? 'text-indigo-500' 
                                      : 'hover:text-gray-600', 
                                      'ml-8 space-y-4 font-semibold'
                                      )}>
                                      {subItem.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                          </ul>
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
        <div className={`${dosis.className} hidden lg:block lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col`}>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 h-[100vh]  px-6 pb-4">
          <div className="flex items-center h-16 shrink-0 items-center">
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
                  {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.href === pathname
                                  ? 'bg-gray-500 text-indigo-600 font-semibold'
                                  : 'text-gray-700 hover:text-indigo-600',
                                'bg-green bg-opacity-20 group flex gap-x-3 rounded-md p-2 text-lg leading-6 font-semibold'
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  item.href === pathname ?  ' text-indigo-500' : ' group-hover:text-indigo-600',
                                  'h-6 w-6 shrink-0'
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>

                            {item.children && (
                              <ul className="pl-4 my-2">
                                {item.children.map((subItem) => (
                                  <li key={subItem.name}>
                                    <a href={subItem.href} className={classNames( subItem.href === pathname 
                                      ? 'text-indigo-500' 
                                      : 'hover:text-gray-600', 
                                      'ml-8 space-y-4 font-semibold'
                                      )}>
                                      {subItem.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
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

        <div className="lg:pl-72 lg:hidden ">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200  px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center  p-1.5">
                    <span className="sr-only">Open user menu</span>
                    {/* {user.image} */}
                    <UserIcon className='h-8 w-8 rounded-full bg-gray-50' />
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm  leading-6 text-gray-900" aria-hidden="true">
                        User Name
                        {/* {user.name} */}
                      </span>
                      <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md  py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900'
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          {/* <p className="py-10">Hello</p> */}
        </div>
      </div>
    </>
  )
}
