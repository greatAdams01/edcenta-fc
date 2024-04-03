import { Fragment, useEffect, useState } from 'react'
import {
  PlusIcon, ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline'
import { getCookie } from 'cookies-next';

import AppLayout from '../../layout/AppLayout'
import { USER, STUDENTS } from '@/apollo/queries/dashboard';
import { useQuery } from '@apollo/client';

const stats = [
  { name: 'Account setup', value: '90%' },
  { name: 'No. of Class', value: '3' },
  { name: 'No. of Student', value: '230' },
  { name: 'Curriculum completed', value: '98.5%' },
]

// const statuses: { [key: string]: string } = { Completed: 'text-green-400 bg-green-400/10', Incomplete: 'text-rose-400 bg-rose-400/10' }

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const { data: userData } = useQuery(USER);
  const { data: studentsData } = useQuery(STUDENTS);
  const user = userData?.user || []; 
  const students = studentsData?.students || [];

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(student);
    return groups;
  }, {});

  const [openSubtables, setOpenSubtables] = useState<Array<boolean>>(Array(students.length).fill(false));
  const [accountType, setAccountType] = useState('' as string);

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables];
    newOpenSubtables[index] = !newOpenSubtables[index];
    setOpenSubtables(newOpenSubtables);
  };

  // Get Authdata from Cookies
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
    <AppLayout>
      <div>
            <header>
              {/* Heading */}
              <div className="flex flex-col items-start justify-between bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                <div>
                  <div className="flex items-center gap-x-3">
                   
                    <h1 className="flex gap-x-3 text-base leading-7">
                      <span className="font-semibold">{ accountType }</span>
                      <span className="text-gray-600">/</span>
                      <span className="font-semibold">Dashboard</span>
                    </h1>
                  </div>
                </div>
                <div className="flex order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
                
                  {user.isActive === true ? (
                    <>
                    <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <p>Active</p>
                  </>
                  ):(
                    <>
                    <div className="flex-none rounded-full bg-red-400/10 p-1 text-red-400">
                      <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <p>Inactive</p>
                    </>
                  )}
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
                    <p className="text-sm font-medium leading-6 text-purple-400">{stat.name}</p>
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
              {Object.keys(groupedStudents).map((grade, index) => (
                <Fragment key={grade}>
                  <section className="w-full my-4 bg-gray-200 border border-purple-500 rounded-md flex justify-between px-4 py-6">
                    <div className="font-bold">
                      {grade === "65ee6115df691bf5cea750a6" ? 'Primary 1' : 'Not Decided yet'} ({groupedStudents[grade].length} {groupedStudents[grade].length === 1 ? 'student' : 'students'})
                    </div>
                    <PlusIcon onClick={() => toggleDropdown(index)} className="w-6" />
                  </section>
                  {openSubtables[index] && (
                    <section className='bg-gray-200 shadow-sm shadow-black shadow-opacity-50'>
                      <table className='w-full border-collapse border-gray-300' >
                        <thead className='w-full bg-purple-500 bg-opacity-50'>
                          <tr className='w-full'>
                            <th className='py-4'>Name</th>
                            <th className='hidden md:flex py-4 justify-center'>Recomendations</th>
                            <th>Self-Asign</th>
                            <th>Status</th>
                            <th className='pr-4'>Login</th>
                          </tr>
                        </thead>
                        <tbody className='border-b border-white/10 font-bold '>
                          {groupedStudents[grade].map((student: any) => (
                            <tr key={student._id}>
                              <td className='px-4 py-4'>{student.name}</td>
                              <td className='text-center hidden md:flex justify-center py-4 '>1</td>
                              <td className='text-center'>1</td>
                              <td className='text-center'>20</td>
                              <td className='text-center w-4 cursor-pointer pr-4'><a href='#' title={student.name}> <ArrowRightEndOnRectangleIcon className='w-6 text-green-900 hover:text-green-600' /> </a></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  )}
                </Fragment>
              ))}
            </div>
      </div>
    </AppLayout>
  )
}
