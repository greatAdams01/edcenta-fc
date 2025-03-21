"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLazyQuery, useMutation } from "@apollo/client"
import { motion, AnimatePresence } from "framer-motion"
import {
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"

import Pagination from "@/components/dashbord/Pagination"
import AdminLayout from "@/layout/AdminLayout"
import { USERS } from "@/apollo/queries/admin"
import ModalAuth from "@/components/ModalComp"
import { AccountType, type IUser } from "../../../../types"
import { DELETE_USER } from "@/apollo/mutations/admin"
import { showToast } from "@/utils/toast"
import EditUser from "@/components/dashbord/EditUser"

function Users() {
  const [page, setPage] = useState(1)
  const [userType, setType] = useState("")
  const [userList, setUsers] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [toDelete, setDelete] = useState(false)
  const [itemId, setItemId] = useState("")
  const [user, setUser] = useState<IUser>({
    firstName: "",
    lastName: "",
    email: "",
    phone: 0,
    facebookId: "",
    googleId: "",
    address: "",
    password: "",
    city: "",
    state: "",
    otp: 0,
    isVerified: false,
    ninverified: false,
    dob: "",
    sex: "",
    lastLoggedIn: "",
    accountType: AccountType.ADMIN,
    isActive: false,
    bName: "",
    bankName: "",
    bank: "",
    acctNumber: "",
    bankCode: 0,
    occupation: "",
  })

  const handleDelete = (id?: string) => {
    setItemId(id ? id : "")
    setDelete(!toDelete)
    setOpen(!open)
  }

  const handleEdit = (id?: string) => {
    setItemId(id ? id : "")
    setOpen(!open)
  }

  const [users, { loading, error, data }] = useLazyQuery(USERS, {
    variables: { page, limit: 10, filter: userType },
    onCompleted: (data) => {
      setUsers(data.users.data)
    },
  })

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
    users({ variables: { page: pageNum, limit: 10, filter: userType } })
  }

  const [deleteUser, deleteStatus] = useMutation(DELETE_USER, {
    variables: {
      deleteUserId: itemId,
    },
    onCompleted: (data) => {
      console.log(data)
      showToast("success", "User deleted")
      window.location.reload()
    },
    onError: (error) => {
      showToast("error", error.message)
    },
  })

  useEffect(() => {
    if (itemId) {
      const user = userList.find((user) => user._id === itemId)
      setUser(user)
    }
    users()
  }, [page, itemId, users, userList])

  // Calculate stats
  const adminUsers = userList.filter((user) => user.accountType === "ADMIN").length
  const tutorUsers = userList.filter((user) => user.accountType === "TUTOR").length
  const parentUsers = userList.filter((user) => user.accountType === "PARENT").length
  const activeUsers = userList.filter((user) => user.isActive).length

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A list of all the users in your account including their name, email and role.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Add User
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 p-6 bg-white dark:bg-gray-800">
            <StatCard
              title="Total Users"
              value={userList.length.toString()}
              icon={<UserGroupIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            />
            <StatCard
              title="Admin Users"
              value={adminUsers.toString()}
              icon={<UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            />
            <StatCard
              title="Tutor Users"
              value={tutorUsers.toString()}
              icon={<UserGroupIcon className="h-6 w-6 text-green-600 dark:text-green-400" />}
            />
            <StatCard
              title="Active Users"
              value={activeUsers.toString()}
              icon={<UserGroupIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            />
          </div>
        </header>

        {/* User list */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User List</h2>
            <div className="mt-3 sm:mt-0">
              <select
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400"
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All Users</option>
                <option value="OWNER">Owner</option>
                <option value="PARENT">Parent</option>
                <option value="TUTOR">Tutor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

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
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
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
                  ) : userList.length > 0 ? (
                    <AnimatePresence>
                      {userList.map((person, index) => (
                        <motion.tr
                          key={person.email || index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {person.firstName} {person.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {person.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {person.accountType}
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
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(person._id)}
                                className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              >
                                <PencilIcon className="h-5 w-5" />
                                <span className="sr-only">Edit</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(person._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <TrashIcon className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </motion.button>
                              {person.accountType === "TUTOR" && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <Link href={`users/tutor?page=${person._id}`}>
                                    <EyeIcon className="h-5 w-5" />
                                    <span className="sr-only">View</span>
                                  </Link>
                                </motion.button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No users found
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
              count={data?.users?.totalPage || 1}
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
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Delete account</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                      {user?.firstName} {user?.lastName}
                    </span>{" "}
                    ? All of {`it's`} data will be permanently removed from our servers forever. This action cannot be
                    undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={deleteStatus.loading}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                onClick={() => deleteUser()}
              >
                {deleteStatus.loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                ) : (
                  "Delete"
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={deleteStatus.loading}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto"
                onClick={() => handleDelete()}
              >
                Cancel
              </motion.button>
            </div>
          </>
        ) : (
          <EditUser user={user} />
        )}
      </ModalAuth>
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

export default Users

