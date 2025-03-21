import { Fragment, useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useQuery } from '@apollo/client'
import { getCookie } from 'cookies-next'
import { manrope } from '@/utils/font'
import TopNav from './TopNav'
import { adminNav } from '@/utils/nav'
import { STAGES } from '@/apollo/queries/dashboard'
import Link from 'next/link'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { pathname, query } = router
  const { id } = query

  const { data } = useQuery(STAGES)
  const stages = data?.schoolGrades || []

  const [accountType, setAccountType] = useState('')

  useEffect(() => {
    const authData: any = getCookie('Authdata')
    if (!authData) {
      window.location.href = '/auth/login'
      return
    }
    setAccountType(JSON.parse(authData).accountType)
  }, [])

  let renderedNavigation
  if (
    pathname === '/dashboard/assign/worksheet/[id]' ||
    pathname === '/dashboard/assign/worksheet/topic/[id]' ||
    pathname === '/dashboard/assign/assessment/[id]' ||
    pathname === '/dashboard/assign/assessment/questions/[id]'
  ) {
    renderedNavigation = stages.map((stage: any) => (
      <li key={stage._id} className="">
        <p
          className={classNames(
            'group flex gap-x-3 rounded-md bg-[#00AE9A] bg-opacity-20 p-2 text-lg font-semibold leading-6',
          )}
        >
          Key Stage {stage.stage}
        </p>
        <ul className="my-2 pl-4">
          {stages.map((stage: any) => (
            <li key={stage._id} className="w-full pt-2">
              <Link
                href={stage.stage}
                className="text-md group flex gap-x-3 rounded-md p-2 pl-8 font-semibold leading-6 hover:bg-[#00AE9A] hover:bg-opacity-20"
              >
                {stage.year}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    ))
  } else {
    renderedNavigation = adminNav.map((item: any) => (
      <li key={item.name}>
        <Link
          href={item.href}
          className={classNames(
            item.href === pathname
              ? 'bg-gray-500 font-semibold text-indigo-600'
              : 'text-gray-700 hover:text-indigo-600',
            'group flex gap-x-3 rounded-md bg-[#00AE9A] bg-opacity-20 p-2 text-lg font-semibold leading-6',
          )}
        >
          <item.icon
            className={classNames(
              item.href === pathname
                ? 'text-indigo-500'
                : 'group-hover:text-indigo-600',
              'h-6 w-6 shrink-0',
            )}
            aria-hidden="true"
          />
          {item.name}
        </Link>
        {item.children && (
          <ul className="my-2 pl-4">
            {item.children.map((subItem: any) => (
              <li key={subItem.name}>
                <Link
                  href={subItem.href}
                  className={classNames(
                    subItem.href === pathname
                      ? 'text-indigo-500'
                      : 'hover:text-gray-600',
                    'ml-8 space-y-4 font-semibold',
                  )}
                >
                  {subItem.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
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
                    <div
                      className={`absolute left-full top-0 flex w-16 justify-center pt-5`}
                    >
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div
                    className={`${manrope.className} flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4`}
                  >
                    <div className="flex h-16 shrink-0 items-center">
                      <Link href={'/dashboard'} className="flex items-center">
                        <Image
                          width={200}
                          height={100}
                          className="h-14 w-auto"
                          src={'/logo1.png'}
                          alt="EdCenta"
                        />
                      </Link>
                      <h1 className="ml-2 text-xl font-bold">EdCenta</h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {renderedNavigation}
                          </ul>
                        </li>
                        <li></li>
                        <li className="mt-auto">
                          <Link
                            href="#"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                          >
                            <Cog6ToothIcon
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                              aria-hidden="true"
                            />
                            Settings
                          </Link>
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
              <Link href={'/dashboard'} className="flex items-center">
                <Image
                  width={200}
                  height={100}
                  className="h-14 w-auto"
                  src={'/logo1.png'}
                  alt="EdCenta"
                />
                <h1 className="ml-2 text-xl font-bold">EdCenta</h1>
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {renderedNavigation}
                  </ul>
                </li>
                <li></li>
                <li className="mt-auto">
                  <Link
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-200 lg:hidden"
              aria-hidden="true"
            />

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
