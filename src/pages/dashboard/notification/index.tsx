"use client"
import type React from "react"
import { useState } from "react"
import { ToastContainer, toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AppLayout from "@/layout/AppLayout"
import { XCircleIcon, BellIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Notification } from "@/utils/nav"
import { motion, AnimatePresence } from "framer-motion"


function Index() {
  const [notifications, setNotifications] = useState(Notification)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const removeNotification = (index: number) => {
    const newNotifications = [...notifications]
    newNotifications.splice(index, 1)
    setNotifications(newNotifications)
    toast.success("Notification dismissed")
  }

  const clearAllNotifications = () => {
    setNotifications([])
    toast.success("All notifications cleared")
  }

  return (
    <AppLayout>
      <div className="grid justify-items-stretch transition-colors duration-200">
        <div className="w-full justify-self-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
          <div className="mb-6 flex w-full items-center justify-between gap-x-3 bg-purple-100 p-4 dark:bg-purple-900/20 rounded-t-lg transition-colors duration-200">
            <div className="flex w-full items-center justify-start gap-x-3">
              <BellIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                My Notifications
                <span className="ml-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300 transition-colors duration-200">
                  {notifications.length}
                </span>
              </h1>
            </div>
            {notifications.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllNotifications}
                className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
              >
                Clear all
              </motion.button>
            )}
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="w-full">
              <AnimatePresence>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-start justify-between p-4 rounded-lg border ${
                          message.score >= message.averageScore
                            ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                            : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                        } transition-colors duration-200`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 mt-0.5 ${
                              message.score >= message.averageScore
                                ? "text-green-500 dark:text-green-400"
                                : "text-red-500 dark:text-red-400"
                            }`}
                          >
                            {message.score >= message.averageScore ? (
                              <CheckCircleIcon className="h-5 w-5" />
                            ) : (
                              <XMarkIcon className="h-5 w-5" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                              {message.score >= message.averageScore ? (
                                <>
                                  <span className="font-semibold">{message.by}</span> successfully attempted{" "}
                                  <span className="font-semibold">"{message.topic}"</span>, scoring{" "}
                                  <span className="font-semibold text-green-600 dark:text-green-400">
                                    {message.score}%
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="font-semibold">{message.by}</span> unsuccessfully attempted{" "}
                                  <span className="font-semibold">"{message.topic}"</span>, scoring below{" "}
                                  <span className="font-semibold text-red-600 dark:text-red-400">
                                    {message.averageScore}%
                                  </span>
                                </>
                              )}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                              {new Date().toLocaleDateString()} •{" "}
                              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeNotification(index)}
                          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 transition-colors duration-200">
                      <BellIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200">
                      No notifications
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      You are all caught up! No new notifications at this time.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
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
    </AppLayout>
  )
}

export default Index

