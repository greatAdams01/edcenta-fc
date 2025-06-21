"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  PlusIcon,
  ArrowRightEndOnRectangleIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import { getCookie } from "cookies-next"
import { motion, AnimatePresence } from "framer-motion"

import AdminLayout from "@/layout/AdminLayout"
import { USER, STUDENTS } from "@/apollo/queries/dashboard"
import { useQuery, useLazyQuery } from "@apollo/client"
import Pagination from "@/components/dashbord/Pagination"
import ModalAuth from "@/components/ModalComp"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const AdminPage = () => {
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [toDelete, setDelete] = useState(false)
  const [itemId, setItemId] = useState("")
  const [accountType, setAccountType] = useState("" as string)

  const { data: userData } = useQuery(USER)
  const user = userData?.user || []

  const [students, { loading, error, data }] = useLazyQuery(STUDENTS, {
    variables: { page, limit: 10, filter: "" },
  })

  const studentList = data?.students?.data || []

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
    students({ variables: { page: pageNum, limit: 10, filter: "" } })
  }

  const handleDelete = (id?: string) => {
    setItemId(id ? id : "")
    setDelete(!toDelete)
    setOpen(!open)
  }

  const handleEdit = (id?: string) => {
    setItemId(id ? id : "")
    setOpen(!open)
  }

  // Get Authdata from Cookies
  const authData: any = getCookie("Authdata")

  useEffect(() => {
    if (!authData) {
      window.location.href = "/auth/login"
      return
    }
    setAccountType(JSON.parse(authData).accountType)

    // Fetch data from API
    students()
  }, [authData, students])

  // Calculate stats
  const activeStudents = studentList.filter((student: any) => student.isActive).length
  const inactiveStudents = studentList.length - activeStudents
  const uniqueClasses = new Set(studentList.map((student: any) => student.grade?.year).filter(Boolean)).size

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen"
      >
        <header className="bg-white shadow-md">
          {/* Heading */}
          <div className="flex flex-col items-start justify-between px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{accountType} Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back, {user.name}</p>
            </div>
            <motion.div
              className={classNames(
                "mt-4 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium",
                user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user.isActive ? "Active" : "Inactive"}
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 p-6 bg-white">
            <StatCard
              title="Total Students"
              value={studentList.length.toString()}
              icon={<UserGroupIcon className="h-6 w-6 text-purple-600" />}
            />
            <StatCard
              title="Active Students"
              value={activeStudents.toString()}
              icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
            />
            <StatCard
              title="Classes"
              value={uniqueClasses.toString()}
              icon={<AcademicCapIcon className="h-6 w-6 text-blue-600" />}
            />
            <StatCard
              title="Inactive Students"
              value={inactiveStudents.toString()}
              icon={<ChartBarIcon className="h-6 w-6 text-orange-600" />}
            />
          </div>
        </header>

        {/* Student list */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Student List</h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 sm:mt-0 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Student
            </motion.button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Class
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Year
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stage
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        <div className="flex justify-center">
                          <svg
                            className="animate-spin h-5 w-5 text-purple-600"
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
                  ) : studentList.length > 0 ? (
                    <AnimatePresence>
                      {studentList.map((person: any, index: number) => (
                        <motion.tr
                          key={person._id}
                          className="hover:bg-gray-50"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {person.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {person.grade?.year || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {person.grade?.year || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {person.grade?.stage || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                person.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {person.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(person._id)}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                <PencilIcon className="h-5 w-5" />
                                <span className="sr-only">Edit</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(person._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                                <span className="sr-only">Login</span>
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
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

      {/* Modal for edit/delete */}
      <ModalAuth
        isOpen={open}
        XIcon={true}
        onClose={() => (toDelete ? handleDelete() : setOpen(false))}
        styling={toDelete ? "w-[500px] m-auto" : "w-[1000px] m-auto"}
      >
        {toDelete ? (
          <>
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Delete account</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-bold">{studentList.find((s: any) => s._id === itemId)?.name}</span>? All of{" "}
                    {`it's`} data will be permanently removed from our servers forever. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
                onClick={() => {
                  /* deleteStudent() */
                }}
              >
                Delete
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => handleDelete()}
              >
                Cancel
              </motion.button>
            </div>
          </>
        ) : (
          <>
            {/* EditStudent component would go here */}
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900">Edit Student</h2>
              <p className="mt-1 text-sm text-gray-500">Update student information</p>
              {/* Form fields would go here */}
            </div>
          </>
        )}
      </ModalAuth>
    </AdminLayout>
  )
}

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <motion.div className="bg-white p-6 rounded-lg shadow-md" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
  </motion.div>
)

export default AdminPage

