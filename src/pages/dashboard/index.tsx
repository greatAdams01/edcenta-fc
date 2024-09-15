import { Fragment, useEffect, useState } from 'react'
import {
  PlusIcon, ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline'
import { getCookie } from 'cookies-next';

import AppLayout from '../../layout/AppLayout'
import { USER, STUDENTS } from '@/apollo/queries/dashboard';
import { useQuery } from '@apollo/client';
import { motion } from "framer-motion"
import Link from 'next/link';
import EditStudent from '@/components/dashbord/EditStudent';
import ModalAuth from '@/components/ModalComp';
import { IStudent } from '../../../types';
// import { Stats } from '@/utils/nav';

// const statuses: { [key: string]: string } = { Completed: 'text-green-400 bg-green-400/10', Incomplete: 'text-rose-400 bg-rose-400/10' }

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const { data: userData } = useQuery(USER);
  const { data: studentsData } = useQuery(STUDENTS);
  const user = userData?.user || [];
  const students = studentsData?.students.data || [];
  const [student, setStudent] = useState<IStudent | null>(null)
  const [isOpen, setOpen] = useState(false)

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade.year;
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

  const Stats = [
    {
      title: 'Account Setup',
      status: '90%'
    },
    {
      title: 'No. of Class',
      status: Object.keys(groupedStudents).length

    },
    {
      title: 'No. of Student',
      status: students.length
    },
    {
      title: 'Curriculum completed',
      status: '0'
    },
  ]


  return (
    <AppLayout>
      <motion.div
        animate={{}}>
        <header>
          {/* Heading */}
          <div className="flex flex-col items-start justify-between px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <div className="flex items-center gap-x-3">

                <h1 className="flex gap-x-3 text-base leading-7">
                  <span className="font-semibold">{accountType}</span>
                  <span className="text-gray-600">/</span>
                  <span className="font-semibold">Dashboard</span>
                </h1>
              </div>
            </div>
            <div className="flex order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">

              {user.isActive == true ? (
                <>
                  <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <p>Active</p>
                </>
              ) : (
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
          <div className="w-full grid md:flex font-bold gap-y-4 gap-x-10 my-4">

            {Stats.map((stat: any, index: any) => (
              <div key={index} className='w-full bg-[#0075BC] border border-[#8B53FF] rounded-md text-center py-6 text-white'>
                <p className="font-medium leading-6">{stat.title}</p>
                <p className="mt-2 flex justify-center gap-x-2  px-6">
                  <span className="text-4xl font-semibold tracking-tight">{stat.status}</span>
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* Activity list */}
        <div className="border-t border-white/10 pt-11">
          <h2 className="px-0 text-base font-semibold leading-7">Curriculum</h2>
          {Object.keys(groupedStudents).map((grade, index) => (
            <Fragment key={grade}>
              <section className="w-full my-4 bg-gray-200 border border-purple-500 rounded-md flex justify-between px-4 py-6">
                <div className="font-bold">
                  {grade} ({groupedStudents[grade].length} {groupedStudents[grade].length === 1 ? 'student' : 'students'})
                </div>
                <PlusIcon onClick={() => toggleDropdown(index)} className="w-6" />
              </section>
              {openSubtables[index] && (
                <section className='bg-gray-200 shadow-sm shadow-black shadow-opacity-50'>
                  <table className='w-full border-collapse border-gray-300' >
                    <thead className='w-full bg-[#0075BC] text-white '>
                      <tr className='w-full'>
                        <th className='py-4'>Name</th>
                        {/* <th className='hidden md:flex py-4 justify-center'>Recomendations</th> */}
                        <th>Assigned</th>
                        <th>Completed</th>
                        <th>Average(s)</th>

                        {/* <th>Status</th> */}
                        <th>Points</th>
                        <th>Rewards</th>
                        <th className='pr-4'>Login</th>
                      </tr>
                    </thead>
                    <tbody className='border-b border-white/10 font-bold '>
                      {groupedStudents[grade].map((student: any) => (
                        <tr key={student._id}>
                          <td onClick={() => { setStudent(student); setOpen(true) }} className='px-4 py-4'>
                            {student.name}
                          </td>
                          {/* <td className='text-center hidden md:flex justify-center py-4 '>1</td> */}
                          <td className='text-center'>1</td>
                          <td className='text-center'>1</td>

                          <td className='flex justify-between p-4 text-center text-white'>
                            <button className='bg-[#008000] p-2 rounded-sm '>8</button>
                            <button className='bg-[#FFA500] p-2 rounded-sm'>99</button>
                            <button className='bg-[#A020F0] p-2 rounded-sm'>200</button>
                            <button className='bg-[#FFC0CB] p-2 rounded-sm'>9</button>
                          </td>

                          {/* <td className='text-center'>20</td> */}
                          <td className='text-center'>10</td>
                          <td className='text-center'>
                            <Link href={'/dashboard/reward'}>0</Link>
                          </td>

                          <td className='text-center w-4 cursor-pointer pr-4'><a href='#' title={student.name}> <ArrowRightEndOnRectangleIcon className='w-6 text-green-900 hover:text-green-600' /> </a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}
              <ModalAuth
                isOpen={isOpen}
                XIcon={true}
                onClose={() => (setOpen(false))}>
                {student !== null && <EditStudent student={student} />}
              </ModalAuth>
            </Fragment>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  )
}
