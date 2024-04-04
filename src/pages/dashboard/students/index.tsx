import React, { Fragment, useState } from 'react';
import { PlusIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

import AppLayout from '@/layout/AppLayout';
import { useQuery } from '@apollo/client';
import { STUDENTS } from '@/apollo/queries/dashboard';

export default function Manage() {
  const { data } = useQuery(STUDENTS);
  const students = data?.students || [];

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(student);
    return groups;
  }, {});

  const [openSubtables, setOpenSubtables] = useState<Array<boolean>>(Array(Object.keys(groupedStudents).length).fill(false));

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables];
    newOpenSubtables[index] = !newOpenSubtables[index];
    setOpenSubtables(newOpenSubtables);
  };

  return (
    <AppLayout>
      <div className='grid justify-items-stretch'>
        <div className='w-full px-4 sm:px-6 lg:px-8 border-2 p-8 rounded-md justify-self-center'>
          <h1 className="font-bold text-lg">Manage Student</h1>
          <section className='flex w-full justify-between my-4'>
            <p>you have {students.length} active {students.length === 1 ? 'student' : 'students'}</p>
            <a href={'/dashboard/students/add_student'} className='bg-[#00AE9A] bg-opacity-70 hover:bg-opacity-100 border rounded-md py-4 px-4 flex items-center justify-center text-center font-bold'>
              <PlusIcon className='w-4 mr-2' /> Add student
            </a>
          </section>
          <section>
            <h1 className="font-bold text-lg">Classes</h1>
            <div>
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
                              <td className='text-center w-4 cursor-pointer pr-4'><a href='#' title={student.name}> <ArrowRightEndOnRectangleIcon /> </a></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  )}
                </Fragment>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
