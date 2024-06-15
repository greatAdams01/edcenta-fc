import { Fragment, useEffect, useState } from 'react'
import {
  PlusIcon,
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { TfiWrite } from 'react-icons/tfi'
import { FaArrowRightToBracket } from 'react-icons/fa6'
import { getCookie } from 'cookies-next'

import AppLayout from '../../../layout/AppLayout'
import { ASSIGNMENTS, STUDENTS } from '@/apollo/queries/dashboard'
import { useLazyQuery, useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'
import Pagination from '@/components/dashbord/Pagination'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Todo() {
  const { data: studentsData } = useQuery(STUDENTS)
  const students = studentsData?.students.data || []
  const [page, setPage] = useState(1)
  const [assignmentList, setAssignmentList] = useState<any[]>([])
  const [allOpen, setAllOpen] = useState(false)

  const authData: any = getCookie('Authdata')
  let authDataId: string | null = null

  if (authData) {
    try {
      authDataId = JSON.parse(authData)._id
    } catch (error) {
      console.error('Error parsing authData:', error)
    }
  }

  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'worksheet' | 'assessment'
  >('all')

  const [getAssignments, { loading, error, data }] = useLazyQuery(ASSIGNMENTS, {
    variables: {
      page,
      limit: 10,
      filter: '',
      studentId: authDataId,
      worksheetId: '',
    },
    onCompleted: (data) => {
      console.log('Data:', data)
      setAssignmentList(data.assignments.data)
    },
    onError: (error) => {
      console.log('Error:', error)
    },
  })
  useEffect(() => {
    console.log('assignmentList', assignmentList)
  }, [assignmentList])

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
    getAssignments({
      variables: {
        page: pageNum,
        limit: 10,
        filter: authDataId,
      },
    })
  }
  useEffect(() => {
    getAssignments()
  }, [])
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
                  <td className="w-[65%] pb-4">Title</td>
                  <td className="pb-4">Time assigned</td>
                  <td className="pb-4"></td>
                </tr>
              </thead>
              <tbody>
                {assignmentList &&
                  assignmentList.map((assignment) => (
                    <tr key={assignment._id}>
                      <td className="pr-6 text-left">
                        {assignment.worksheetId.title}
                      </td>
                      <td className="pr-6 text-left">
                        {new Date(
                          parseInt(assignment.createdAt),
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <Link
                          href={`todo/assigned/${assignment.worksheetId._id}`}
                        >
                          <FaArrowRightToBracket />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* {!allOpen && (
              <div>
                <button
                  onClick={() => setAllOpen(true)}
                  className="inline-flex w-[300px] cursor-pointer items-center justify-center rounded-md border border-[#EEEEEE] p-[10px] hover:border-indigo-900"
                >
                  <span>See all assigned activities</span>
                </button>
              </div>
            )} */}
          </div>
        </section>
        <Pagination
          page={page}
          count={data?.users?.totalPage}
          handlePageChange={async (e) => handlePageChange(e)}
        />
      </motion.div>
    </AppLayout>
  )
}
