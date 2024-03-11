import { useState } from 'react';
import { useQuery } from '@apollo/client';


import AppLayout from '../../../layout/AppLayout';
import { classes } from '@/utils/nav';
import Link from 'next/link';
import { SchoolGrades } from '@/apollo/queries/dashboard';

export default function Assign() {
  const [subjects, setSubjects] = useState([]);
  const [schoolGrades, setSchoolGrades] = useState([]);
  const Subjects = Array.from(new Set(classes.flatMap(Class => Class.subjects.map(subject => subject.name))));

  useQuery(SchoolGrades, {
    onCompleted: (data) => {
      console.log(data.schoolGrades)
      setSchoolGrades(data.schoolGrades)
      setSubjects(Array.from(new Set(data.schoolGrades.flatMap((grade:any) => grade.subjects.map((subject: any) => subject.name)))));
      console.log(data.schoolGrades.map((grade:any) => grade.subjects.map((subject: any) => subject.name)))
      // setFullName(`${data.user.firstName} ${data.user.lastName}`)
      // dispatch(setUser(data.user))
    }
  })
  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Assigned Classes</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all assigned classes and students.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-purple-600 hover:bg-purple-400 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Class
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className='ml-4'>
                  <tr>
                    <th scope="col" className="text-center bg-purple-300 w-2 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">
                      Key Stage
                    </th>
                    <th scope="col" className="text-center px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Year
                    </th>
                    <th scope="col" className="text-center px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Age
                    </th>
                    {Subjects.map((subject, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`text-center px-3 py-3.5 text-left text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                      >
                        {subject}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {classes.map((Class, index) => (
                    <tr key={index}>
                      <td className="text-center bg-purple-400 hover:bg-purple-900 hover:text-white whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-4">
                        {Class.stage}
                      </td>
                      <td className="text-center whitespace-nowrap px-3 py-4 text-sm text-gray-500">{Class.year}</td>
                      <td className="text-center whitespace-nowrap px-3 py-4 text-sm text-gray-500">{Class.ages}</td>
                      {Class.subjects.map((subject, subjectIndex) => (
                        <td
                          key={`${index}-${subjectIndex}`}
                          className={`text-center px-3 py-3.5 text-left text-sm font-semibold ${
                            subjectIndex === 0 ? 'bg-yellow-500 hover:bg-yellow-800 hover:text-white' : subjectIndex === 1 ? 'bg-green-500 hover:bg-green-900 hover:text-white' : subjectIndex === 2 ? 'bg-blue-500 hover:bg-blue-900 hover:text-white' : 'bg-orange-500 hover:bg-orange-900 hover:text-white'
                          }`}
                        >
                          <Link href={`/dashboard/assign/${subject._id}`} className='cursor-pointer'> 
                            {subject.worksheet ? (
                              subject.worksheet.map((worksheet, worksheetIndex) => (
                                <div key={worksheetIndex}>
                                  <p>Worksheet: {worksheet.number}</p>
                                  <p>Topics: {worksheet.topics}</p>
                                </div>
                              ))
                            ) : (
                              <div>
                                <p>No worksheet available</p>
                              </div>
                            )}
                          </Link>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
