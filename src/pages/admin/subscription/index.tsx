"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useLazyQuery } from "@apollo/client"
import { motion, AnimatePresence } from "framer-motion"
import { ReceiptRefundIcon, CheckBadgeIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline"

import AdminLayout from "@/layout/AdminLayout"
import { GET_SUBSCRIPTIONS } from "@/apollo/queries/admin"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const Subscription = () => {
  const [subs, setSubs] = useState<any[]>([])
  const [getSubscription, { loading, error, data }] = useLazyQuery(GET_SUBSCRIPTIONS, {
    onCompleted: (data) => {
      setSubs(data.getSubscriptions)
    },
  })

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  // Calculate stats
  const totalSubscriptions = subs.length
  const activeSubscriptions = subs.filter((s) => s.status === "active").length
  const pendingSubscriptions = subs.filter((s) => s.status === "pending").length
  const expiredSubscriptions = subs.filter((s) => s.status === "expired").length
  const autoRenewEnabled = subs.filter((s) => s.autoRenew === "true").length

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A list of all user subscriptions and their current status.
              </p>
            </div>
            <motion.div
              className="mt-4 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {totalSubscriptions} subscriptions
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 p-6 bg-white dark:bg-gray-800">
            <StatCard
              title="Active Subscriptions"
              value={activeSubscriptions.toString()}
              icon={<CheckBadgeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />}
            />
            <StatCard
              title="Pending Subscriptions"
              value={pendingSubscriptions.toString()}
              icon={<ClockIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            />
            <StatCard
              title="Expired Subscriptions"
              value={expiredSubscriptions.toString()}
              icon={<XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />}
            />
            <StatCard
              title="Auto-Renew Enabled"
              value={autoRenewEnabled.toString()}
              icon={<ReceiptRefundIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            />
          </div>
        </header>

        {/* Subscription list */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subscription List</h2>
            <div className="mt-3 sm:mt-0">
              <select className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400">
                <option value="">All Subscriptions</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
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
                      S/N
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Plan Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Plan Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Auto Renew
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Price
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
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
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
                  ) : subs.length > 0 ? (
                    <AnimatePresence>
                      {subs.map((sub, index) => (
                        <motion.tr
                          key={sub._id || index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {sub.plan.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {sub.user.firstName} {sub.user.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            ₦{sub.plan.planPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={classNames(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                sub.autoRenew === "true"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
                              )}
                            >
                              {sub.autoRenew === "true" ? "Enabled" : "Disabled"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            ₦{sub.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={classNames(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                sub.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : sub.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                              )}
                            >
                              {sub.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No subscriptions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

export default Subscription

