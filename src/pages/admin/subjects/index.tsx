"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLazyQuery, useMutation } from "@apollo/client"
import { motion, AnimatePresence } from "framer-motion"
import {
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
  TagIcon,
  DocumentTextIcon,
  LinkIcon,
} from "@heroicons/react/24/outline"

import Pagination from "@/components/dashbord/Pagination"
import AdminLayout from "@/layout/AdminLayout"
import { SUBJECTS } from "@/apollo/queries/admin"
import ModalAuth from "@/components/ModalComp"
import type { ISubject } from "../../../../types"
import { DELETE_SUBJECT } from "@/apollo/mutations/admin"
import { showToast } from "@/utils/toast"
import EditSubject from "@/components/dashbord/EditSubject"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

function Subjects() {
  const [page, setPage] = useState(1)
  const [subjectType, setType] = useState("")
  const [subjectList, setSubjects] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [toDelete, setDelete] = useState(false)
  const [itemId, setItemId] = useState("")
  const [subject, setSubject] = useState<ISubject>({
    name: "",
    description: "",
    slug: "",
    tags: [],
    schoolGrade: "",
    save: () => {},
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

  const [getSubjects, { loading, error, data }] = useLazyQuery(SUBJECTS, {
    variables: { page, limit: 10, filter: subjectType },
    onCompleted: (data) => {
      setSubjects(data.subjects.data)
    },
  })

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
    getSubjects({
      variables: { page: pageNum, limit: 10, filter: subjectType },
    })
  }

  const [deleteSubject, deleteStatus] = useMutation(DELETE_SUBJECT, {
    variables: {
      id: itemId,
    },
    onCompleted: (data) => {
      if (data.deleteSubject) {
        showToast("success", "Subject deleted")
        // reload the page
        window.location.reload()
      } else {
        showToast("error", "Failed to delete subject")
      }
    },
    onError: (error) => {
      showToast("error", error.message)
    },
  })

  useEffect(() => {
    if (itemId) {
      const subject = subjectList.find((subject) => subject._id === itemId)
      setSubject(subject)
    }
    // Fetch data from API
    getSubjects()
  }, [page, itemId, open, getSubjects, subjectList])

  // Calculate stats
  const totalSubjects = subjectList.length
  const uniqueTags = new Set(subjectList.flatMap((subject) => subject.tags)).size
  const uniqueSlugs = new Set(subjectList.map((subject) => subject.slug)).size

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A list of all the subjects available in the platform.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4 sm:mt-0">
              <Link
                href="/admin/subjects/add_subject"
                className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800"
              >
                <PlusIcon className="mr-2 h-5 w-5" />
                Create Subject
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 bg-white dark:bg-gray-800">
            <StatCard
              title="Total Subjects"
              value={totalSubjects.toString()}
              icon={<BookOpenIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            />
            <StatCard
              title="Unique Tags"
              value={uniqueTags.toString()}
              icon={<TagIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            />
            <StatCard
              title="Unique Slugs"
              value={uniqueSlugs.toString()}
              icon={<LinkIcon className="h-6 w-6 text-green-600 dark:text-green-400" />}
            />
          </div>
        </header>

        {/* Subject list */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subject List</h2>
            <div className="mt-3 sm:mt-0">
              <select
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400"
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All Subjects</option>
                <option value="MATH">Mathematics</option>
                <option value="SCIENCE">Science</option>
                <option value="ENGLISH">English</option>
                <option value="HISTORY">History</option>
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
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Slug
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Tags
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
                  ) : subjectList.length > 0 ? (
                    <AnimatePresence>
                      {subjectList.map((subject, index) => (
                        <motion.tr
                          key={subject._id || index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link
                              href={`subjects/topics/${subject._id}`}
                              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                              {subject.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {subject.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {subject.slug}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex flex-wrap gap-1">
                              {subject.tags.map((tag: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, tagIndex: React.Key | null | undefined) => (
                                <span
                                  key={tagIndex}
                                  className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(subject._id)}
                                className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              >
                                <PencilIcon className="h-5 w-5" />
                                <span className="sr-only">Edit</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(subject._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <TrashIcon className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Link href={`subjects/topics/${subject._id}`}>
                                  <DocumentTextIcon className="h-5 w-5" />
                                  <span className="sr-only">Topics</span>
                                </Link>
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No subjects found
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
              count={data?.subjects?.totalPage || 1}
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
                <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Delete subject</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete <span className="font-bold">{subject?.name}</span>? All of {`it's`}{" "}
                    data will be permanently removed from our servers forever. This action cannot be undone.
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
                onClick={() => deleteSubject()}
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
          <EditSubject subject={subject} />
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

export default Subjects

