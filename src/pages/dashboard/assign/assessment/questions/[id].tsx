import React, { useState, useEffect, Fragment } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

import { manrope } from '@/utils/font'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import {
  QUESTIONS,
  STUDENTS,
  WORKSHEET_BY_ID,
} from '@/apollo/queries/dashboard'
import AppLayout from '@/layout/AppLayout'
import { ASSIGN_WORKSHEET } from '@/apollo/mutations/dashboard'

import Pagination from '@/components/dashbord/Pagination'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { IoIosArrowBack } from 'react-icons/io'

const QuestionPage = () => {
  const router = useRouter()
  const path = useRouter()
  const { id } = router.query
  const [selectedSubjects, setSelectedSubjects] = useState(id)
  const [checkStudent, setCheckStudent] = useState<boolean>(true)
  const [selectedStudent, setSelectedStudent] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [showClass, setShowClass] = useState(false)

  const { data: studentsData } = useQuery(STUDENTS)
  const [assignWorksheet] = useMutation(ASSIGN_WORKSHEET)
  const { data } = useQuery(QUESTIONS, {
    variables: {
      page,
      limit: 10,
      filter: '',
      levelId: '',
      subjectId: '',
      worksheetId: id,
    },
  })
  useEffect(() => {
    setSelectedSubjects(id)
  }, [id])

  const {
    data: worksheetData,
    loading,
    error,
  } = useQuery(WORKSHEET_BY_ID, {
    variables: { worksheetId2: id },
  })

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
    data({
      variables: {
        page,
        limit: 10,
        filter: '',
        levelId: '',
        subjectId: '',
        worksheetId: id,
      },
    })
  }

  const questions = data?.questions.data || []

  const students = studentsData?.students.data || []
  const [openSubtables, setOpenSubtables] = useState<boolean[]>(
    Array(students.length).fill(false),
  )

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables]
    newOpenSubtables[index] = !newOpenSubtables[index]
    setOpenSubtables(newOpenSubtables)
  }

  function checkAllStudent() {
    const selectAllStudent = students.flatMap((student: any) => student._id)
    setSelectedStudent(selectAllStudent)
    setCheckStudent(false)
  }

  function uncheckAllStudent() {
    selectedStudent.length === 0
    setSelectedStudent([])
    setCheckStudent(true)
  }

  const checkBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const isChecked = e.target.checked
    const type = e.target.getAttribute('data-type')

    if (type === 'student') {
      if (isChecked) {
        setSelectedStudent([...selectedStudent, value])
      } else {
        setSelectedStudent((prevData) => prevData.filter((id) => id !== value))
      }
    }
  }

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade.year
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(student)
    return groups
  }, {})
  const handleAssignWorksheet = async () => {
    try {
      await assignWorksheet({
        variables: {
          studentIds: selectedStudent,
          worksheetId: selectedSubjects,
        },
      })
      toast.success('Worksheet Assigned successfully')
      setShowClass(false)
    } catch (error) {
      toast.error('Error assigning worksheet ' + error)
      console.log(error)
    }
    console.log(selectedStudent, selectedSubjects)
  }
  return (
    <AppLayout>
      <Fragment>
        <button
          onClick={() => path.back()}
          className="mb-6 flex items-center gap-1 text-left text-black"
        >
          <IoIosArrowBack /> <div>Back</div>
        </button>
        <h1 className="mb-2 text-center text-2xl font-bold">
          {worksheetData?.worksheet.title}
        </h1>
        <div className="mb-4 flex w-full justify-end">
          <button
            onClick={() => setShowClass(true)}
            className="rounded-md bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-400 "
          >
            Assign it
          </button>
        </div>
        <div className="">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="ml-4">
              <tr>
                <th
                  scope="col"
                  className="w-4/12 px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                >
                  Questions{' '}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                >
                  Explanation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {questions.map((question: any, index: number) => (
                <Fragment key={question._id}>
                  <tr>
                    <td className="cursor-pointer px-3 py-3.5 text-left text-sm text-gray-900">
                      {question.title}
                    </td>
                    <td className="px-3 py-3.5 text-left text-sm text-gray-900">
                      {question.explanation}
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          count={data?.users?.totalPage}
          handlePageChange={async (e) => handlePageChange(e)}
        />
        {showClass && (
          <div>
            <Transition.Root show={showClass} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={setShowClass}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-scroll">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setShowClass(false)}
                          >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="w-full sm:flex sm:items-start">
                          <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <Dialog.Title
                              as="h3"
                              className={`${manrope.className} flex text-base font-semibold leading-6 text-gray-900`}
                            >
                              Assign {}
                            </Dialog.Title>
                            <div className={`${manrope.className} mt-2`}>
                              <p className="text-sm text-gray-500">
                                Select class or students below to assign
                                Worksheet
                              </p>
                              {Object.keys(groupedStudents).map(
                                (grade, index) => (
                                  <Fragment key={grade}>
                                    <section className="my-4 flex w-full justify-between rounded-md border border-purple-500 bg-gray-200 px-4 py-6">
                                      <div className="flex font-bold">
                                        <div className="mr-2 flex w-5 items-center justify-center text-green-500">
                                          <PlusIcon
                                            onClick={() =>
                                              toggleDropdown(index)
                                            }
                                          />
                                        </div>
                                        {grade} ({groupedStudents[grade].length}{' '}
                                        {groupedStudents[grade].length === 1
                                          ? 'student'
                                          : 'students'}
                                        )
                                      </div>
                                      <div className="flex items-center">
                                        <input
                                          type="checkbox"
                                          onClick={
                                            !checkStudent
                                              ? uncheckAllStudent
                                              : checkAllStudent
                                          }
                                          className="mr-2"
                                        />{' '}
                                        Assign to all
                                      </div>
                                    </section>
                                    {openSubtables[index] && (
                                      <section className="shadow-opacity-50 truncate bg-gray-200 text-sm font-medium leading-6 shadow-sm shadow-black">
                                        <form>
                                          <table className="w-full border-collapse border-gray-300">
                                            <thead className="w-full bg-purple-500 bg-opacity-50">
                                              <tr
                                                className={`${manrope.className} w-full`}
                                              >
                                                <th className="px-4 py-4">
                                                  Name
                                                </th>
                                                <th>Best Score</th>
                                                <th>Assigned</th>
                                                <th>Check</th>
                                              </tr>
                                            </thead>
                                            <tbody className="border-b border-white/10 font-bold">
                                              {groupedStudents[grade].map(
                                                (student: any) => (
                                                  <tr
                                                    key={student._id}
                                                    className={`${manrope.className}`}
                                                  >
                                                    <td className="px-4 py-4">
                                                      {student.name}
                                                    </td>
                                                    <td className="text-center">
                                                      20
                                                    </td>
                                                    <td className="text-center">
                                                      1
                                                    </td>
                                                    <td className="border px-4 py-2 text-center">
                                                      <input
                                                        type="checkbox"
                                                        data-type="student"
                                                        checked={selectedStudent.includes(
                                                          student._id,
                                                        )}
                                                        value={student._id}
                                                        onChange={
                                                          checkBoxHandler
                                                        }
                                                      />
                                                    </td>
                                                  </tr>
                                                ),
                                              )}
                                            </tbody>
                                          </table>
                                        </form>
                                      </section>
                                    )}
                                  </Fragment>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto"
                            onClick={handleAssignWorksheet}
                          >
                            Confirm
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </div>
        )}
      </Fragment>
      <ToastContainer />
    </AppLayout>
  )
}

export default QuestionPage
