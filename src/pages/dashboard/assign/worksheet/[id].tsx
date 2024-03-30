import React, { Fragment, useState } from 'react';
import Link from 'next/link';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'; 

import { manrope } from '@/utils/font';
import { SchoolGrades } from '@/apollo/queries/dashboard';
import AppLayout from '../../../../layout/AppLayout';
import { USER, STUDENTS } from '@/apollo/queries/dashboard';
import { useQuery } from '@apollo/client';

interface WorksheetProps {
  _id: string;
}

const Worksheet: React.FC<WorksheetProps> = ({ _id }) => {
  const [check, setCheck] = useState<boolean>(true)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [showClass, setShowClass] = useState(false);

  const { data } = useQuery(SchoolGrades, {
    variables: { _id },
  });

  const schoolGrades = data?.schoolGrades || [];

  const [open, setOpen] = useState(true);
  const { data: userData } = useQuery(USER);
  const { data: studentsData } = useQuery(STUDENTS);
  const user = userData?.user || [];
  const students = studentsData?.students || [];

  const [openSubtables, setOpenSubtables] = useState<boolean[]>(Array(students.length).fill(false));

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables];
    newOpenSubtables[index] = !newOpenSubtables[index];
    setOpenSubtables(newOpenSubtables);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  function checkAll() {
    selectedSubjects.length === schoolGrades.length * students.length;
    const allTopicIds = schoolGrades.flatMap((grade: any) =>
        grade.subject.flatMap((subject: any) => subject.topics.map((topic: any) => topic._id))
      );
      setSelectedSubjects(allTopicIds);
      setCheck(false);
  }

  function uncheckAll() {
    selectedSubjects.length === 0;
    setSelectedSubjects([]);
    setCheck(true);
  }
  

  const checkBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedSubjects([...selectedSubjects, value]);
    } else {
      setSelectedSubjects(prevData => prevData.filter(id => id !== value));
    }
  };

  return (
    <AppLayout>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex w-full items-center">
            <div className="flex px-3 ml-4 lg:ml-0 w-full py-3.5 bg-[#00AE9A] bg-opacity-70 text-white font-bold">
              {schoolGrades.length > 0 && schoolGrades[0].subject.length > 0 && schoolGrades[0].subject[0].name}
            </div>
            <div className="ml-6 sm:ml-16 sm:mt-0 sm:flex-none">
              <Link
                href={'/dashboard/assign'}
                type="button"
                className="flex items-center justify-center rounded-md bg-red-600 hover:bg-red-400 px-3 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mr-4"
              >
                Cancel
              </Link>
            </div>
          </div>

          <div className="">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="ml-4">
                <tr>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-gray-900">
                    Worksheet
                  </th>
                  <th>
                    <input type="checkbox" onClick={!check ? uncheckAll : checkAll} />
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                    {schoolGrades ? (
                      <button
                        onClick={() => setShowClass(true)}
                        className="bg-[#00AE9A] bg-opacity-20 hover:bg-opacity-50 font-bold px-3 py-3 text-left text-sm text-gray-900 rounded-md"
                      >
                        Assign Selected
                      </button>
                    ) : null}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schoolGrades.map((grade: any) =>
                  grade.subject.map((subject: any) =>
                    subject.topics.map((topic: any, index: number) => (
                      <tr key={topic._id}>
                        <td className="px-3 py-3.5 text-left text-sm text-gray-900 hover:underline cursor-pointer hover:text-green-500">
                          <a href={`/dashboard/assign/worksheet/topic/${topic._id}`}>{topic.name}</a>
                        </td>
                        <td className="px-3 py-3.5 text-center text-sm text-gray-900">{topic.worksheet.length}</td>
                        <td className="px-3 py-3.5 text-center text-sm text-gray-900">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(topic._id)}
                            value={topic._id}
                            onChange={checkBoxHandler}
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => setShowClass(true)}
                            className="bg-[#00AE9A] bg-opacity-20 hover:bg-opacity-50 font-bold my-2 ml-4 px-3 py-3 text-left text-sm text-gray-900 rounded-md"
                          >
                            Assign it
                          </button>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
          {showClass && (
            <div>
              <Transition.Root show={showClass} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setShowClass}>
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
                              <Dialog.Title as="h3" className={`${manrope.className} text-base font-semibold leading-6 text-gray-900 flex`}>
                                Assign {}
                              </Dialog.Title>
                              <div className={`${manrope.className} mt-2`}>
                                <p className="text-sm text-gray-500">Select class or students below to assign Worksheet</p>
                                {students.map((student: any, index: number) => (
                                  <Fragment key={student._id}>
                                    <section className="w-full my-4 bg-gray-200 border border-purple-500 rounded-md flex justify-between px-4 py-6">
                                      <div className="font-bold flex">
                                        <div className="flex justify-center text-green-500 items-center w-5">
                                          <PlusIcon onClick={() => toggleDropdown(index)} />
                                        </div>
                                        <div className="truncate text-sm font-medium leading-6 gap-x-4 mx-2">
                                          {student.grade === '65ee6115df691bf5cea750a6' ? 'Primary 1' : 'Not Decided yet'} ({students.length}{' '}
                                          {student.length === 1 ? 'students' : 'student'})
                                        </div>
                                      </div>

                                      <div className="flex items-center">
                                        <input type="checkbox" className="mr-2" /> Assign to all
                                      </div>
                                    </section>
                                    {openSubtables[index] && student._id && (
                                      <section className="bg-gray-200 shadow-sm shadow-black shadow-opacity-50 truncate text-sm font-medium leading-6">
                                        <table className="w-full border-collapse border-gray-300">
                                          <thead className="w-full bg-purple-500 bg-opacity-50">
                                            <tr className={`${manrope.className} w-full`}>
                                              <th className="py-4 px-4">Name</th>
                                              <th>Best Score</th>
                                              <th>Assigned</th>
                                              <th className="flex items-center">
                                                <input type="checkbox" className="mr-2 my-6" /> Assign to all
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="border-b border-white/10 font-bold">
                                            <tr className={`${manrope.className}`}>
                                              <td className="px-4 py-4">{student.name}</td>
                                              <td className="text-center">20</td>
                                              <td className="text-center">1</td>
                                              <td className="border px-4 py-2 text-center">
                                                <input type="checkbox" />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </section>
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
            </div>
          )}
        </form>
      </div>
    </AppLayout>
  );
};

export default Worksheet;
