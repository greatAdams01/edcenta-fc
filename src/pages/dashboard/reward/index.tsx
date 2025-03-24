"use client"
import { PlusIcon, GiftIcon, CalendarIcon } from "@heroicons/react/24/outline"
import AppLayout from "@/layout/AppLayout"
import { useQuery } from "@apollo/client"
import { STUDENTS } from "@/apollo/queries/dashboard"
import { motion } from "framer-motion"

export default function Reward() {
  const { data } = useQuery(STUDENTS)
  const students = data?.students.data || []

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="w-full justify-self-center rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="mb-6 flex w-full items-center justify-between gap-x-3 bg-purple-100 p-4 rounded-t-lg">
            <div className="flex w-full items-center justify-start gap-x-3">
              <GiftIcon className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">Rewards</h1>
            </div>
          </div>

          <div className="px-6 pb-6">
            <section className="flex w-full flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-4">
              <select
                className="w-full sm:w-60 rounded-md border border-gray-300 bg-white px-2 py-4 text-gray-900"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a student
                </option>
                {students.map((student: any) => (
                  <option key={student._id} value={student.name} className="font-medium">
                    {student.name}
                  </option>
                ))}
              </select>

              <motion.a
                href={"#"}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Reward
              </motion.a>
            </section>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-purple-50 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-purple-200 p-3">
                    <GiftIcon className="h-6 w-6 text-purple-700" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Rewards</dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">12</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-purple-50 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-purple-200 p-3">
                    <CalendarIcon className="h-6 w-6 text-purple-700" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Rewards</dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">3</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Rewards</h3>
                <div className="mt-5 border-t border-gray-200">
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {[1, 2, 3].map((item) => (
                        <li key={item} className="py-5">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                                <GiftIcon className="h-6 w-6 text-purple-700" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">Achievement Badge</p>
                              <p className="truncate text-sm text-gray-500">
                                Awarded on {new Date().toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Claimed
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

