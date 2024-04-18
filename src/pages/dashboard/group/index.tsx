import React, { Fragment, useState } from 'react';
import { PlusIcon, ArrowRightEndOnRectangleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import AppLayout from '@/layout/AppLayout';
import { useQuery } from '@apollo/client';
import { STUDENTS } from '@/apollo/queries/dashboard';

export default function Group() {
  const { data } = useQuery(STUDENTS);
  const students = data?.students.data || [];

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade.year;
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
          
          <section className='flex w-full justify-between my-4'>
          <h1 className="font-bold text-lg">Manage Groups</h1>
            <a href={'/dashboard/group/add_group'} className='bg-[#00AE9A] bg-opacity-70 hover:bg-opacity-100 border rounded-md py-4 px-4 flex items-center justify-center text-center font-bold'>
              <PlusIcon className='w-4 mr-2' /> Add Group
            </a>
          </section>
          <section>
            <h1 className="font-bold text-lg my-4">Groups</h1>
            <div>
                    <section className='bg-gray-200 shadow-sm shadow-black shadow-opacity-50'>
                      <form>
                      <table className='w-full border-collapse border-gray-300' >
                        <thead className='w-full bg-purple-500 bg-opacity-50'>
                          <tr className='w-full'>
                            <th className='py-4'>Name</th>
                            <th className='hidden md:flex py-4 justify-center'>Owner/Assigned Teacher</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th className='pr-4'>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                        {Object.keys(groupedStudents).map((grade) => (
                          <Fragment key={grade}>
                            <tr className="">
                              <td className="h-10 flex items-center justify-center text-center font-semibold hover:underline cursor-pointer hover:text-green-500">
                                <p className=''>
                                {grade}
                                </p>
                                <PencilIcon className='w-6 ml-2' />
                              </td>
                              <td className='text-center'> You </td>
                              <td className='text-center flex items-center justify-center'>
                                <p>
                                {groupedStudents[grade].length}
                                </p>
                                <PencilIcon className='w-6 ml-2 cursor-pointer hover:text-blue-500 ' />
                              </td>
                              <td className='text-center'>
                              <label className="switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                              </label>
                              </td>
                              <td className='text-center flex items-center justify-center'>
                                <TrashIcon className='w-6  cursor-pointer hover:text-red-500' />
                              </td>
                            </tr>
                          </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </form> 
                    </section>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
