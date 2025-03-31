"use client"

import type React from "react"

import { Fragment, useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { Dialog, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { useQuery } from "@apollo/client"
import { getCookie } from "cookies-next"
import { manrope } from "@/utils/font"
import TopNav from "./TopNav"
import { adminNav } from "@/utils/nav"
import { STAGES } from "@/apollo/queries/dashboard"
import Link from "next/link"
import { motion } from "framer-motion"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { pathname, query } = router
  const { id } = query

  const { data } = useQuery(STAGES)
  const stages = data?.schoolGrades || []

  const [accountType, setAccountType] = useState("")

  useEffect(() => {
    const authData: any = getCookie("Authdata")
    if (!authData) {
      window.location.href = "/auth/login"
      return
    }
    setAccountType(JSON.parse(authData).accountType)
  }, [])

  let renderedNavigation
  if (
    pathname === "/dashboard/assign/worksheet/[id]" ||
    pathname === "/dashboard/assign/worksheet/topic/[id]" ||
    pathname === "/dashboard/assign/assessment/[id]" ||
    pathname === "/dashboard/assign/assessment/questions/[id]"
  ) {
    renderedNavigation = (
      <div className="mt-2">
        <h3 className="px-3 text-xs font-semibold text-purple-300 uppercase tracking-wider">School Grades</h3>
        <div className="mt-2 space-y-1">
          {stages.map((stage: any) => (
            <motion.div key={stage._id} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <Link
                href={stage.stage}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50"
              >
                <span className="truncate">{stage.year}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    )
  } else {
    renderedNavigation = (
      <div className="space-y-4">
        {adminNav.map((item: any) => (
          <motion.div key={item.name} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
            <Link
              href={item.href}
              className={classNames(
                item.href === pathname
                  ? "bg-purple-100 text-purple-900"
                  : "text-gray-700 hover:text-purple-900 hover:bg-purple-50",
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
              )}
            >
              <item.icon
                className={classNames(
                  item.href === pathname ? "text-purple-600" : "text-gray-400 group-hover:text-purple-600",
                  "mr-3 flex-shrink-0 h-6 w-6",
                )}
                aria-hidden="true"
              />
              <span className="flex-1">{item.name}</span>
              {item.children && (
                <ChevronRightIcon
                  className={classNames(
                    item.href === pathname ? "text-purple-500 rotate-90" : "text-gray-400",
                    "ml-3 h-5 w-5 transform transition-transform duration-150",
                  )}
                />
              )}
            </Link>
            {item.children && (
              <div className="mt-1 pl-8 space-y-1">
                {item.children.map((subItem: any) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={classNames(
                      subItem.href === pathname ? "text-purple-700 font-medium" : "text-gray-600 hover:text-purple-700",
                      "group flex items-center px-3 py-2 text-sm rounded-md",
                    )}
                  >
                    <span className="truncate">{subItem.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    )
  }

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
                  {/* Mobile sidebar */}
                  <div className={`${manrope.className} flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4`}>
                    <div className="flex h-16 shrink-0 items-center border-b border-gray-200 py-6">
                      <Link href={"/dashboard"} className="flex items-center">
                        <Image width={200} height={100} className="h-14 w-auto" src={"/logo1.png"} alt="EdCenta" />
                        <h1 className="ml-2 text-xl font-bold">EdCenta</h1>
                      </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 px-2">
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs text-purple-600 font-medium">Users</p>
                        <p className="text-2xl font-bold text-purple-900">42</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs text-purple-600 font-medium">Subjects</p>
                        <p className="text-2xl font-bold text-purple-900">8</p>
                      </div>
                    </div>

                    <nav className="flex flex-1 flex-col">
                      <div className="space-y-1 px-2">{renderedNavigation}</div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
            <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6 py-8">
              <Link href={"/dashboard"} className="flex items-center">
                <Image width={200} height={100} className="h-14 w-auto" src={"/logo1.png"} alt="EdCenta" />
                <h1 className="ml-2 text-xl font-bold">EdCenta</h1>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 px-6">
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium">Users</p>
                <p className="text-2xl font-bold text-purple-900">42</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium">Subjects</p>
                <p className="text-2xl font-bold text-purple-900">8</p>
              </div>
            </div>

            <nav className="flex flex-1 flex-col px-6 py-4">
              <div className="space-y-1">{renderedNavigation}</div>

              <div className="mt-auto pt-10">
                <div className="rounded-md bg-purple-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                        <span className="text-purple-600 text-sm font-medium"></span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-purple-800"></h3>
                      <div className="mt-1 text-sm text-purple-700">
                        <p></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

            <TopNav />
          </div>

          <main className="py-10">
            <div className="px-4 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}

