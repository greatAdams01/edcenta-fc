import { useEffect, useState } from 'react'
import Pagination from '@/components/dashbord/Pagination'
import { TfiWrite } from 'react-icons/tfi'
import { getCookie } from 'cookies-next'

import AppLayout from '../../../layout/AppLayout'
import { USER, STUDENTS } from '@/apollo/queries/dashboard'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
// import { Stats } from '@/utils/nav';

// const statuses: { [key: string]: string } = { Completed: 'text-green-400 bg-green-400/10', Incomplete: 'text-rose-400 bg-rose-400/10' }

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Completed() {
  const { data: userData } = useQuery(USER)
  const { data: studentsData } = useQuery(STUDENTS)
  const [page, setPage] = useState(1)
  const user = userData?.user || []
  const students = studentsData?.students.data || []

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade.year
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

  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'worksheet' | 'assessment'
  >('all')

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
  }

  return (
    <AppLayout>
      <motion.div className="space-y-8" animate={{}}>
        <header>
          {/* Heading */}
          <h1 className="text-xl font-semibold text-gray-900">
            Your To Do List
          </h1>
        </header>
        <section className="space-y-8">
          <div className="space-y-6">
            <div className="flex w-full items-center justify-between gap-x-3 bg-[#00AE9A] bg-opacity-20 p-2">
              <div className="flex w-full items-center justify-start gap-x-3">
                <TfiWrite />
                <h2 className="text-lg font-semibold leading-6 text-gray-700">
                  Assigned to you
                </h2>
              </div>
              <div className="mr-2">
                <select
                  className="rounded-md border-2 border-purple-500 px-3 py-2 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value as 'all' | 'worksheet' | 'assessment',
                    )
                  }
                >
                  <option value="all">All</option>
                  <option value="worksheet">Worksheet</option>
                  <option value="assessment">Assessment</option>
                </select>
              </div>
            </div>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <td className="w-[65%] pb-4">Title</td>
                  <td className="pb-4">Subject</td>
                  <td className="pb-4">Attempted</td>
                  <td className="pb-4">Score</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pr-6 text-left">
                    Match Words Used in Geometry to Their Definiti
                  </td>
                  <td className="pr-6 text-left">
                    <button className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                      11+
                    </button>
                  </td>
                  <td>05-Jun-2024</td>
                  <td>
                    <button className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                      10/10
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="pr-6 text-left">
                    Match Words Used in Geometry to Their Definiti
                  </td>
                  <td className="pr-6 text-left">
                    <button className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                      11+
                    </button>
                  </td>
                  <td>05-Jun-2024</td>
                  <td>
                    <button className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                      10/10
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="pr-6 text-left">
                    Match Words Used in Geometry to Their Definiti
                  </td>
                  <td className="pr-6 text-left">
                    <button className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                      11+
                    </button>
                  </td>
                  <td>05-Jun-2024</td>
                  <td>
                    <button className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                      10/10
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="pr-6 text-left">
                    Match Words Used in Geometry to Their Definiti
                  </td>
                  <td className="pr-6 text-left">
                    <button className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                      11+
                    </button>
                  </td>
                  <td>05-Jun-2024</td>
                  <td>
                    <button className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                      10/10
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="pr-6 text-left">
                    Match Words Used in Geometry to Their Definiti
                  </td>
                  <td className="pr-6 text-left">
                    <button className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                      11+
                    </button>
                  </td>
                  <td>05-Jun-2024</td>
                  <td>
                    <button className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                      10/10
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <Pagination
              page={page}
              count={5}
              handlePageChange={async (e) => handlePageChange(e)}
            />
          </div>
        </section>
      </motion.div>
    </AppLayout>
  )
}