import { Fragment, useEffect, useState } from 'react'
import {
  PlusIcon,
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { getCookie } from 'cookies-next'

import AppLayout from '../../layout/AppLayout'
import { USER, STUDENTS } from '@/apollo/queries/dashboard'
import { useQuery } from '@apollo/client'

// const statuses: { [key: string]: string } = { Completed: 'text-green-400 bg-green-400/10', Incomplete: 'text-rose-400 bg-rose-400/10' }

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

import AdminLayout from '@/layout/AdminLayout'

const AdminPage = () => {
  const { data: userData } = useQuery(USER)
  const { data: studentsData } = useQuery(STUDENTS)
  const user = userData?.user || []
  const students = studentsData?.students.data || []

  if (!Array.isArray(students)) {
    console.error('students is not an array:', students)
    return
  }

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(student)
    return groups
  }, {})

  const [openSubtables, setOpenSubtables] = useState<Array<boolean>>(
    Array(students.length).fill(false),
  )
  const [accountType, setAccountType] = useState('' as string)

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables]
    newOpenSubtables[index] = !newOpenSubtables[index]
    setOpenSubtables(newOpenSubtables)
  }

  // Get Authdata from Cookies
  const authData: any = getCookie('Authdata')

  useEffect(() => {
    if (!authData) {
      window.location.href = '/auth/login'
      return
    }
    console.log(JSON.parse(authData).accountType)
    setAccountType(JSON.parse(authData).accountType)
  }, [authData])

  return (
    <AdminLayout>
      <div>
        <header>
          {/* Heading */}
          <div className="flex flex-col items-start justify-between bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <div className="flex items-center gap-x-3">
                <h1 className="flex gap-x-3 text-base leading-7">
                  <span className="font-semibold">{accountType}</span>
                  <span className="text-gray-600">/</span>
                  <span className="font-semibold">Dashboard</span>
                </h1>
              </div>
            </div>
            <div className="order-first flex flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
              {user.isActive === true ? (
                <>
                  <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <p>Active</p>
                </>
              ) : (
                <>
                  <div className="flex-none rounded-full bg-red-400/10 p-1 text-red-400">
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <p>Inactive</p>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 bg-gray-700/10 font-bold sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-purple-400">
                Account setup
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                <span className="text-4xl font-semibold tracking-tight">
                  90%
                </span>
              </p>
            </div>
            <div className="border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-purple-400">
                No. of Class
              </p>
              <p className="mt-2 flex items-baseline gap-x-2  px-6">
                <span className="text-4xl font-semibold tracking-tight">
                  {Object.keys(groupedStudents).length}
                </span>
              </p>
            </div>
            <div className="border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-purple-400">
                No. of Student
              </p>
              <p className="mt-2 flex items-baseline gap-x-2  px-6">
                <span className="text-4xl font-semibold tracking-tight">
                  {students.length}
                </span>
              </p>
            </div>
            <div className="border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-purple-400">
                Curriculum completed
              </p>
              <p className="mt-2 flex items-baseline gap-x-2  px-6">
                <span className="text-4xl font-semibold tracking-tight">0</span>
              </p>
            </div>
          </div>
        </header>

        {/* Activity list */}
        <div className="border-t border-white/10 pt-11">
          <h2 className="px-4 text-base font-semibold leading-7 sm:px-6 lg:px-8">
            Curriculum
          </h2>
          {Object.keys(groupedStudents).map((grade, index) => (
            <Fragment key={grade}>
              <section className="my-4 flex w-full justify-between rounded-md border border-purple-500 bg-gray-200 px-4 py-6">
                <div className="font-bold">
                  {grade === '65ee6115df691bf5cea750a6'
                    ? 'Primary 1'
                    : 'Not Decided yet'}{' '}
                  ({groupedStudents[grade].length}{' '}
                  {groupedStudents[grade].length === 1 ? 'student' : 'students'}
                  )
                </div>
                <PlusIcon
                  onClick={() => toggleDropdown(index)}
                  className="w-6"
                />
              </section>
              {openSubtables[index] && (
                <section className="shadow-opacity-50 bg-gray-200 shadow-sm shadow-black">
                  <table className="w-full border-collapse border-gray-300">
                    <thead className="w-full bg-purple-500 bg-opacity-50">
                      <tr className="w-full">
                        <th className="py-4">Name</th>
                        <th className="hidden justify-center py-4 md:flex">
                          Recomendations
                        </th>
                        <th>Self-Asign</th>
                        <th>Status</th>
                        <th className="pr-4">Login</th>
                      </tr>
                    </thead>
                    <tbody className="border-b border-white/10 font-bold ">
                      {groupedStudents[grade].map((student: any) => (
                        <tr key={student._id}>
                          <td className="px-4 py-4">{student.name}</td>
                          <td className="hidden justify-center py-4 text-center md:flex ">
                            1
                          </td>
                          <td className="text-center">1</td>
                          <td className="text-center">20</td>
                          <td className="w-4 cursor-pointer pr-4 text-center">
                            <a href="#" title={student.name}>
                              {' '}
                              <ArrowRightEndOnRectangleIcon className="w-6 text-green-900 hover:text-green-600" />{' '}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminPage
