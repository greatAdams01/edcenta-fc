import React, { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon, UserGroupIcon, ClockIcon, CheckCircleIcon, EyeIcon, PlayIcon, StarIcon } from '@heroicons/react/24/outline'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from 'framer-motion'
import { TOPICS, USER, STUDENTS, SUBJECT } from '@/apollo/queries/dashboard'
import AppLayout from '../../../../layout/AppLayout'
import { ASSIGN_WORKSHEET } from '@/apollo/mutations/dashboard'
import { useQuery, useMutation } from '@apollo/client'
import Pagination from '@/components/dashbord/Pagination'
import SubscriptionCheck from '@/components/SubscriptionCheck'

type WorksheetProps = {
  _id: string
}

const Worksheet: React.FC<WorksheetProps> = () => {
  const router = useRouter()
  const { id } = router.query
  const [selectedSubjects, setSelectedSubjects] = useState('')
  const [checkStudent, setCheckStudent] = useState<boolean>(true)
  const [selectedStudent, setSelectedStudent] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [showClass, setShowClass] = useState(false)
  const [worksheet, setWorksheet] = useState('private')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'PRIVATE' | 'NATIONAL' | 'ASSESSMENT'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data } = useQuery(TOPICS, {
    variables: {
      page,
      limit: 10,
      filter: '',
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
    // Refetch data with new page
    // Note: You might need to implement proper refetching here
    return {}
  }

  const [assignWorksheet] = useMutation(ASSIGN_WORKSHEET)

  const schoolGrades = data?.topics.data || []
  const { data: userData } = useQuery(USER)
  const { data: studentsData } = useQuery(STUDENTS)
  const user = userData?.user || []
  const students = studentsData?.students.data || []

  const [openSubtables, setOpenSubtables] = useState<boolean[]>(
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

  function checkAllStudent() {
    const selectAllStudent = students.flatMap((student: any) => student._id)
    setSelectedStudent(selectAllStudent)
    setCheckStudent(false)
    console.log(selectedStudent)
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

  // Filter topics based on search and type
  const filteredTopics = schoolGrades.filter((topic: any) => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || topic.type === filterType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PRIVATE':
        return 'bg-blue-100 text-blue-800'
      case 'NATIONAL':
        return 'bg-green-100 text-green-800'
      case 'ASSESSMENT':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PRIVATE':
        return '📝'
      case 'NATIONAL':
        return '📚'
      case 'ASSESSMENT':
        return '📊'
      default:
        return '📄'
    }
  }

  return (
    <SubscriptionCheck>
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="px-6 py-8 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center mb-4"
                    >
                      <Link
                        href="/dashboard/assign"
                        className="mr-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5 text-white" />
                      </Link>
                      <h1 className="text-3xl font-bold text-white">
                        {subjectData?.subject?.name || 'Subject'} - Worksheets
                      </h1>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-purple-100 text-lg"
                    >
                      Browse and assign worksheets to your students
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 lg:mt-0"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{filteredTopics.length}</div>
                          <div className="text-sm text-purple-100">Available</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{students.length}</div>
                          <div className="text-sm text-purple-100">Students</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-6 py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Worksheet Library</h2>
                    <p className="text-gray-600">Filter and search through available worksheets</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search worksheets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
                      />
                    </div>

                    {/* Type Filter */}
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as 'all' | 'PRIVATE' | 'NATIONAL' | 'ASSESSMENT')}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="PRIVATE">Private</option>
                      <option value="NATIONAL">National Curriculum</option>
                      <option value="ASSESSMENT">Assessment</option>
                    </select>
                  </div>
                </div>

                {/* Type Toggle */}
                <div className="mt-6">
                  <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
                    <button
                      onClick={() => setFilterType('PRIVATE')}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                        filterType === 'PRIVATE'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      📝 Private
                    </button>
                    <button
                      onClick={() => setFilterType('NATIONAL')}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                        filterType === 'NATIONAL'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      📚 National Curriculum
                    </button>
                    <button
                      onClick={() => setFilterType('ASSESSMENT')}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                        filterType === 'ASSESSMENT'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      📊 Assessment
                    </button>
                  </div>
                </div>
              </div>

              {/* Worksheets Grid */}
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-6 text-gray-600 text-lg">Loading worksheets...</p>
                  </div>
                ) : filteredTopics.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTopics.map((topic: any) => (
                      <motion.div
                        key={topic._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-2">{topic.name}</h3>
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(topic.type)}`}>
                                <span className="mr-2">{getTypeIcon(topic.type)}</span>
                                {topic.type}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Created</span>
                              <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Link
                                href={`/dashboard/assign/worksheet/topic/${topic._id}`}
                                className="flex-1 bg-purple-100 text-purple-700 hover:bg-purple-200 text-center py-2 px-4 rounded-lg font-medium transition-colors"
                              >
                                <EyeIcon className="h-4 w-4 inline mr-2" />
                                Preview
                              </Link>
                              <button
                                onClick={() => {
                                  setSelectedSubjects(topic._id)
                                  setShowClass(true)
                                }}
                                className="flex-1 bg-purple-600 text-white hover:bg-purple-700 py-2 px-4 rounded-lg font-medium transition-colors"
                              >
                                <PlusIcon className="h-4 w-4 inline mr-2" />
                                Assign
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No worksheets found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setFilterType('all')
                      }}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredTopics.length > 0 && (
                <div className="mt-8">
                  <Pagination
                    page={page}
                    count={10} // You'll need to get this from your API
                    handlePageChange={handlePageChange}
                  />
                </div>
              )}
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
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
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
                    <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                      <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                        <button
                          type="button"
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                          onClick={() => setShowClass(false)}
                        >
                          <span className="sr-only">Close</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                          <UserGroupIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                          <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                            Assign Worksheet to Students
                          </Dialog.Title>
                          
                          <div className="mt-4 space-y-6">
                            {/* Student Selection */}
                            <div>
                              <h4 className="text-lg font-medium text-gray-900 mb-4">Select Students</h4>
                              <div className="flex gap-4 mb-4">
                                <button
                                  type="button"
                                  onClick={checkAllStudent}
                                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                  Select All
                                </button>
                                <button
                                  type="button"
                                  onClick={uncheckAllStudent}
                                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  Unselect All
                                </button>
                              </div>
                              
                              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-xl">
                                {Object.entries(groupedStudents).map(([grade, gradeStudents]: [string, any]) => (
                                  <div key={grade} className="border-b border-gray-200 last:border-b-0">
                                    <div className="bg-gray-50 px-4 py-3">
                                      <h5 className="font-medium text-gray-900">{grade} - {gradeStudents.length} students</h5>
                                    </div>
                                    <div className="p-4 space-y-2">
                                      {gradeStudents.map((student: any, index: number) => (
                                        <label key={student._id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                                          <input
                                            type="checkbox"
                                            value={student._id}
                                            data-type="student"
                                            checked={selectedStudent.includes(student._id)}
                                            onChange={checkBoxHandler}
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                          />
                                          <span className="text-sm text-gray-900">{student.name}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowClass(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAssignWorksheet}
                          disabled={selectedStudent.length === 0}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Assign to {selectedStudent.length} Student{selectedStudent.length !== 1 ? 's' : ''}
                        </button>
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

export default Worksheet
