import React from 'react'
import { Fragment, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Dialog, Transition } from '@headlessui/react'
import { 
  XMarkIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  EyeIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import Pagination from '@/components/dashbord/Pagination'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { manrope } from '@/utils/font'
import AppLayout from '../../../../layout/AppLayout'
import { USER, STUDENTS, SUBJECT } from '@/apollo/queries/dashboard'
import { useMutation, useQuery } from '@apollo/client'
import { ASSIGN_WORKSHEET } from '@/apollo/mutations/dashboard'
import { WORKSHEETS } from '@/apollo/queries/admin'
import SubscriptionCheck from '@/components/SubscriptionCheck'

interface AssessmentProps {
  _id: string
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface DifficultyIndicatorProps {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
}
type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD'

const Assessment: React.FC<AssessmentProps> = () => {
  const router = useRouter()
  const { id } = router.query
  const [check, setCheck] = useState<boolean>(true)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [checkStudent, setCheckStudent] = useState<boolean>(true)
  const [selectedStudent, setSelectedStudent] = useState<string[]>([])
  const [showClass, setShowClass] = useState(false)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('title')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const [assignWorksheet] = useMutation(ASSIGN_WORKSHEET)
  const { data } = useQuery(WORKSHEETS, {
    variables: {
      page,
      limit: 10,
      filter: '',
      topicId: '',
      levelId: '',
      subjectId: id,
    },
  })

  const {
    data: subjectData,
    loading,
    error,
  } = useQuery(SUBJECT, {
    variables: { subjectId: id },
  })

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
    data({
      variables: {
        page,
        limit: 10,
        filter: '',
        topicId: '',
        levelId: '',
        subjectId: id,
      },
    })
  }

  const schoolGrades = data?.worksheets.data || []

  const { data: userData } = useQuery(USER)
  const { data: studentsData } = useQuery(STUDENTS)
  const user = userData?.user || []
  const students = studentsData?.students?.data || []

  const [openSubtables, setOpenSubtables] = useState<Array<boolean>>(
    Array(students.length).fill(false),
  )

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables]
    newOpenSubtables[index] = !newOpenSubtables[index]
    setOpenSubtables(newOpenSubtables)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  function checkAll() {
    const allAssessmentIds = schoolGrades.flatMap((grade: any) =>
      grade.subject.flatMap((subject: any) =>
        subject.worksheet.flatMap((worksheet: any) =>
          worksheet.questions.map((question: any) => question._id),
        ),
      ),
    )
    setSelectedSubjects(allAssessmentIds)
    setCheck(false)
  }

  function uncheckAll() {
    selectedSubjects.length === 0
    setSelectedSubjects([])
    setCheck(true)
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

    if (type === 'subject') {
      if (isChecked) {
        setSelectedSubjects([...selectedSubjects, value])
      } else {
        setSelectedSubjects((prevData) => prevData.filter((id) => id !== value))
      }
    } else if (type === 'student') {
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
        <span className={`text-xs font-medium ${
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

  // Filter and sort assessments
  const filteredAssessments = schoolGrades
    .filter((assessment: any) => {
      const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDifficulty = difficultyFilter === 'all' || assessment.difficulty === difficultyFilter
      return matchesSearch && matchesDifficulty
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'difficulty':
          const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 }
          const aDifficulty = a.difficulty as keyof typeof difficultyOrder
          const bDifficulty = b.difficulty as keyof typeof difficultyOrder
          return difficultyOrder[aDifficulty] - difficultyOrder[bDifficulty]
        default:
          return 0
      }
    })

  const selectedCount = selectedSubjects.length
  const totalAssessments = filteredAssessments.length

  return (
    <SubscriptionCheck>
      <AppLayout>
        <div className={`${manrope.className} min-h-screen bg-gray-50`}>
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Link
                      href="/dashboard/assign"
                      className="flex items-center gap-2 text-teal-100 hover:text-white transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-sm font-medium">Back to Assignments</span>
                    </Link>
                  </div>
                  <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                    {subjectData?.subject?.name || 'Subject'} Assessments
                  </h1>
                  <p className="mt-2 text-teal-100">
                    Assign assessments to your students and track their progress
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-4 text-teal-100">
                    <div className="flex items-center gap-2">
                      <AcademicCapIcon className="h-5 w-5" />
                      <span className="text-sm">{totalAssessments} Assessments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="h-5 w-5" />
                      <span className="text-sm">{students.length} Students</span>
                    </div>
                  </div>
                  {selectedCount > 0 && (
                    <button
                      onClick={() => setShowClass(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Assign Selected ({selectedCount})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Filters and Controls */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Search and Filters */}
                <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search assessments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Difficulty Filter */}
                  <div className="flex items-center gap-2">
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                    >
                      <option value="title">Sort by Title</option>
                      <option value="difficulty">Sort by Difficulty</option>
                    </select>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded-lg p-2 transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-teal-100 text-teal-700' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded-lg p-2 transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-teal-100 text-teal-700' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              {totalAssessments > 0 && (
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCount === totalAssessments}
                        onChange={selectedCount === totalAssessments ? uncheckAll : checkAll}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">
                        {selectedCount === totalAssessments ? 'Deselect All' : 'Select All'} ({selectedCount}/{totalAssessments})
                      </span>
                    </label>
                  </div>
                  {selectedCount > 0 && (
                    <button
                      onClick={() => setShowClass(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Assign Selected ({selectedCount})
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Assessments Grid/List */}
            {filteredAssessments.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No assessments found</h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm || difficultyFilter !== 'all' 
                    ? 'Try adjusting your search or filters.' 
                    : 'No assessments available for this subject.'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAssessments.map((assessment: any) => (
                  <div key={assessment._id} className="group relative rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                          <Link href={`/dashboard/assign/assessment/questions/${assessment._id}`}>
                            {assessment.title}
                          </Link>
                        </h3>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          {isDifficultyLevel(assessment.difficulty) && (
                            <DifficultyIndicator difficulty={assessment.difficulty} />
                          )}
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>15 min</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <input
                          type="checkbox"
                          data-type="subject"
                          checked={selectedSubjects.includes(assessment._id)}
                          value={assessment._id}
                          onChange={checkBoxHandler}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/assign/assessment/questions/${assessment._id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                          Preview
                        </Link>
                      </div>
                      <button
                        onClick={() => setShowClass(true)}
                        className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
                      >
                        <PlayIcon className="h-4 w-4" />
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-white shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Select
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAssessments.map((assessment: any) => (
                      <tr key={assessment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <Link 
                              href={`/dashboard/assign/assessment/questions/${assessment._id}`}
                              className="text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors"
                            >
                              {assessment.title}
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isDifficultyLevel(assessment.difficulty) && (
                            <DifficultyIndicator difficulty={assessment.difficulty} />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>15 min</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            data-type="subject"
                            checked={selectedSubjects.includes(assessment._id)}
                            value={assessment._id}
                            onChange={checkBoxHandler}
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/dashboard/assign/assessment/questions/${assessment._id}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              <EyeIcon className="h-4 w-4" />
                              Preview
                            </Link>
                            <button
                              onClick={() => setShowClass(true)}
                              className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
                            >
                              <PlayIcon className="h-4 w-4" />
                              Assign
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {data?.worksheets?.totalPage > 1 && (
              <div className="mt-8">
                <Pagination
                  page={page}
                  count={data?.worksheets?.totalPage}
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
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                      <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            onClick={() => setShowClass(false)}
                          >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 sm:mx-0 sm:h-10 sm:w-10">
                            <AcademicCapIcon className="h-6 w-6 text-teal-600" aria-hidden="true" />
                          </div>
                          <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <Dialog.Title
                              as="h3"
                              className={`${manrope.className} text-lg font-semibold leading-6 text-gray-900`}
                            >
                              Assign Assessment{selectedCount > 1 ? 's' : ''}
                            </Dialog.Title>
                            <div className={`${manrope.className} mt-2`}>
                              <p className="text-sm text-gray-500">
                                Select students to assign {selectedCount > 0 ? `${selectedCount} assessment${selectedCount > 1 ? 's' : ''}` : 'this assessment'} to:
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 max-h-96 overflow-y-auto">
                          {Object.keys(groupedStudents).map((grade, index) => (
                            <div key={grade} className="mb-4 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between rounded-t-lg bg-gray-50 px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => toggleDropdown(index)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors"
                                  >
                                    {openSubtables[index] ? (
                                      <ChevronUpIcon className="h-4 w-4" />
                                    ) : (
                                      <ChevronDownIcon className="h-4 w-4" />
                                    )}
                                    {grade} ({groupedStudents[grade].length} student{groupedStudents[grade].length !== 1 ? 's' : ''})
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
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
                                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                  />
                                  <span className="text-sm text-gray-500">Select All</span>
                                </div>
                              </div>
                              
                              {openSubtables[index] && (
                                <div className="border-t border-gray-200">
                                  <div className="divide-y divide-gray-200">
                                    {groupedStudents[grade].map((student: any) => (
                                      <div key={student._id} className="flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                                            <span className="text-sm font-medium text-teal-700">
                                              {student.name.charAt(0).toUpperCase()}
                                            </span>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                            <p className="text-xs text-gray-500">Best Score: 85%</p>
                                          </div>
                                        </div>
                                        <input
                                          type="checkbox"
                                          data-type="student"
                                          checked={selectedStudent.includes(student._id)}
                                          value={student._id}
                                          onChange={checkBoxHandler}
                                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:ml-3 sm:w-auto"
                            onClick={handleAssignWorksheet}
                            disabled={selectedStudent.length === 0}
                          >
                            Assign to {selectedStudent.length} Student{selectedStudent.length !== 1 ? 's' : ''}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setShowClass(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          )}
          
          <ToastContainer />
        </div>
      </AppLayout>
    </SubscriptionCheck>
  )
}

export default Assessment
