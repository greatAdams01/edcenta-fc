import React from 'react';
import { Fragment, useState } from 'react'
import Link from 'next/link';

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

import { SchoolGrades } from '@/apollo/queries/dashboard';
import SubLayout from '../../../../layout/SubLayout';
import { useQuery } from '@apollo/client';

const activityItems = [
    {
      class: 'SS1',
      year: '1',
      code: '2d89f0c8',
      status: 'Completed',
      topics: '100',
      student: '20',
      students:[{
        name:'John',
        assigned: '2',
        score: '0',
        completed: '1',
        average:'80',
        mark: '20',
        badge: '4',
        reward: '6',
      },],
    },
    {
      class: 'Basic 2',
      year: '3',
      code: '1329wqc2',
      status: 'Incomplete',
      topics: '85',
      student: '32',
      students:[{
        name:'John',
        assigned: '2',
        score: '8',
        completed: '1',
        average:'80',
        mark: '20',
        badge: '4',
        reward: '6',
      },],
    },
  ]


interface WorksheetProps {
  _id: string;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

const Worksheet: React.FC<WorksheetProps> = ({ _id }) => {
  const [showClass, setShowClass] = useState(false); 

  const { data } = useQuery(SchoolGrades, {
    variables: { _id },
  });

  const schoolGrades = data?.schoolGrades || [];

  const [open, setOpen] = useState(true)

  const [openSubtables, setOpenSubtables] = useState(Array(activityItems.length).fill(false));

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables];
    newOpenSubtables[index] = !newOpenSubtables[index];
    setOpenSubtables(newOpenSubtables);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }
  return (
    <SubLayout>
      <div className='p-4'>
        <form onSubmit={handleSubmit}>
          <div className='flex w-full'>
            <div className='flex px-3 w-full py-3.5 bg-green-500 text-white font-bold'>
              {schoolGrades.length > 0 && schoolGrades[0].subject.length > 0 && (
                schoolGrades[0].subject[0].name
              )}
            </div>
            <div className="flex mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Link
                href={'/dashboard/assign'}
                type="button"
                className="flex items-center justify-center rounded-md bg-red-600 hover:bg-red-400 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mr-4"
              >
                Cancel
              </Link>
            </div>
          </div>

          <div className=''>
            <table className="min-w-full divide-y divide-gray-300">
              <thead className='ml-4'>
                <tr>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-gray-900">
                    Worksheet   
                  </th>
                  <th>
                    <input type='checkbox' />
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                    {schoolGrades ? (
                      <button onClick={() => setShowClass(true)} className='bg-[#00AE9A] bg-opacity-20 hover:bg-opacity-50 font-bold px-3 py-3 text-left text-sm text-gray-900 rounded-md'>
                        Assign Selected
                      </button>
                    ) : null}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schoolGrades.map((grade: any) => ( 
                  <tr key={grade._id}>
                    <td className="px-3 py-3.5 text-left text-sm text-gray-900 hover:underline cursor-pointer hover:text-green-500">{grade.subject[0].worksheet[0].title}</td>
                    <td className="px-3 py-3.5 text-center text-sm text-gray-900">{grade.subject[0].worksheet.length}</td>
                    <td className="px-3 py-3.5 text-center text-sm text-gray-900"><input type='checkbox'></input></td>
                    <button 
                    onClick={() => setShowClass(true)} className="bg-[#00AE9A] bg-opacity-20 hover:bg-opacity-50 font-bold mt-2 ml-6 px-3 py-3 text-left text-sm text-gray-900 rounded-md">Assign Topic </button>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

 {showClass && <div>
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-scroll">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setShowClass(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start w-full">
                  <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 flex">
                      Assign {}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Select class or students below to assign topic
                      </p>

                      {activityItems.map((item, index) => (
                    <Fragment key={item.code}>
                      <tr className='flex justify-between w-full'>
                        <div>
                      <td className="py-4 text-sm leading-6 border-t">
                          <div className="flex justify-center text-green-500 items-center w-5">
                            <PlusIcon onClick={() => toggleDropdown(index)} />
                          </div>
                        </td>
                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8 border-t">
                          <div className="flex items-center gap-x-4">
                            <div className="truncate text-sm font-medium leading-6">Year {item.year} ({item.students.length})</div>
                          </div>
                        </td>
                        </div>
                        <div className='flex items-center'>
                            <input type='checkbox'  className='mr-2'/> Assign to all
                        </div>
                      </tr>
                      {openSubtables[index] && item.students && (
                        <tr className=''>
                          <td colSpan={3} className='w-[100rem]'>
                            <table className="w-full border-collapse border-gray-300">
                              <thead className='bg-gray-200 w-full '>
                                <tr className='w-full'>
                                  <th className="px-4 py-2 text-left">Name</th>
                                  <th className="px-4 py-2 text-center">Best score</th>
                                  <th className="px-4 py-2 text-center">Assigned</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.students.map((student) => (
                                  <tr key={student.name} className='w-full'>
                                    <td className="border px-4 py-2 text-left">{student.name}</td>
                                    <td className="border px-4 py-2 text-center">{student.score}</td>
                                    <td className="border px-4 py-2 text-center"><input type='checkbox' /></td>
                                  </tr>
                                ))}
                              </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}

                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto"
                    onClick={() => setShowClass(false)}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
</div>}


        </form>
      </div>
    </SubLayout>
  );
};

export default Worksheet;
