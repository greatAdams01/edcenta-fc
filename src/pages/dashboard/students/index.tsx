"use client"

import { useEffect, useState } from "react"
import {
  PlusIcon,
  ArrowRightEndOnRectangleIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline"
import { motion } from "framer-motion"

import AppLayout from "@/layout/AppLayout"
import { useQuery } from "@apollo/client"
import { STUDENTS } from "@/apollo/queries/dashboard"
import Link from "next/link"

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="w-full justify-self-center rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="mb-6 flex w-full items-center justify-between gap-x-3 bg-purple-100 p-4 rounded-t-lg">
            <div className="flex w-full items-center justify-start gap-x-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">Manage Students</h1>
            </div>
          </div>

          <div className="px-6 pb-6">
            <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-sm text-gray-600">
                You have <span className="font-semibold text-purple-600">{students.length}</span> students
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-3 sm:mt-0">
                <Link
                  href={"/dashboard/students/add_student"}
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <PlusIcon className="mr-2 h-5 w-5" /> Add Student
                </Link>
              </motion.div>
            </section>

            <section className="mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Student List</h2>
                <select
                  onChange={(e) => filterStudents(e.target.value)}
                  className="mt-2 sm:mt-0 block w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                >
                  <option value="">Show All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-4">
                {Object.keys(groupedStudents).map((grade, index) => (
                  <div key={grade} className="overflow-hidden rounded-lg border border-gray-200">
                    <motion.button
                      onClick={() => toggleDropdown(index)}
                      className="flex w-full items-center justify-between bg-purple-50 px-4 py-3 text-left font-medium text-gray-900 hover:bg-purple-100"
                      whileHover={{ backgroundColor: "rgba(147, 51, 234, 0.1)" }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="font-semibold">
                        {grade} ({groupedStudents[grade].length}{" "}
                        {groupedStudents[grade].length === 1 ? "student" : "students"})
                      </span>
                      {openSubtables[index] ? (
                        <ChevronUpIcon className="h-5 w-5 text-purple-600" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-purple-600" />
                      )}
                    </motion.button>

                    {openSubtables[index] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="hidden md:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Recommendations
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Self-Assign
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Status
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Login
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {groupedStudents[grade].map((student: any) => (
                                <tr key={student._id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {student.name}
                                  </td>
                                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" className="sr-only peer" />
                                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" className="sr-only peer" />
                                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" className="sr-only peer" />
                                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <motion.a
                                      href="#"
                                      title={student.name}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="inline-flex text-purple-600 hover:text-purple-900"
                                    >
                                      <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                                    </motion.a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}

                {Object.keys(groupedStudents).length === 0 && (
                  <div className="rounded-lg border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">No students found. Add students to get started.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

