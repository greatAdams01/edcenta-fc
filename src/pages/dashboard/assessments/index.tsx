import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  ClockIcon, 
  AcademicCapIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  PlayIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

import AppLayout from '../../../layout/AppLayout'
import SubscriptionCheck from '../../../components/SubscriptionCheck'
import { ASSESSMENTS, ASSESSMENT_ATTEMPTS, STUDENT_PROGRESS } from '../../../apollo/queries/dashboard'
import { manrope } from '../../../utils/font'

interface Assessment {
  _id: string
  title: string
  description: string
  subjectId: {
    _id: string
    name: string
  }
  topicId: {
    _id: string
    name: string
  }
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  timeLimit: number
  totalQuestions: number
  passingScore: number
  status: string
  isActive: boolean
  createdAt: string
}

interface AssessmentAttempt {
  _id: string
  assessmentId: {
    _id: string
    title: string
    subjectId: {
      name: string
    }
    topicId: {
      name: string
    }
  }
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'
  score: number
  totalScore: number
  percentage: number
  timeSpent: number
  startedAt: string
  completedAt: string
}

const AssessmentsDashboard: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'available' | 'in-progress' | 'completed'>('available')
  const [filter, setFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')

  // Fetch available assessments
  const { data: assessmentsData, loading: assessmentsLoading } = useQuery(ASSESSMENTS, {
    variables: {
      page: 1,
      limit: 50,
      filter,
      subjectId: subjectFilter || undefined,
      difficulty: difficultyFilter || undefined,
      status: 'ACTIVE'
    }
  })

  // Fetch assessment attempts
  const { data: attemptsData, loading: attemptsLoading } = useQuery(ASSESSMENT_ATTEMPTS, {
    variables: {
      page: 1,
      limit: 50,
      filter: '',
      status: ''
    }
  })

  // Fetch student progress
  const { data: progressData, loading: progressLoading } = useQuery(STUDENT_PROGRESS, {
    variables: {
      studentId: 'current' // This should be the current student's ID
    }
  })

  const assessments = assessmentsData?.assessments?.data || []
  const attempts = attemptsData?.assessmentAttempts?.data || []
  const progress = progressData?.studentProgress

  const inProgressAttempts = attempts.filter((attempt: AssessmentAttempt) => 
    attempt.status === 'IN_PROGRESS'
  )

  const completedAttempts = attempts.filter((attempt: AssessmentAttempt) => 
    attempt.status === 'COMPLETED'
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HARD':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'IN_PROGRESS':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'ABANDONED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleStartAssessment = (assessmentId: string) => {
    router.push(`/dashboard/assessments/take/${assessmentId}`)
  }

  const handleContinueAssessment = (attemptId: string) => {
    router.push(`/dashboard/assessments/take/${attemptId}`)
  }

  const handleViewResults = (attemptId: string) => {
    router.push(`/dashboard/assessments/results/${attemptId}`)
  }

  return (
    <SubscriptionCheck>
      <AppLayout>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`${manrope.className} text-3xl font-bold text-gray-900 mb-2`}>
              Assessments
            </h1>
            <p className="text-gray-600">
              Test your knowledge and track your progress across different subjects
            </p>
          </div>

          {/* Progress Overview */}
          {progress && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                    <p className="text-2xl font-bold text-gray-900">{progress.totalAssessments}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{progress.completedAssessments}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{progress.averageScore?.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <PlayIcon className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{progress.totalPoints}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('available')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'available'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available ({assessments.length})
              </button>
              <button
                onClick={() => setActiveTab('in-progress')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'in-progress'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                In Progress ({inProgressAttempts.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed ({completedAttempts.length})
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search assessments..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Subjects</option>
              {/* Add subject options dynamically */}
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'available' && (
              <div className="p-6">
                <h2 className={`${manrope.className} text-xl font-semibold text-gray-900 mb-4`}>
                  Available Assessments
                </h2>
                {assessmentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading assessments...</p>
                  </div>
                ) : assessments.length === 0 ? (
                  <div className="text-center py-8">
                    <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No assessments available at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((assessment: Assessment) => (
                      <div key={assessment._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className={`${manrope.className} text-lg font-semibold text-gray-900`}>
                            {assessment.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(assessment.difficulty)}`}>
                            {assessment.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {assessment.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <AcademicCapIcon className="h-4 w-4 mr-2" />
                            {assessment.subjectId.name} • {assessment.topicId.name}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            {formatTime(assessment.timeLimit)} • {assessment.totalQuestions} questions
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleStartAssessment(assessment._id)}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Start Assessment
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'in-progress' && (
              <div className="p-6">
                <h2 className={`${manrope.className} text-xl font-semibold text-gray-900 mb-4`}>
                  Assessments In Progress
                </h2>
                {attemptsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading attempts...</p>
                  </div>
                ) : inProgressAttempts.length === 0 ? (
                  <div className="text-center py-8">
                    <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No assessments in progress.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inProgressAttempts.map((attempt: AssessmentAttempt) => (
                      <div key={attempt._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`${manrope.className} text-lg font-semibold text-gray-900`}>
                              {attempt.assessmentId.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {attempt.assessmentId.subjectId.name} • {attempt.assessmentId.topicId.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Started: {new Date(attempt.startedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleContinueAssessment(attempt._id)}
                            className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="p-6">
                <h2 className={`${manrope.className} text-xl font-semibold text-gray-900 mb-4`}>
                  Completed Assessments
                </h2>
                {attemptsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading results...</p>
                  </div>
                ) : completedAttempts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No completed assessments yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedAttempts.map((attempt: AssessmentAttempt) => (
                      <div key={attempt._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`${manrope.className} text-lg font-semibold text-gray-900`}>
                              {attempt.assessmentId.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {attempt.assessmentId.subjectId.name} • {attempt.assessmentId.topicId.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Completed: {new Date(attempt.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center mb-2">
                              {getStatusIcon(attempt.status)}
                              <span className="ml-2 text-sm font-medium">
                                {attempt.percentage.toFixed(1)}%
                              </span>
                            </div>
                            <button
                              onClick={() => handleViewResults(attempt._id)}
                              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                            >
                              View Results
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </SubscriptionCheck>
  )
}

export default AssessmentsDashboard 