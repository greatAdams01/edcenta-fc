"use client"

import { Fragment, useState, useEffect } from "react"
import { Menu, Transition } from "@headlessui/react"
import { BellIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { deleteCookie, getCookie } from "cookies-next"
import { useLazyQuery } from "@apollo/client"
import { motion } from "framer-motion"
import Image from "next/image"
import { USER_FULLNAME, STUDENT_NAME } from "@/apollo/queries/auth"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

function TopNav() {
  const [fullName, setFullName] = useState("")
  const [isStudent, setIsStudent] = useState(false)

  const logOut = () => {
    deleteCookie("token")
    deleteCookie("Authdata")
    window.location.href = "/auth/login"
  }

  const [user, { loading }] = useLazyQuery(USER_FULLNAME, {
    onCompleted: (data) => {
      setFullName(`${data.user.firstName} ${data.user.lastName}`)
    },
  })

  const [student] = useLazyQuery(STUDENT_NAME, {
    onCompleted: (data) => {
      setFullName(data.student.name)
    },
  })

  useEffect(() => {
    const authData: any = getCookie("Authdata")
    if (JSON.parse(authData).accountType === "STUDENT") {
      setIsStudent(true)
      student({ variables: { studentId: JSON.parse(authData)._id } })
    } else {
      user()
    }
  }, [student, user])

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center">
              <span className="ml-2 text-xl font-semibold text-gray-900"></span>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto flex items-center px-9">
            <div className="w-full">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-0"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-x-4">
            {/* Notification button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-400" />
            </motion.button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div className="flex items-center">
                <Menu.Button className="flex items-center">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      className="h-8 w-8 rounded-full object-cover"
                      src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <div className="ml-3 hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-700">{fullName}</p>
                      <p className="text-xs text-gray-500">{isStudent ? "Student" : "Sales Manager"}</p>
                    </div>
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {!isStudent && (
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50",
                          )}
                        >
                          <div className="flex items-center">
                            <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Your Profile
                          </div>
                        </a>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? "bg-gray-50" : "",
                          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        <div className="flex items-center">
                          <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          Settings
                        </div>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? "bg-gray-50" : "",
                          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50",
                        )}
                        onClick={logOut}
                      >
                        <div className="flex items-center">
                          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          Sign out
                        </div>
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNav


