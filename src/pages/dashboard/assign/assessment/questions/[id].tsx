import React, { useState, useEffect, Fragment } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { 
  XMarkIcon, 
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  PlayIcon,
  EyeIcon,
  BookOpenIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

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
import { IWorksheet2 } from '../../../../../../types'
import SubscriptionCheck from '@/components/SubscriptionCheck'

interface DifficultyIndicatorProps {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
}
type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD'

const QuestionPage = () => {
  const router = useRouter()
  const path = useRouter()
  const { id } = router.query
  const [selectedSubjects, setSelectedSubjects] = useState(id)
  const [checkStudent, setCheckStudent] = useState<boolean>(true)
  const [selectedStudent, setSelectedStudent] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [showClass, setShowClass] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'questions'>('overview')
  const [worksheet, setWorksheet] = useState<IWorksheet2>({
    title: '',
    body: [],
    difficulty: '',
    vidLink: ""
  })

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
    onCompleted: (data) => {
      console.log('Data:', worksheetData)
      setWorksheet(data.worksheet)
    },
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

  const students = studentsData?.students?.data || []
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
      toast.success('Assessment Assigned successfully')
      setShowClass(false)
    } catch (error) {
      toast.error('Error assigning assessment ' + error)
      console.log(error)
    }
    console.log(selectedStudent, selectedSubjects)
  }

  const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
    difficulty,
  }) => {
    const boxCount =
      {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3,
      }[difficulty as 'EASY' | 'MEDIUM' | 'HARD'] || 0

    const difficultyColors = {
      EASY: 'bg-green-500',
      MEDIUM: 'bg-yellow-500',
      HARD: 'bg-red-500',
    }

    const difficultyLabels = {
      EASY: 'Easy',
      MEDIUM: 'Medium',
      HARD: 'Hard',
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={`m-0.5 h-2 w-2 rounded-full ${index < boxCount ? difficultyColors[difficulty] : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <span className={`text-sm font-medium ${
          difficulty === 'EASY' ? 'text-green-600' :
          difficulty === 'MEDIUM' ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {difficultyLabels[difficulty]}
        </span>
      </div>
    )
  }

  function isDifficultyLevel(
    difficulty: string,
  ): difficulty is DifficultyLevel {
    return ['EASY', 'MEDIUM', 'HARD'].includes(difficulty)
  }

  const difficulty: string = worksheet.difficulty

  return (
    <AppLayout>
        <SubscriptionCheck>
        <div className={`${manrope.className} min-h-screen bg-gray-50`}>
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => path.back()}
                      className={`${manrope.className} flex items-center gap-2 text-blue-100 hover:text-white transition-colors`}
                    >
                      <IoIosArrowBack className="h-5 w-5" />
                      <span className="text-sm font-medium">Back to Assessments</span>
                    </button>
                  </div>
                  <h1 className={`${manrope.className} mt-4 text-3xl font-bold text-white sm:text-4xl`}>
                    {worksheet.title || 'Assessment Preview'}
                  </h1>
                  <p className={`${manrope.className} mt-2 text-blue-100`}>
                    Review assessment content and questions before assigning to students
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-4 text-blue-100">
                    <div className="flex items-center gap-2">
                      <QuestionMarkCircleIcon className="h-5 w-5" />
                      <span className={`${manrope.className} text-sm`}>{questions.length} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5" />
                      <span className={`${manrope.className} text-sm`}>~{Math.ceil(questions.length * 2)} min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowClass(true)}
                    className={`${manrope.className} inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-gray-50 transition-colors`}
                  >
                    <PlayIcon className="h-4 w-4" />
                    Assign Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Quick Stats */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className={`${manrope.className} text-sm font-medium text-gray-500`}>Total Questions</p>
                    <p className={`${manrope.className} text-2xl font-bold text-gray-900`}>{questions.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2">
                    <ChartBarIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className={`${manrope.className} text-sm font-medium text-gray-500`}>Difficulty</p>
                    <div className="flex items-center gap-2">
                      {isDifficultyLevel(difficulty) && (
                        <DifficultyIndicator difficulty={difficulty} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <UserGroupIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className={`${manrope.className} text-sm font-medium text-gray-500`}>Available Students</p>
                    <p className={`${manrope.className} text-2xl font-bold text-gray-900`}>{students.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`${manrope.className} whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpenIcon className="h-4 w-4" />
                      Overview
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('questions')}
                    className={`${manrope.className} whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                      activeTab === 'questions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <QuestionMarkCircleIcon className="h-4 w-4" />
                      Questions ({questions.length})
                    </div>
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' ? (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className={`${manrope.className} text-xl font-semibold text-gray-900 mb-4`}>Assessment Content</h2>
                  {worksheet.body && worksheet.body.length > 0 ? (
                    <div className="space-y-6">
                      {worksheet.body.map((item, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <div
                            className={`${manrope.className} prose prose-sm max-w-none text-gray-700`}
                            dangerouslySetInnerHTML={{ __html: item.text }}
                          />
                          {item.img && (
                            <div className="mt-4 flex justify-center">
                              <img
                                src={item.img}
                                alt="Assessment content"
                                className="max-h-96 w-auto rounded-lg shadow-sm"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className={`${manrope.className} mt-4 text-lg font-medium text-gray-900`}>No content available</h3>
                      <p className={`${manrope.className} mt-2 text-gray-500`}>This assessment doesn&apos;t have any content sections.</p>
                    </div>
                  )}
                </div>

                {worksheet.vidLink && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className={`${manrope.className} text-lg font-semibold text-gray-900 mb-4`}>Video Content</h3>
                    <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <PlayIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className={`${manrope.className} mt-2 text-sm text-gray-500`}>Video content available</p>
                        <a
                          href={worksheet.vidLink as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${manrope.className} mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors`}
                        >
                          <PlayIcon className="h-4 w-4" />
                          Watch Video
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg bg-white shadow-sm">
                {questions.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {questions.map((question: any, index: number) => (
                      <div key={question._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className={`${manrope.className} flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700`}>
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`${manrope.className} text-lg font-medium text-gray-900 mb-2`}>
                              {question.title}
                            </h3>
                            {question.explanation && (
                              <div className="mt-3 rounded-lg bg-gray-50 p-4">
                                <h4 className={`${manrope.className} text-sm font-medium text-gray-700 mb-2`}>Explanation</h4>
                                <p className={`${manrope.className} text-sm text-gray-600`}>{question.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className={`${manrope.className} mt-4 text-lg font-medium text-gray-900`}>No questions available</h3>
                    <p className={`${manrope.className} mt-2 text-gray-500`}>This assessment doesn&apos;t have any questions yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {data?.questions?.totalPage > 1 && (
              <div className="mt-8">
                <Pagination
                  page={page}
                  count={data?.questions?.totalPage}
                  handlePageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          {/* Assignment Modal */}
          {showClass && (
            <Transition.Root show={showClass} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-50"
                onClose={setShowClass}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                      <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                        {/* Modal Header */}
                        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 sm:px-8">
                          <div className="absolute right-4 top-4">
                            <button
                              type="button"
                              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                              onClick={() => setShowClass(false)}
                            >
                              <span className="sr-only">Close</span>
                              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                              <AcademicCapIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <div className="flex-1">
                              <Dialog.Title
                                as="h3"
                                className={`${manrope.className} text-xl font-bold text-white`}
                              >
                                Assign Assessment
                              </Dialog.Title>
                              <p className={`${manrope.className} mt-1 text-blue-100`}>
                                &ldquo;{worksheet.title}&rdquo;
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Modal Content */}
                        <div className="px-6 py-6 sm:px-8">
                          {/* Assessment Summary */}
                          <div className="mb-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 p-4 border border-blue-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <QuestionMarkCircleIcon className="h-5 w-5 text-blue-600" />
                                  <span className={`${manrope.className} text-sm font-medium text-gray-700`}>{questions.length} Questions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="h-5 w-5 text-blue-600" />
                                  <span className={`${manrope.className} text-sm font-medium text-gray-700`}>~{Math.ceil(questions.length * 2)} min</span>
                                </div>
                                {isDifficultyLevel(difficulty) && (
                                  <div className="flex items-center gap-2">
                                    <ChartBarIcon className="h-5 w-5 text-blue-600" />
                                    <DifficultyIndicator difficulty={difficulty} />
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className={`${manrope.className} text-sm text-gray-500`}>Selected Students</p>
                                <p className={`${manrope.className} text-lg font-bold text-blue-600`}>{selectedStudent.length}</p>
                              </div>
                            </div>
                          </div>

                          {/* Student Selection */}
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {Object.keys(groupedStudents).map((grade, index) => (
                              <div key={grade} className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                {/* Grade Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <button
                                      onClick={() => toggleDropdown(index)}
                                      className={`${manrope.className} flex items-center gap-3 text-left hover:text-blue-600 transition-colors group`}
                                    >
                                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                        {openSubtables[index] ? (
                                          <ChevronUpIcon className="h-4 w-4 text-blue-600" />
                                        ) : (
                                          <ChevronDownIcon className="h-4 w-4 text-blue-600" />
                                        )}
                                      </div>
                                      <div>
                                        <h4 className={`${manrope.className} font-semibold text-gray-900`}>{grade}</h4>
                                        <p className={`${manrope.className} text-sm text-gray-500`}>
                                          {groupedStudents[grade].length} student{groupedStudents[grade].length !== 1 ? 's' : ''}
                                        </p>
                                      </div>
                                    </button>
                                    
                                    <div className="flex items-center gap-3">
                                      <div className="text-right">
                                        <p className={`${manrope.className} text-xs text-gray-500`}>Selected</p>
                                        <p className={`${manrope.className} text-sm font-medium text-blue-600`}>
                                          {groupedStudents[grade].filter((student: any) => 
                                            selectedStudent.includes(student._id)
                                          ).length}/{groupedStudents[grade].length}
                                        </p>
                                      </div>
                                      <label className={`${manrope.className} flex items-center gap-2 cursor-pointer`}>
                                        <input
                                          type="checkbox"
                                          checked={groupedStudents[grade].every((student: any) => 
                                            selectedStudent.includes(student._id)
                                          )}
                                          onChange={() => {
                                            const allSelected = groupedStudents[grade].every((student: any) => 
                                              selectedStudent.includes(student._id)
                                            )
                                            if (allSelected) {
                                              const newSelected = selectedStudent.filter(id => 
                                                !groupedStudents[grade].some((student: any) => student._id === id)
                                              )
                                              setSelectedStudent(newSelected)
                                            } else {
                                              const gradeStudentIds = groupedStudents[grade].map((student: any) => student._id)
                                              const newSelected = [...new Set([...selectedStudent, ...gradeStudentIds])]
                                              setSelectedStudent(newSelected)
                                            }
                                          }}
                                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                                        />
                                        <span className={`${manrope.className} text-sm font-medium text-gray-700`}>
                                          {groupedStudents[grade].every((student: any) => 
                                            selectedStudent.includes(student._id)
                                          ) ? 'Deselect All' : 'Select All'}
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* Students List */}
                                {openSubtables[index] && (
                                  <div className="bg-white p-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {groupedStudents[grade].map((student: any) => (
                                        <label
                                          key={student._id}
                                          className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                            selectedStudent.includes(student._id)
                                              ? 'bg-blue-50 border border-blue-200'
                                              : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                          }`}
                                        >
                                          <div className="relative">
                                            <input
                                              type="checkbox"
                                              value={student._id}
                                              data-type="student"
                                              checked={selectedStudent.includes(student._id)}
                                              onChange={checkBoxHandler}
                                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                            />
                                            {selectedStudent.includes(student._id) && (
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                                                {student.name.charAt(0).toUpperCase()}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className={`${manrope.className} text-sm font-medium text-gray-900 truncate`}>{student.name}</p>
                                                <p className={`${manrope.className} text-xs text-gray-500`}>{student.email}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-6 sm:px-8 border-t border-gray-200">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className={`${manrope.className} text-sm text-gray-600`}>
                              {selectedStudent.length > 0 ? (
                                <span>
                                  Ready to assign assessment to <span className={`${manrope.className} font-semibold text-gray-900`}>{selectedStudent.length} student{selectedStudent.length !== 1 ? 's' : ''}</span>
                                </span>
                              ) : (
                                <span>Please select at least one student to continue</span>
                              )}
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                className={`${manrope.className} px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium`}
                                onClick={() => setShowClass(false)}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleAssignWorksheet}
                                disabled={selectedStudent.length === 0}
                                className={`${manrope.className} px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none`}
                              >
                                {loading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Assigning...
                                  </>
                                ) : (
                                  <>
                                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                                    Assign Assessment
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          )}
        </div>
      </SubscriptionCheck>
    </AppLayout>
  );
}

export default QuestionPage;