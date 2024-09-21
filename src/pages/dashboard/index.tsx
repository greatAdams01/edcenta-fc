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




  return (
    <AppLayout>
      <motion.div
        animate={{}}>
        <header>
 
        <div className="border-b border-gray-200 pb-5">
      <div className="sm:flex sm:items-baseline sm:justify-between">
        <div className="sm:w-0 sm:flex-1">
          <h1 id="message-heading" className="text-base font-semibold leading-6 text-gray-900">
            Account status
          </h1>
          {/* <p className="mt-1 truncate text-sm text-gray-500">Checkout and Payments Team</p> */}
        </div>

        <div className="mt-4 flex items-center justify-between sm:ml-6 sm:mt-0 sm:flex-shrink-0 sm:justify-start">
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
