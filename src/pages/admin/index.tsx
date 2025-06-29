"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  PlusIcon,
  ArrowRightEndOnRectangleIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"
import { getCookie } from "cookies-next"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/router'

import AdminLayout from "@/layout/AdminLayout"
import { USER, STUDENTS } from "@/apollo/queries/dashboard"
import { useQuery } from "@apollo/client"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const AdminPage = () => {
  const router = useRouter()
  const { data: userData } = useQuery(USER)
  const { data: studentsData } = useQuery(STUDENTS)
  const user = userData?.user || []
  const students = studentsData?.students.data || []
  const [isClient, setIsClient] = useState(false)

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(student)
    return groups
  }, {})

  const [openSubtables, setOpenSubtables] = useState<Array<boolean>>(Array(students.length).fill(false))
  const [accountType, setAccountType] = useState("" as string)

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables]
    newOpenSubtables[index] = !newOpenSubtables[index]
    setOpenSubtables(newOpenSubtables)
  }

  // Get Authdata from Cookies
  const authData: any = getCookie("Authdata")

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    if (!authData) {
      router.push("/auth/login")
      return
    }
    console.log(JSON.parse(authData).accountType)
    setAccountType(JSON.parse(authData).accountType)
  }, [isClient, authData, router])

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-100  min-h-screen"
      >
        <header className="shadow-md bg-white">
          {/* Heading */}
          <div className="flex flex-col items-start justify-between px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <h1 className="text-2xl font-bold  text-gray-900">{accountType} Dashboard</h1>
              <p className="mt-1 text-sm  text-gray-500">Welcome back, {user.name}</p>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 p-6  bg-white">
            <StatCard
              title="Account setup"
              value="90%"
              icon={<ChartBarIcon className="h-6 w-6  text-purple-600" />}
            />
            <StatCard
              title="No. of Classes"
              value={Object.keys(groupedStudents).length.toString()}
              icon={<AcademicCapIcon className="h-6 w-6 text-blue-600" />}
            />
            <StatCard
              title="No. of Students"
              value={students.length.toString()}
              icon={<UserGroupIcon className="h-6 w-6  text-green-600" />}
            />
            <StatCard
              title="Curriculum completed"
              value="0"
              icon={<CheckCircleIcon className="h-6 w-6  text-orange-600" />}
            />
          </div>
        </header>

        {/* Activity list */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-900  mb-6">Curriculum</h2>
          <AnimatePresence>
            {Object.keys(groupedStudents).map((grade, index) => (
              <motion.div
                key={grade}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <motion.div
                  className="bg-white rounded-lg shadow-md overflow-hidden "
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
                  >
                    <span className="text-lg font-semibold text-gray-900 ">
                      {grade === "65ee6115df691bf5cea750a6" ? "Primary 1" : "Not Decided yet"} (
                      {groupedStudents[grade].length} {groupedStudents[grade].length === 1 ? "student" : "students"})
                    </span>
                    <PlusIcon
                      className={classNames(
                        "w-5 h-5 transition-transform duration-200 text-gray-500",
                        openSubtables[index] ? "transform rotate-45" : "",
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openSubtables[index] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <table className="w-full">
                          <thead className=" bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Recommendations
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider text-gray-500">
                                Self-Assign
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider text-gray-500">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider text-gray-500">
                                Login
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 ">
                            {groupedStudents[grade].map((student: any) => (
                              <tr key={student._id} className="hover:bg-gray-50 ">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium  text-gray-900">
                                  {student.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">1</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">1</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">20</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
                                  <a
                                    href="#"
                                    title={student.name}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md "
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 ">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900 ">{value}</p>
      </div>
      {icon}
    </div>
  </motion.div>
)

export default AdminPage



