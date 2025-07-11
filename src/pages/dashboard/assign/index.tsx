"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  AcademicCapIcon, 
  ClipboardDocumentListIcon, 
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  SparklesIcon,
  StarIcon,
  EyeIcon,
  PlayIcon
} from "@heroicons/react/24/outline"

import AppLayout from "../../../layout/AppLayout"
import { FETCH_LEARNING } from "@/apollo/queries/dashboard"
import SubscriptionCheck from '@/components/SubscriptionCheck'

interface Grade {
  _id: string
  stage: number
  year: string
  ages: string
  subjects: {
    _id: string
    name: string
    worksheet: number
    topics: number
  }[]
}

export default function Assign() {
  const [selectedCategory, setSelectedCategory] = useState<"worksheet" | "assessment">("worksheet")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "content">("name")
  const { data, refetch, loading } = useQuery(FETCH_LEARNING, {
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    if (data) {
      console.log(JSON.stringify(data, null, 2))
    }
  }, [data])

  const subjects: string[] = data?.fetchLearning[0]?.subjects.map((subjects: { name: string }) => subjects.name) || []

  // Calculate statistics
  const totalWorksheets = data?.fetchLearning?.reduce((total: number, grade: Grade) => 
    total + grade.subjects.reduce((subTotal: number, subject: any) => subTotal + subject.worksheet, 0), 0
  ) || 0

  const totalAssessments = data?.fetchLearning?.reduce((total: number, grade: Grade) => 
    total + grade.subjects.reduce((subTotal: number, subject: any) => subTotal + subject.topics, 0), 0
  ) || 0

  const totalSubjects = subjects.length
  const totalGrades = data?.fetchLearning?.length || 0

  // Filter and sort data
  const filteredData = data?.fetchLearning?.filter((grade: Grade) => {
    const matchesSearch = grade.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subjects.some(subject => subject.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesYear = selectedYear === "all" || grade.year === selectedYear
    return matchesSearch && matchesYear
  }).sort((a: Grade, b: Grade) => {
    if (sortBy === "name") {
      return a.year.localeCompare(b.year)
    } else {
      const aContent = a.subjects.reduce((sum, subject) => sum + (selectedCategory === "worksheet" ? subject.worksheet : subject.topics), 0)
      const bContent = b.subjects.reduce((sum, subject) => sum + (selectedCategory === "worksheet" ? subject.worksheet : subject.topics), 0)
      return bContent - aContent
    }
  }) || []

  if (!data) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#010B1ACC] dark:bg-[#00000099]">
        <div className="z-10 m-auto w-[500px] rounded-md bg-white p-6 py-12 dark:bg-gray-800 transition-colors duration-200">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                You have no subscription
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Subscribe to one of our plans</p>
              </div>
            </div>
          </div>
          <div className="mt-5 gap-x-3 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Link
              href={`/dashboard`}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600 transition-colors duration-200 sm:mt-0 sm:w-auto"
            >
              Go Back
            </Link>{' '}
            <Link
              href={`/dashboard/subscription`}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200 sm:mt-0 sm:w-auto"
            >
              View plans
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getSubjectColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600', 
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600'
    ]
    return colors[index % colors.length]
  }

  const getSubjectHoverColor = (index: number) => {
    const colors = [
      'hover:from-blue-600 hover:to-blue-700',
      'hover:from-green-600 hover:to-green-700',
      'hover:from-purple-600 hover:to-purple-700',
      'hover:from-pink-600 hover:to-pink-700',
      'hover:from-indigo-600 hover:to-indigo-700',
      'hover:from-yellow-600 hover:to-yellow-700'
    ]
    return colors[index % colors.length]
  }

  const getSubjectIcon = (subjectName: string) => {
    const icons = {
      'Mathematics': '🔢',
      'Science': '🔬',
      'English': '📚',
      'History': '📜',
      'Geography': '🌍',
      'Art': '🎨',
      'Music': '🎵',
      'Physical Education': '⚽',
      'Computer Science': '💻',
      'Literature': '📖'
    }
    return icons[subjectName as keyof typeof icons] || '📝'
  }

  return (
    <SubscriptionCheck>
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
          {/* Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative px-6 py-12 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-bold text-white mb-4"
                    >
                      Assignment Center
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl text-purple-100 mb-6"
                    >
                      Discover and assign engaging worksheets and assessments to your students
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap gap-3"
                    >
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <SparklesIcon className="h-5 w-5 text-white mr-2" />
                        <span className="text-white font-medium">{totalGrades} Grades</span>
                      </div>
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <BookOpenIcon className="h-5 w-5 text-white mr-2" />
                        <span className="text-white font-medium">{totalSubjects} Subjects</span>
                      </div>
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <DocumentTextIcon className="h-5 w-5 text-white mr-2" />
                        <span className="text-white font-medium">{totalWorksheets + totalAssessments} Resources</span>
                      </div>
                    </motion.div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 lg:mt-0 lg:ml-8"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center">
                          <PlusIcon className="h-5 w-5 mr-2" />
                          Create Custom Assignment
                        </button>
                        <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center">
                          <StarIcon className="h-5 w-5 mr-2" />
                          View Favorites
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <div className="px-6 py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                      <AcademicCapIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Grades</p>
                      <p className="text-3xl font-bold text-gray-900">{totalGrades}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                      <BookOpenIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                      <p className="text-3xl font-bold text-gray-900">{totalSubjects}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                      <DocumentTextIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Worksheets</p>
                      <p className="text-3xl font-bold text-gray-900">{totalWorksheets}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                      <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Assessments</p>
                      <p className="text-3xl font-bold text-gray-900">{totalAssessments}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Advanced Controls */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Content</h2>
                    <p className="text-gray-600">Filter and explore available assignments</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search grades or subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
                      />
                    </div>

                    {/* Year Filter */}
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Years</option>
                      {data?.fetchLearning?.map((grade: Grade) => (
                        <option key={grade._id} value={grade.year}>{grade.year}</option>
                      ))}
                    </select>

                    {/* Sort By */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "name" | "content")}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="content">Sort by Content</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          viewMode === "grid"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <ViewColumnsIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          viewMode === "list"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <ListBulletIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Toggle */}
                <div className="mt-6">
                  <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
                    <button
                      onClick={() => setSelectedCategory("worksheet")}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                        selectedCategory === "worksheet"
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Worksheets ({totalWorksheets})
                    </button>
                    <button
                      onClick={() => setSelectedCategory("assessment")}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                        selectedCategory === "assessment"
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                      Assessments ({totalAssessments})
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Grid/List */}
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-6 text-gray-600 text-lg">Loading assignment data...</p>
                  </div>
                ) : filteredData.length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredData.map((grade: Grade) => (
                        <motion.div
                          key={grade._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                          {/* Grade Header */}
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{grade.year}</h3>
                                <p className="text-sm text-gray-600">Age: {grade.ages}</p>
                              </div>
                              <div className="text-right">
                                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                  Stage {grade.stage}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Subjects */}
                          <div className="p-6 space-y-4">
                            {grade.subjects.map((subject, index) => (
                              <motion.div
                                key={subject._id}
                                whileHover={{ scale: 1.02 }}
                                className={`rounded-xl p-4 text-white transition-all duration-300 ${getSubjectColor(index)} ${getSubjectHoverColor(index)}`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center">
                                    <span className="text-2xl mr-3">{getSubjectIcon(subject.name)}</span>
                                    <h4 className="font-semibold text-lg">{subject.name}</h4>
                                  </div>
                                  <ArrowRightIcon className="h-5 w-5" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  {selectedCategory === "worksheet" && subject.worksheet > 0 ? (
                                    <Link 
                                      href={`/dashboard/assign/worksheet/${subject._id}`}
                                      className="block bg-white/20 rounded-lg p-3 text-center hover:bg-white/30 transition-colors group"
                                    >
                                      <DocumentTextIcon className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                      <p className="text-sm font-medium">{subject.worksheet}</p>
                                      <p className="text-xs opacity-90">Worksheets</p>
                                    </Link>
                                  ) : selectedCategory === "assessment" && subject.topics > 0 ? (
                                    <Link 
                                      href={`/dashboard/assign/assessment/${subject._id}`}
                                      className="block bg-white/20 rounded-lg p-3 text-center hover:bg-white/30 transition-colors group"
                                    >
                                      <ClipboardDocumentListIcon className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                      <p className="text-sm font-medium">{subject.topics}</p>
                                      <p className="text-xs opacity-90">Assessments</p>
                                    </Link>
                                  ) : (
                                    <div className="col-span-2 text-center py-4">
                                      <p className="text-sm opacity-90">No {selectedCategory} available</p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredData.map((grade: Grade) => (
                        <motion.div
                          key={grade._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{grade.year}</h3>
                                <p className="text-sm text-gray-600">Age: {grade.ages} • Stage {grade.stage}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {grade.subjects.map((subject, index) => (
                                <div key={subject._id} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                                  <div className="flex items-center mb-3">
                                    <span className="text-2xl mr-3">{getSubjectIcon(subject.name)}</span>
                                    <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                      {selectedCategory === "worksheet" ? `${subject.worksheet} Worksheets` : `${subject.topics} Assessments`}
                                    </div>
                                    <Link 
                                      href={selectedCategory === "worksheet" ? `/dashboard/assign/worksheet/${subject._id}` : `/dashboard/assign/assessment/${subject._id}`}
                                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                                    >
                                      <EyeIcon className="h-4 w-4 mr-1" />
                                      View
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-20">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
                    <button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedYear("all")
                      }}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </SubscriptionCheck>
  )
}

