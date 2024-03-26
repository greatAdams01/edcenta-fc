import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  BellIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { deleteCookie } from 'cookies-next';
import { useQuery } from '@apollo/client';


import { userNavigation } from '@/utils/nav'
import { USER_FULLNAME } from '@/apollo/queries/auth'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function TopNav() {
  const [fullName, setFullName] = useState('');

  const logOut = () => {
    // remove token and Authdata from cookies
    deleteCookie('token');
    deleteCookie('Authdata');
    window.location.href = '/auth/login';
  }

  useQuery(USER_FULLNAME, {
    onCompleted: (data) => {
      console.log(data)
      setFullName(`${data.user.firstName} ${data.user.lastName}`)
      // dispatch(setUser(data.user))
    }
  })

  return (
    <>
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
              <a href={'/dashboard/notification'}>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              </a>
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                    {fullName}
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
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <a
                          href={item.href}
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                          onClick={item.name === 'Sign out' ? logOut : () => { }}
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
    </>
  )
}

export default TopNav