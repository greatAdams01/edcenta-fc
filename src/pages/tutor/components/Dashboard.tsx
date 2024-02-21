import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const stats = [
  { name: 'Account setup', value: '90%' },
  { name: 'No. of Class', value: '3' },
  { name: 'No. of Student', value: '230' },
  { name: 'Curriculum completed', value: '98.5%' },
]
const statuses: { [key: string]: string } = { Completed: 'text-green-400 bg-green-400/10', Incomplete: 'text-rose-400 bg-rose-400/10' }

const activityItems = [
  {
    class: 'SS1',
    code: '2d89f0c8',
    status: 'Completed',
    topics: '100',
    student: '20',
    students:[{
      name:'John',
      assigned: '2',
      completed: '1',
      average:'80',
      mark: '20',
      badge: '4',
      reward: '6',
    },],
  },
  {
    class: 'Basic 2',
    code: '1329wqc2',
    status: 'Incompleted',
    topics: '85',
    student: '32',
    students:[{
      name:'John',
      assigned: '2',
      completed: '1',
      average:'80',
      mark: '20',
      badge: '4',
      reward: '6',
    },],
  },
  // More items...
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [openSubtables, setOpenSubtables] = useState(Array(activityItems.length).fill(false));

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables];
    newOpenSubtables[index] = !newOpenSubtables[index];
    setOpenSubtables(newOpenSubtables);
  };
  
  return (
    <>
      <div>
        <div className="lg:-mt-40">
          <main>
            <header>
              {/* Heading */}
              <div className="flex flex-col items-start justify-between bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                <div>
                  <div className="flex items-center gap-x-3">
                   
                    <h1 className="flex gap-x-3 text-base leading-7">
                      <span className="font-semibold">Tutor</span>
                      <span className="text-gray-600">/</span>
                      <span className="font-semibold">Dashboard</span>
                    </h1>
                  </div>
                  {/* <p className="mt-2 text-xs leading-6 text-gray-400">Deploys from GitHub via main branch</p> */}
                </div>
                <div className="flex order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
                <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                      <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                  Active
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, statIdx) => (
                  <div
                    key={stat.name}
                    className={classNames(
                      statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
                      'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8'
                    )}
                  >
                    <p className="text-sm font-medium leading-6 text-gray-400">{stat.name}</p>
                    <p className="mt-2 flex items-baseline gap-x-2">
                      <span className="text-4xl font-semibold tracking-tight">{stat.value}</span>
                    </p>
                  </div>
                ))}
              </div>
            </header>

            {/* Activity list */}
            <div className="border-t border-white/10 pt-11">
              <h2 className="px-4 text-base font-semibold leading-7 sm:px-6 lg:px-8">Curriculum</h2>
              <table className="mt-6 w-full whitespace-nowrap text-left min-w-full divide-y divide-gray-300">
                <colgroup>
                  <col className="w-full sm:w-4/12" />
                  <col className="lg:w-4/12" />
                  <col className="lg:w-2/12" />
                  <col className="lg:w-1/12" />
                  <col className="lg:w-1/12" />
                </colgroup>
                <thead className="border-b border-white/10 text-sm leading-6 bg-purple-500 bg-opacity-50">
                  <tr>
                    <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
                      Class
                    </th>
                    <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">
                      Class code 
                    </th>
                    <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
                      Status
                    </th>
                    <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">
                      Topics completed
                    </th>
                    <th
                      scope="col"
                      className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                    >
                      No. of Student
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Select</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activityItems.map((item, index) => (
                    <Fragment key={item.code}>
                      <tr>
                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8 border-t">
                          <div className="flex items-center gap-x-4">
                            <div className="truncate text-sm font-medium leading-6">{item.class}</div>
                          </div>
                        </td>
                        <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8 border-t">
                          <div className="flex gap-x-3">
                            <div className="font-mono text-sm leading-6 text-gray-400">{item.code}</div>
                          </div>
                        </td>
                        <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20 border-t">
                          <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                            <div className={classNames(statuses[item.status], 'flex-none rounded-full p-1')}>
                              <div className="h-1.5 w-1.5 rounded-full bg-current" />
                            </div>
                            <div className="hidden sm:block">{item.status}</div>
                          </div>
                        </td>
                        <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 md:table-cell lg:pr-20 border-t">
                          {item.topics}
                        </td>
                        <td className="hidden py-4 pl-0 pr-4 text-sm leading-6 sm:table-cell sm:pr-6 lg:pr-8 border-t">
                          {item.student}
                        </td>
                        <td className="py-4 text-sm leading-6 border-t">
                          <div className="flex justify-center text-green-500 items-center w-5">
                            <PlusIcon onClick={() => toggleDropdown(index)} />
                          </div>
                        </td>
                      </tr>
                      {openSubtables[index] && item.students && (
                        <tr>
                          <td colSpan={6}>
                            <table className="w-full border-collapse border-gray-300">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2">Name</th>
                                  <th className="px-4 py-2">Assigned</th>
                                  <th className="px-4 py-2">Completed</th>
                                  <th className="px-4 py-2">Average</th>
                                  <th className="px-4 py-2">Mark</th>
                                  <th className="px-4 py-2">Badge</th>
                                  <th className="px-4 py-2">Reward</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.students.map((student) => (
                                  <tr key={student.name}>
                                    <td className="border px-4 py-2">{student.name}</td>
                                    <td className="border px-4 py-2">{student.assigned}</td>
                                    <td className="border px-4 py-2">{student.completed}</td>
                                    <td className="border px-4 py-2">{student.average}</td>
                                    <td className="border px-4 py-2">{student.mark}</td>
                                    <td className="border px-4 py-2">{student.badge}</td>
                                    <td className="border px-4 py-2">{student.reward}</td>
                                  </tr>
                                ))}
                              </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>

              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
