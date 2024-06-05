import { Fragment, useEffect, useState } from 'react'
import {
  PlusIcon,
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { TfiWrite } from 'react-icons/tfi'
import { FaArrowRightToBracket } from 'react-icons/fa6'
import { getCookie } from 'cookies-next'

import AppLayout from '../../../layout/AppLayout'
import { STUDENTS } from '@/apollo/queries/dashboard'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Todo() {
  const { data: studentsData } = useQuery(STUDENTS)
  const students = studentsData?.students.data || []
  const [allOpen, setAllOpen] = useState(false)

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade.year
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(student)
    return groups
  }, {})
  const [accountType, setAccountType] = useState('' as string)
  // Get Authdata from Cookies
  const authData: any = getCookie('Authdata')

  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'worksheet' | 'assessment'
  >('all')

  useEffect(() => {
    if (!authData) {
      window.location.href = '/auth/login'
      return
    }
    console.log(JSON.parse(authData).accountType)
    setAccountType(JSON.parse(authData).accountType)
  }, [authData])

  const Stats = [
    {
      title: 'Account Setup',
      status: '90%',
    },
    {
      title: 'No. of Class',
      status: Object.keys(groupedStudents).length,
    },
    {
      title: 'No. of Student',
      status: students.length,
    },
    {
      title: 'Curriculum completed',
      status: '0',
    },
  ]

  return (
    <AppLayout>
      <motion.div className="space-y-8" animate={{}}>
        <button
          onClick={() => setAllOpen(false)}
          className="mb-6 flex items-center gap-1 text-left text-black"
        >
          <IoIosArrowBack /> <div>Back</div>
        </button>
        <header>
          {/* Heading */}
          <h1 className="text-xl font-semibold text-gray-900">
            Your To Do List
          </h1>
        </header>
        <section className="space-y-8">
          <div className="space-y-5">
            <div className="flex w-full items-center justify-between gap-x-3 bg-[#00AE9A] bg-opacity-20 p-2">
              <div className="flex w-full items-center justify-start gap-x-3">
                <TfiWrite />
                <h2 className="text-lg font-semibold leading-6 text-gray-700">
                  Assigned to you
                </h2>
              </div>
              {allOpen && (
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
              )}
            </div>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <td className="w-[65%] pb-4"></td>
                  <td className="pb-4">Subject</td>
                  <td className="pb-4"></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pr-6 text-left">
                    Match Words Used in Geometry to Their Definiti
                  </td>
                  <td className="pr-6 text-left">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto"
                    >
                      Maths
                    </button>
                  </td>
                  <td>
                    <Link href={`todo/assigned/664cd84a9a0e6dc769f7bbd0`}>
                      <FaArrowRightToBracket />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
            {!allOpen && (
              <div>
                <button
                  onClick={() => setAllOpen(true)}
                  className="inline-flex w-[300px] cursor-pointer items-center justify-center rounded-md border border-[#EEEEEE] p-[10px] hover:border-indigo-900"
                >
                  <span>See all assigned activities</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </motion.div>
    </AppLayout>
  )
}
