'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import {
  UserGroupIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { STUDENTS } from '@/apollo/queries/dashboard'

interface TutorStatsProps {
  className?: string
}

export default function TutorStats({ className = '' }: TutorStatsProps) {
  const router = useRouter()
  const [isTutor, setIsTutor] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const { data: studentsData, loading, error } = useQuery(STUDENTS, {
    skip: !isTutor,
    onError: (error) => {
      console.error('Error fetching students:', error)
    },
    onCompleted: (data) => {
      console.log('Students data loaded:', data)
    }
  })

  const students = studentsData?.students?.data || []

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const authData: any = getCookie('Authdata')
    
    if (!authData) {
      setIsTutor(false)
      return
    }

    try {
      const parsedAuthData = JSON.parse(authData)
      console.log('Auth data:', parsedAuthData)
      
      // Check if user is a tutor (not admin, not student)
      if (parsedAuthData.accountType === 'TUTOR') {
        setIsTutor(true)
        console.log('User is a tutor, showing stats')
      } else {
        setIsTutor(false)
        console.log('User is not a tutor, account type:', parsedAuthData.accountType)
      }
    } catch (error) {
      console.error('Error parsing auth data:', error)
      setIsTutor(false)
    }
  }, [isClient])

  // Calculate statistics
  const totalStudents = students.length
  const activeStudents = students.filter((s: any) => s.isActive).length
  const inactiveStudents = totalStudents - activeStudents
  
  // Group students by grade to get total grades
  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade?.year || 'Unknown'
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(student)
    return groups
  }, {})
  const totalGrades = Object.keys(groupedStudents).length

  // Don't render if not a tutor
  if (!isTutor) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-purple-50 to-indigo-100 py-12 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Welcome back, Tutor!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Here&apos;s an overview of your teaching dashboard
          </motion.p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : totalStudents}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Active Students */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : activeStudents}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Total Grades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Grades</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : totalGrades}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Inactive Students */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : inactiveStudents}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600 text-sm">
              Error loading student data. Please try refreshing the page.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
} 