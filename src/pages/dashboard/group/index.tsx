"use client"

import { useState } from "react"
import { PlusIcon, PencilIcon, TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"

import AppLayout from "@/layout/AppLayout"
import { useQuery } from "@apollo/client"
import { STUDENTS } from "@/apollo/queries/dashboard"
import Link from "next/link"

export default function Group() {
  const { data } = useQuery(STUDENTS)
  const students = data?.students.data || []

  const groupedStudents = students.reduce((groups: any, student: any) => {
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
      <div className="grid justify-items-stretch transition-colors duration-200">
        <div className="w-full justify-self-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
          <div className="mb-6 flex w-full items-center justify-between gap-x-3 bg-purple-100 p-4 dark:bg-purple-900/20 rounded-t-lg transition-colors duration-200">
            <div className="flex w-full items-center justify-start gap-x-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                Manage Groups
              </h1>
            </div>
          </div>

          <div className="px-6 pb-6">
            <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                Organize your students into groups for easier management
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-3 sm:mt-0">
                <Link
                  href={"/dashboard/group/add_group"}
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200"
                >
                  <PlusIcon className="mr-2 h-5 w-5" /> Add Group
                </Link>
              </motion.div>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
                Groups
              </h2>

              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                    <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="hidden md:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                        >
                          Owner/Assigned Teacher
                        </th>
                        <th
                          scope="col"
                          className="md:hidden px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                        >
                          Owner
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                        >
                          Students
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                      {Object.keys(groupedStudents).length > 0 ? (
                        Object.keys(groupedStudents).map((grade, index) => (
                          <tr
                            key={grade}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <motion.span
                                  className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  {grade}
                                </motion.span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="ml-2 text-gray-400 hover:text-purple-600 dark:text-gray-500 dark:hover:text-purple-400 transition-colors duration-200"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </motion.button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                              You
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                  {groupedStudents[grade].length}
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="ml-2 text-gray-400 hover:text-purple-600 dark:text-gray-500 dark:hover:text-purple-400 transition-colors duration-200"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </motion.button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                              </label>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center">
                                <motion.button
                                  whileHover={{ scale: 1.1, color: "#ef4444" }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500 transition-colors duration-200"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </motion.button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200"
                          >
                            No groups found. Create a group to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {Object.keys(groupedStudents).length === 0 && (
                <div className="mt-4 text-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                    <Link
                      href={"/dashboard/group/add_group"}
                      className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200"
                    >
                      <PlusIcon className="mr-2 h-5 w-5" /> Create Your First Group
                    </Link>
                  </motion.div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

