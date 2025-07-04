/* eslint-disable @next/next/no-img-element */
"use client"

import { Fragment, useState, useEffect } from "react"
import { Menu, Transition } from "@headlessui/react"
import { BellIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { deleteCookie, getCookie } from "cookies-next"
import { useLazyQuery } from "@apollo/client"
import { motion } from "framer-motion"
import { USER_FULLNAME, STUDENT_NAME } from "@/apollo/queries/auth"
import { useRouter } from 'next/router'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

function TopNav() {
  const router = useRouter();
  const [fullName, setFullName] = useState("")
  const [isStudent, setIsStudent] = useState(false)

  const logOut = () => {
    deleteCookie("token")
    deleteCookie("Authdata")
    router.push("/auth/login")
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
    
    // Check if authData exists and is valid
    if (!authData) {
      console.log("No auth data found in TopNav")
      return
    }

    try {
      const parsedAuthData = JSON.parse(authData)
      
      // Check if accountType exists
      if (!parsedAuthData.accountType) {
        console.log("No account type found in auth data")
        return
      }

      if (parsedAuthData.accountType === "STUDENT") {
        setIsStudent(true)
        student({ variables: { studentId: parsedAuthData._id } })
      } else {
        user()
      }
    } catch (error) {
      console.error("Error parsing auth data in TopNav:", error)
      // Clear corrupted cookies
      deleteCookie("token")
      deleteCookie("Authdata")
      router.push("/auth/login")
    }
  }, [student, user, router])

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center pl-4 sm:pl-6 lg:pl-8">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center">
              <span className="text-xl font-semibold text-gray-900"></span>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-auto px-8 sm:px-12 lg:px-16">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-0 shadow-sm"
                placeholder="Search..."
                type="search"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center pr-4 sm:pr-6 lg:pr-8">
            {/* Notification button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 text-gray-400 hover:text-gray-500 bg-gray-50 rounded-full shadow-sm mr-8"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-400" />
            </motion.button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-x-4 focus:outline-none group">
                <span className="sr-only">Open user menu</span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-purple-200 transition-colors duration-200"
                >
                  <img
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </motion.div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{fullName}</p>
                  <p className="text-xs text-gray-500">{isStudent ? "Student" : "Tutor"}</p>
                </div>
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

