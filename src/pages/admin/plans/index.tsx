"use client"

import { DELETE_PLAN } from "@/apollo/mutations/admin"
import { GET_PLANS } from "@/apollo/queries/admin"
import ModalAuth from "@/components/ModalComp"
import AdminLayout from "@/layout/AdminLayout"
import { showToast } from "@/utils/toast"
import { useLazyQuery, useMutation } from "@apollo/client"
import { ExclamationTriangleIcon, PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Plans = () => {
  const router = useRouter()
  const [plans, setPlans] = useState([])
  const [open, setOpen] = useState(false)
  const [itemId, setItemId] = useState("")

  const [getPlans, { loading, error, data }] = useLazyQuery(GET_PLANS, {
    onCompleted: (data) => {
      setPlans(data.getPlans)
    },
  })

  const [deletePlan, deleteStatus] = useMutation(DELETE_PLAN, {
    variables: {
      id: itemId,
    },
    onCompleted: (data) => {
      showToast("success", "Plan deleted")
      window.location.reload()
    },
    onError: (error) => {
      showToast("error", error.message)
    },
  })

  useEffect(() => {
    getPlans()
  }, [getPlans])

  return (
    <AdminLayout>
      <div className="grid justify-items-stretch transition-colors duration-200">
        <div className="w-full justify-self-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
          <div className="mb-6 flex w-full items-center justify-between gap-x-3 bg-purple-100 p-4 dark:bg-purple-900/20 rounded-t-lg transition-colors duration-200">
            <div className="flex w-full items-center justify-start gap-x-3">
              <DocumentTextIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                Plans
              </h1>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                A list of all the plans available in the platform.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-3 sm:mt-0">
                <Link
                  href="/admin/plans/add_plan"
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200"
                >
                  <PlusIcon className="mr-2 h-5 w-5" /> New Plan
                </Link>
              </motion.div>
            </div>

            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                      <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                          >
                            S/N
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                          >
                            Code
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                          >
                            Course Count
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-3 pr-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                        {plans.length > 0 ? (
                          plans.map((plan: any, index) => (
                            <motion.tr
                              key={plan._id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                                {index + 1}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                                {plan.title}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                ₦{plan.planPrice}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 transition-colors duration-200">
                                  {plan.planCode}
                                </span>
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                {plan.allowedCourseList.length}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => router.push(`/admin/plans/add_plan?edit=${plan._id}&id=${index}`)}
                                    className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                    <span className="sr-only">Edit</span>
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                      setItemId(plan._id)
                                      setOpen(true)
                                    }}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                    <span className="sr-only">Delete</span>
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200"
                            >
                              {loading ? (
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
                              ) : (
                                "No plans found. Create a plan to get started."
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {plans.length === 0 && !loading && (
              <div className="mt-4 text-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Link
                    href="/admin/plans/add_plan"
                    className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200"
                  >
                    <PlusIcon className="mr-2 h-5 w-5" /> Create Your First Plan
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalAuth isOpen={open} XIcon={true} onClose={() => setOpen(false)} styling="w-[500px] m-auto">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10 transition-colors duration-200">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white transition-colors duration-200">
              Delete Plan
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Are you sure you want to delete this Plan? All of {`it's`} data will be permanently removed from our
                servers forever. This action cannot be undone.
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
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto transition-colors duration-200"
            onClick={() => deletePlan()}
          >
            {deleteStatus.loading ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            Cancel
          </motion.button>
        </div>
      </ModalAuth>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
    </AdminLayout>
  )
}

export default Plans

