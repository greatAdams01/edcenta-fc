import React, { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  XMarkIcon, 
  PlusIcon, 
  ArrowLeftIcon,
  UserGroupIcon,
  ClockIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  StarIcon,
  EyeIcon,
  PlayIcon,
  BookOpenIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { TOPIC_QUERY, STUDENTS, QUESTIONS } from '@/apollo/queries/dashboard'
import { ASSIGN_WORKSHEET } from '@/apollo/mutations/dashboard'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AppLayout from '@/layout/AppLayout'
import SubscriptionCheck from '@/components/SubscriptionCheck'
import { manrope } from '@/utils/font'

const TopicPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [selectedSubjects, setSelectedSubjects] = useState(id)
  const [checkStudent, setCheckStudent] = useState<boolean>(true)
  const [selectedStudent, setSelectedStudent] = useState<string[]>([])
  const [showClass, setShowClass] = useState(false)
  const [previewMode, setPreviewMode] = useState<'overview' | 'questions'>('overview')
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const { data: studentsData } = useQuery(STUDENTS)
  const { data: topicData, loading: topicLoading } = useQuery(TOPIC_QUERY, {
    variables: { topicId: id },
  })
  
  const { data: questionsData, loading: questionsLoading } = useQuery(QUESTIONS, {
    variables: { 
      worksheetId: id,
      page: 1,
      limit: 50
    },
    skip: !id
  })

  useEffect(() => {
    setSelectedSubjects(id)
  }, [id])

  const topic = topicData?.topic || {}
  const questions = questionsData?.questions?.data || []
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

  const [assignWorksheet] = useMutation(ASSIGN_WORKSHEET)
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
  }

  const getQuestionTypeIcon = (isObjective: boolean) => {
    return isObjective ? '📝' : '✍️'
  }

  const getQuestionTypeLabel = (isObjective: boolean) => {
    return isObjective ? 'Multiple Choice' : 'Essay'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (topicLoading) {
    return (
      <SubscriptionCheck>
        <AppLayout>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading worksheet...</p>
            </div>
          </div>
        </AppLayout>
      </SubscriptionCheck>
    )
  }

  return (
    <SubscriptionCheck>
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="px-6 py-8 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center mb-6"
                >
                  <Link
                    href="/dashboard/assign"
                    className="mr-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5 text-white" />
                  </Link>
                  <div className="flex-1">
                    <h1 className={`${manrope.className} text-3xl font-bold text-white mb-2`}>
                      {topic.name || 'Worksheet Preview'}
                    </h1>
                    <p className={`${manrope.className} text-purple-100`}>
                      {topic.description || 'Preview and assign this worksheet to your students'}
                    </p>
                  </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-center">
                      <div className={`${manrope.className} text-2xl font-bold text-white`}>{questions.length}</div>
                      <div className={`${manrope.className} text-sm text-purple-100`}>Questions</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-center">
                      <div className={`${manrope.className} text-2xl font-bold text-white`}>{students.length}</div>
                      <div className={`${manrope.className} text-sm text-purple-100`}>Students</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-center">
                      <div className={`${manrope.className} text-2xl font-bold text-white`}>
                        {questions.filter((q: any) => q.isObjective).length}
                      </div>
                      <div className={`${manrope.className} text-sm text-purple-100`}>Multiple Choice</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-center">
                      <div className={`${manrope.className} text-2xl font-bold text-white`}>
                        {questions.filter((q: any) => !q.isObjective).length}
                      </div>
                      <div className={`${manrope.className} text-sm text-purple-100`}>Essay</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
              {/* Preview Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <h2 className={`${manrope.className} text-2xl font-bold text-gray-900 mb-2`}>Worksheet Preview</h2>
                    <p className={`${manrope.className} text-gray-600`}>Review the worksheet content before assigning</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setPreviewMode('overview')}
                      className={`${manrope.className} px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        previewMode === 'overview'
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <BookOpenIcon className="h-4 w-4 inline mr-2" />
                      Overview
                    </button>
                    <button
                      onClick={() => setPreviewMode('questions')}
                      className={`${manrope.className} px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        previewMode === 'questions'
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <DocumentTextIcon className="h-4 w-4 inline mr-2" />
                      Questions ({questions.length})
                    </button>
                    <button
                      onClick={() => setShowClass(true)}
                      className={`${manrope.className} px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center`}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Assign Worksheet
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Preview Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {previewMode === 'overview' ? (
                  <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                      <div className="text-center mb-8">
                        <h3 className={`${manrope.className} text-3xl font-bold text-gray-900 mb-4`}>{topic.name}</h3>
                        <p className={`${manrope.className} text-lg text-gray-600 mb-6`}>{topic.description}</p>
                        <div className="flex flex-wrap justify-center gap-4">
                          <div className={`${manrope.className} bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium`}>
                            📝 {questions.length} Questions
                          </div>
                          <div className={`${manrope.className} bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium`}>
                            ⏱️ Estimated Time: {Math.ceil(questions.length * 2)} min
                          </div>
                          <div className={`${manrope.className} bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium`}>
                            🎯 {questions.filter((q: any) => q.isObjective).length} Multiple Choice
                          </div>
                          <div className={`${manrope.className} bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium`}>
                            ✍️ {questions.filter((q: any) => !q.isObjective).length} Essay
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className={`${manrope.className} text-lg font-semibold text-gray-900 mb-4 flex items-center`}>
                            <AcademicCapIcon className="h-5 w-5 mr-2 text-purple-600" />
                            Worksheet Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className={`${manrope.className} text-gray-600`}>Topic ID:</span>
                              <span className={`${manrope.className} font-medium`}>{topic._id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${manrope.className} text-gray-600`}>Level ID:</span>
                              <span className={`${manrope.className} font-medium`}>{topic.levelId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${manrope.className} text-gray-600`}>Slug:</span>
                              <span className={`${manrope.className} font-medium`}>{topic.slug}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className={`${manrope.className} text-lg font-semibold text-gray-900 mb-4 flex items-center`}>
                            <ChartBarIcon className="h-5 w-5 mr-2 text-purple-600" />
                            Question Breakdown
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className={`${manrope.className} text-gray-600`}>Multiple Choice:</span>
                              <span className={`${manrope.className} bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium`}>
                                {questions.filter((q: any) => q.isObjective).length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`${manrope.className} text-gray-600`}>Essay Questions:</span>
                              <span className={`${manrope.className} bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium`}>
                                {questions.filter((q: any) => !q.isObjective).length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`${manrope.className} text-gray-600`}>Total Questions:</span>
                              <span className={`${manrope.className} bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium`}>
                                {questions.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`${manrope.className} text-2xl font-bold text-gray-900`}>Questions Preview</h3>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            disabled={currentQuestion === 0}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ArrowLeftIcon className="h-4 w-4" />
                          </button>
                          <span className={`${manrope.className} text-sm font-medium text-gray-600`}>
                            {currentQuestion + 1} of {questions.length}
                          </span>
                          <button
                            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                            disabled={currentQuestion === questions.length - 1}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ArrowLeftIcon className="h-4 w-4 rotate-180" />
                          </button>
                        </div>
                      </div>

                      {questions.length > 0 ? (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getQuestionTypeIcon(questions[currentQuestion]?.isObjective)}</span>
                              <span className={`${manrope.className} text-sm font-medium text-gray-600`}>
                                {getQuestionTypeLabel(questions[currentQuestion]?.isObjective)}
                              </span>
                            </div>
                            <span className={`${manrope.className} text-sm text-gray-500`}>Question {currentQuestion + 1}</span>
                          </div>
                          
                          <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h4 className={`${manrope.className} text-lg font-semibold text-gray-900 mb-4`}>
                              {questions[currentQuestion]?.title || 'Question Title'}
                            </h4>
                            
                            {questions[currentQuestion]?.body?.text && (
                              <p className={`${manrope.className} text-gray-700 mb-4`}>
                                {questions[currentQuestion].body.text}
                              </p>
                            )}

                            {questions[currentQuestion]?.isObjective && questions[currentQuestion]?.options && (
                              <div className="space-y-3">
                                <p className={`${manrope.className} text-sm font-medium text-gray-600`}>Options:</p>
                                {questions[currentQuestion].options.map((option: any, index: number) => (
                                  <div
                                    key={option._id}
                                    className={`p-3 rounded-lg border ${
                                      option.isCorrect 
                                        ? 'bg-green-50 border-green-200' 
                                        : 'bg-gray-50 border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                        {String.fromCharCode(65 + index)}
                                      </span>
                                      <span className={`${manrope.className} text-gray-700`}>{option.option}</span>
                                      {option.isCorrect && (
                                        <CheckCircleIcon className="h-5 w-5 text-green-600 ml-auto" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {questions[currentQuestion]?.explanation && (
                              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <p className={`${manrope.className} text-sm font-medium text-blue-800 mb-2`}>Explanation:</p>
                                <p className={`${manrope.className} text-blue-700`}>{questions[currentQuestion].explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className={`${manrope.className} text-lg font-medium text-gray-900 mb-2`}>No questions available</h3>
                          <p className={`${manrope.className} text-gray-600`}>This worksheet doesn't have any questions yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Assignment Modal */}
          <Transition.Root show={showClass} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setShowClass}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="relative w-full max-w-5xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                      {/* Modal Header */}
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                              <UserGroupIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <Dialog.Title as="h3" className={`${manrope.className} text-2xl font-bold text-white`}>
                                Assign Worksheet
                              </Dialog.Title>
                              <p className={`${manrope.className} text-purple-100 mt-1`}>
                                Select students to assign "{topic.name}"
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="rounded-full p-2 bg-white/20 text-white hover:bg-white/30 transition-colors"
                            onClick={() => setShowClass(false)}
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      {/* Modal Content */}
                      <div className="p-8">
                        {/* Worksheet Summary */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <h4 className={`${manrope.className} text-lg font-semibold text-gray-900`}>{topic.name}</h4>
                                <p className={`${manrope.className} text-gray-600 text-sm`}>{topic.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`${manrope.className} text-2xl font-bold text-purple-600`}>{questions.length}</div>
                              <div className={`${manrope.className} text-sm text-gray-600`}>Questions</div>
                            </div>
                          </div>
                        </div>

                        {/* Student Selection Section */}
                        <div className="space-y-6">
                          {/* Selection Controls */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <h4 className={`${manrope.className} text-xl font-semibold text-gray-900 mb-2`}>Select Students</h4>
                              <p className={`${manrope.className} text-gray-600`}>Choose which students to assign this worksheet to</p>
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={checkAllStudent}
                                className={`${manrope.className} inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium`}
                              >
                                <CheckCircleIcon className="h-4 w-4 mr-2" />
                                Select All ({students.length})
                              </button>
                              <button
                                type="button"
                                onClick={uncheckAllStudent}
                                className={`${manrope.className} inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium`}
                              >
                                <XMarkIcon className="h-4 w-4 mr-2" />
                                Clear All
                              </button>
                            </div>
                          </div>

                          {/* Selection Summary */}
                          {selectedStudent.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                                  <span className={`${manrope.className} text-blue-800 font-medium`}>
                                    {selectedStudent.length} student{selectedStudent.length !== 1 ? 's' : ''} selected
                                  </span>
                                </div>
                                <div className={`${manrope.className} text-sm text-blue-600`}>
                                  {Math.round((selectedStudent.length / students.length) * 100)}% of total students
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Student Groups */}
                          <div className="bg-gray-50 rounded-2xl overflow-hidden">
                            <div className="max-h-96 overflow-y-auto">
                              {Object.entries(groupedStudents).map(([grade, gradeStudents]: [string, any]) => (
                                <div key={grade} className="border-b border-gray-200 last:border-b-0">
                                  {/* Grade Header */}
                                  <div className="bg-white px-6 py-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                          <AcademicCapIcon className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                          <h5 className={`${manrope.className} font-semibold text-gray-900`}>{grade}</h5>
                                          <p className={`${manrope.className} text-sm text-gray-600`}>{gradeStudents.length} student{gradeStudents.length !== 1 ? 's' : ''}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <span className={`${manrope.className} text-sm text-gray-500`}>
                                          {gradeStudents.filter((s: any) => selectedStudent.includes(s._id)).length} selected
                                        </span>
                                        <button
                                          onClick={() => {
                                            const gradeStudentIds = gradeStudents.map((s: any) => s._id)
                                            const allSelected = gradeStudentIds.every((id: string) => selectedStudent.includes(id))
                                            if (allSelected) {
                                              setSelectedStudent(selectedStudent.filter(id => !gradeStudentIds.includes(id)))
                                            } else {
                                              const newSelected = [...selectedStudent]
                                              gradeStudentIds.forEach((id: string) => {
                                                if (!newSelected.includes(id)) {
                                                  newSelected.push(id)
                                                }
                                              })
                                              setSelectedStudent(newSelected)
                                            }
                                          }}
                                          className={`${manrope.className} text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors`}
                                        >
                                          {gradeStudents.every((s: any) => selectedStudent.includes(s._id)) ? 'Deselect All' : 'Select All'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Students List */}
                                  <div className="bg-white">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 p-4">
                                      {gradeStudents.map((student: any) => (
                                        <label
                                          key={student._id}
                                          className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                            selectedStudent.includes(student._id)
                                              ? 'bg-purple-50 border border-purple-200'
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
                                              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-colors"
                                            />
                                            {selectedStudent.includes(student._id) && (
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <CheckCircleIcon className="h-4 w-4 text-purple-600" />
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600">
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
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className={`${manrope.className} text-sm text-gray-600`}>
                            {selectedStudent.length > 0 ? (
                              <span>
                                Ready to assign worksheet to <span className={`${manrope.className} font-semibold text-gray-900`}>{selectedStudent.length} student{selectedStudent.length !== 1 ? 's' : ''}</span>
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
                              className={`${manrope.className} px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none`}
                            >
                              <PlusIcon className="h-4 w-4 inline mr-2" />
                              Assign to {selectedStudent.length} Student{selectedStudent.length !== 1 ? 's' : ''}
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

          <ToastContainer />
        </div>
      </AppLayout>
    </SubscriptionCheck>
  )
}

export default TopicPage
