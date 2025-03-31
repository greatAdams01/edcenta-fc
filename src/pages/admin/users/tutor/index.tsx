"use client"

import { GET_TUTOR_STUDENTS } from "@/apollo/queries/admin"
import Pagination from "@/components/dashbord/Pagination"
import AdminLayout from "@/layout/AdminLayout"
import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserGroupIcon, EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

const Tutor = () => {
  const [page, setPage] = useState(1)
  const router = useRouter()
  const [students, setStudents] = useState([])
  console.log(router.query.page)

  const { data, loading } = useQuery(GET_TUTOR_STUDENTS, {
    variables: { page, limit: 10, filter: router.query.page },
    onCompleted: (data) => {
      setStudents(data.students.data)
      console.log(data.students.data)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
  }

  // Calculate stats
  const activeStudents = students.filter((student: any) => student.isActive).length
  const inactiveStudents = students.length - activeStudents

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen dark:from-gray-900 dark:to-gray-800"
      >
        <header className="bg-white shadow-md dark:bg-gray-800">
          {/* Heading */}
          <div className="flex flex-col items-start justify-between px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and view all students assigned to tutors
              </p>
            </div>
            <motion.div
              className="mt-4 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 sm:mt-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Total: {students.length}
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 p-6 bg-white dark:bg-gray-800">
            <StatCard
              title="Total Students"
              value={students.length.toString()}
              icon={<UserGroupIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            />
            <StatCard
              title="Active Students"
              value={activeStudents.toString()}
              icon={<CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />}
            />
            <StatCard
              title="Inactive Students"
              value={inactiveStudents.toString()}
              icon={<EnvelopeIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            />
          </div>
        </header>

        {/* Student list */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Student List</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex justify-center">
                          <svg
                            className="animate-spin h-5 w-5 text-purple-600 dark:text-purple-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ) : students.length > 0 ? (
                    <AnimatePresence>
                      {students.map((person: any, index) => (
                        <motion.tr
                          key={person.email || index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {person.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {person.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                person.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {person.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <Pagination
              page={page}
              count={data?.students?.totalPage || 1}
              handlePageChange={async (e) => handlePageChange(e)}
            />
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700"
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
      {icon}
    </div>
  </motion.div>
)

export default Tutor

