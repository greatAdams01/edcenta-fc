import React, { useState, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'; 

import { manrope } from '@/utils/font';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { TOPIC_QUERY, STUDENTS } from '@/apollo/queries/dashboard'

import AppLayout from '@/layout/AppLayout'



const TopicPage = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [checkStudent, setCheckStudent] = useState<boolean>(true)
  const [selectedStudent, setSelectedStudent]= useState<string[]>([])
  const [showClass, setShowClass] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const { data: studentsData } = useQuery(STUDENTS);


  const { data } = useQuery(TOPIC_QUERY, {
    variables: { topicId: id },
  });

  const topic = data?.topic || {};

  const students = studentsData?.students.data || [];
  const [openSubtables, setOpenSubtables] = useState<boolean[]>(Array(students.length).fill(false));

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables];
    newOpenSubtables[index] = !newOpenSubtables[index];
    setOpenSubtables(newOpenSubtables);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  
  function checkAllStudent(){
    const selectAllStudent = students.flatMap((student: any) => student._id );
    setSelectedStudent(selectAllStudent);
    setCheckStudent(false)
  }

  function uncheckAllStudent(){
    selectedStudent.length === 0;
    setSelectedStudent([]);
    setCheckStudent(true)
  }

  const checkBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = e.target.value;
    const isChecked = e.target.checked;
    const studentIsChecked = e.target.checked

    if (isChecked) {
      setSelectedSubjects([...selectedSubjects, value]);
    } else {
      setSelectedSubjects(prevData => prevData.filter(id => id !== value));
    }

    if (studentIsChecked){
      setSelectedStudent([...selectedStudent, value]);
    }else {
      setSelectedStudent(prevData => (prevData.filter(id => id !== value)))
    }
  };

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade.year;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(student);
    return groups;
  }, {});


  return (
    <AppLayout>
      <Fragment>
        <h1 className='text-center font-bold text-2xl'>{topic.name}</h1>
        <p className='my-2 mx-2 text-normal'>{topic.description}</p>
        <div className='w-full flex justify-center'>
        <button onClick={() => setShowClass(true)} className='bg-green-500 hover:bg-green-400 rounded-md text-white py-2 px-4 font-bold '>Asign it</button>
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
                                {Object.keys(groupedStudents).map((grade, index) => (
                                    <Fragment key={grade}>
                                      <section className="w-full my-4 bg-gray-200 border border-purple-500 rounded-md flex justify-between px-4 py-6">
                                      <div className="font-bold flex">
                                        <div className="flex justify-center text-green-500 items-center w-5 mr-2">
                                          <PlusIcon onClick={() => toggleDropdown(index)} />
                                        </div>
                                          {grade} ({groupedStudents[grade].length} {groupedStudents[grade].length === 1 ? 'student' : 'students'})
                                        </div>
                                        <div className="flex items-center">
                                        <input type="checkbox" onClick={!checkStudent ? uncheckAllStudent : checkAllStudent} className="mr-2" /> Assign to all
                                      </div>
                                      </section>
                                      {openSubtables[index] && (
                                        <section className="bg-gray-200 shadow-sm shadow-black shadow-opacity-50 truncate text-sm font-medium leading-6">
                                          <form>
                                          <table className="w-full border-collapse border-gray-300">
                                          <thead className="w-full bg-purple-500 bg-opacity-50">
                                            <tr className={`${manrope.className} w-full`}>
                                              <th className="py-4 px-4">Name</th>
                                              <th>Best Score</th>
                                              <th>Assigned</th>
                                              <th>Check</th>
                                            </tr>
                                          </thead>
                                          <tbody className="border-b border-white/10 font-bold">
                                              {groupedStudents[grade].map((student: any) => (
                                                <tr key={student._id} className={`${manrope.className}`}>
                                                  <td className="px-4 py-4">{student.name}</td>
                                              <td className="text-center">20</td>
                                              <td className="text-center">1</td>
                                              <td className="border px-4 py-2 text-center">
                                              <input type="checkbox" checked={selectedStudent.includes(student._id)}  value={student._id} onChange={checkBoxHandler}/>
                                              </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </form> 
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

      </Fragment>
    </AppLayout>
  );
};

export default TopicPage;
