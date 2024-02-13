'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import {  UserCheck } from 'lucide-react';
import Image from 'next/image'

const navigation = [
  { name: 'Activities', href: '#', icon: CalendarIcon, current: true },
  { name: 'Progress', href: '#', icon: ChartPieIcon, current: false },
  { name: 'Accounts', href: '#', icon: UserCheck, current: false },
]
const teams = [
  { id: 1, name: 'My Details', href: '#', initial: 'D', current: false },
  { id: 2, name: 'My Subscriptions', href: '#', initial: 'S', current: false },
  { id: 3, name: 'My Account', href: '#', initial: 'A', current: false },
]



export default function Desktop() {

  return (
    <>
      <div className=''>
        <div className="hidden h-[100svh] lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <Image
                className="h-8 w-auto"
                src="/logo.png"
                alt="EdCenta"
                width={100}
                height={100}
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${
                            item.current
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon
                            className={`h-6 w-6 shrink-0
                            ${
                              item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                            }`}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${
                            team.current
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium 
                            ${
                              team.current
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600'
                            }`}
                          >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
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
      </div>
    </>
  )
}