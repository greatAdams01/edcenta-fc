import React, { Fragment, useEffect, useState } from 'react'
import {
  PlusIcon,
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline'

import AppLayout from '@/layout/AppLayout'
import { useQuery } from '@apollo/client'
import { STUDENTS } from '@/apollo/queries/dashboard'
import Link from 'next/link'

export default function Manage() {
  const { data } = useQuery(STUDENTS)
  const students = data?.students.data || []
  const [allStudents, setAllStudents] = useState(data?.students.data || [])

  const filterStudents = (status: string) => {
    if (status === "active") {
      const data = students.filter((single: { isActive: any }) => single.isActive)
      setAllStudents(data)
    } else if (status === "inactive") {
      const data = students.filter((single: { isActive: any }) => !single.isActive)
      setAllStudents(data)
    } else {
      setAllStudents(students)
    }
  }
  useEffect(() => {
    filterStudents("")
  }, [students])

  const groupedStudents = allStudents.reduce((groups: any, student: any) => {
    const groupKey = student.grade.year
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(student)
    return groups
  }, {})

  const [openSubtables, setOpenSubtables] = useState<Array<boolean>>(
    Array(Object.keys(groupedStudents).length).fill(false),
  )

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables]
    newOpenSubtables[index] = !newOpenSubtables[index]
    setOpenSubtables(newOpenSubtables)
  }

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="w-full justify-self-center rounded-md border-2 p-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-bold">Manage Student</h1>
          <section className="my-4 flex w-full justify-between">
            <p>
              you have {students.length} students
            </p>
            <Link
              href={'/dashboard/students/add_student'}
              className="flex items-center justify-center rounded-md border bg-[#00AE9A] bg-opacity-70 px-4 py-4 text-center font-bold hover:bg-opacity-100"
            >
              <PlusIcon className="mr-2 w-4" /> Add student
            </Link>
          </section>
          <section>
            <div className='flex justify-between'>
              <h1 className="text-lg font-bold">Manage students</h1>
              <select onChange={(e) => filterStudents(e.target.value)} className='border border-gray-100 px-6 py-2'>
                <option value="">Show All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              {Object.keys(groupedStudents).map((grade, index) => (
                <Fragment key={grade}>
                  <section className="my-4 flex w-full justify-between rounded-md border border-purple-500 bg-gray-200 px-4 py-6">
                    <div className="font-bold">
                      {grade} ({groupedStudents[grade].length}{' '}
                      {groupedStudents[grade].length === 1
                        ? 'student'
                        : 'students'}
                      )
                    </div>
                    <PlusIcon
                      onClick={() => toggleDropdown(index)}
                      className="w-6"
                    />
                  </section>
                  {openSubtables[index] && (
                    <section className="shadow-opacity-50 bg-gray-200 shadow-sm shadow-black">
                      <form>
                        <table className="w-full border-collapse border-gray-300">
                          <thead className="w-full bg-[#0075BC] text-white">
                            <tr className="w-full">
                              <th className="py-4">Name</th>
                              <th className="hidden justify-center py-4 md:flex">
                                Recomendations
                              </th>
                              <th>Self-Asign</th>
                              <th>Status</th>
                              <th className="pr-4">Login</th>
                            </tr>
                          </thead>
                          <tbody className="border-b border-white/10 font-bold ">
                            {groupedStudents[grade].map((student: any) => (
                              <tr key={student._id}>
                                <td className="px-4 py-4">{student.name}</td>
                                <td className="hidden justify-center py-4 text-center md:flex ">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                  </label>
                                </td>
                                <td className="text-center">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                  </label>
                                </td>
                                <td className="text-center">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                  </label>
                                </td>
                                <td className="w-2 cursor-pointer pr-4 text-center">
                                  <a href="#" title={student.name}>
                                    {' '}
                                    <ArrowRightEndOnRectangleIcon className="w-9" />{' '}
                                  </a>
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
          </section>
        </div>
      </div>
    </AppLayout>
  )
}
