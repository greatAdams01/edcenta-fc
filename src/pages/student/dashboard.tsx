import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import StudentLayout from '@/layout/StudentLayout';
import {
  BookOpenIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  PlayIcon,
  AcademicCapIcon,
  FireIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// GraphQL queries (we'll need to add these)
const FETCH_GRADES = `
  query FetchGrades {
    fetchGrades {
      overallScore
      activitiesCompleted
      subjectScores {
        averageScore
        activitiesCompleted
        subject {
          name
        }
      }
      bestPerformingTopics {
        score
        subject {
          name
        }
        topic {
          name
        }
      }
      topicsToWorkOn {
        score
        subject {
          name
        }
        topic {
          name
        }
      }
    }
  }
`;

const FETCH_ASSIGNMENTS = `
  query Assignments($studentId: String) {
    assignments(studentId: $studentId) {
      data {
        _id
        worksheetId {
          _id
          title
          subjectId {
            name
          }
        }
        score
        status
        createdAt
        attemptedAt
      }
    }
  }
`;

export default function StudentDashboard() {
  const router = useRouter();
  const authData: any = getCookie('Authdata');
  const [student, setStudent] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Mock data for now - we'll replace with real GraphQL queries
  const [grades, setGrades] = useState({
    overallScore: 85,
    activitiesCompleted: 24,
    subjectScores: [
      { subject: 'Mathematics', averageScore: 92, activitiesCompleted: 8 },
      { subject: 'Science', averageScore: 78, activitiesCompleted: 6 },
      { subject: 'English', averageScore: 88, activitiesCompleted: 10 }
    ],
    bestPerformingTopics: [
      { subject: 'Mathematics', topic: 'Algebra', score: 95 },
      { subject: 'English', topic: 'Grammar', score: 90 }
    ],
    topicsToWorkOn: [
      { subject: 'Science', topic: 'Chemistry', score: 65 },
      { subject: 'Mathematics', topic: 'Geometry', score: 72 }
    ]
  });

  const [recentAssignments] = useState([
    {
      id: 1,
      title: 'Algebra Basics',
      subject: 'Mathematics',
      score: 95,
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Chemical Reactions',
      subject: 'Science',
      score: 78,
      status: 'completed',
      date: '2024-01-14'
    },
    {
      id: 3,
      title: 'Essay Writing',
      subject: 'English',
      score: null,
      status: 'pending',
      date: '2024-01-16'
    }
  ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (!authData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsed = JSON.parse(authData);
      if (parsed.accountType !== 'STUDENT') {
        router.push('/dashboard');
        return;
      }
      setStudent(parsed);
    } catch (error) {
      console.error('Error parsing auth data:', error);
      router.push('/auth/login');
    }
  }, [isClient, authData, router]);

  if (!isClient || !student) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5" />;
      case 'in-progress':
        return <PlayIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {student.name || 'Student'}! 👋
              </h1>
              <p className="text-blue-100">
                Ready to continue your learning journey? You have {grades.activitiesCompleted} activities completed.
              </p>
            </div>
            <div className="hidden md:block">
              <FireIcon className="h-16 w-16 text-yellow-300" />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Score</p>
                <p className="text-2xl font-bold text-gray-900">{grades.overallScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activities Completed</p>
                <p className="text-2xl font-bold text-gray-900">{grades.activitiesCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUpIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
                  <Link
                    href="/student/assignments"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(assignment.status)}`}>
                          {getStatusIcon(assignment.status)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-600">{assignment.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {assignment.score !== null ? (
                          <p className="font-semibold text-gray-900">{assignment.score}%</p>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        )}
                        <p className="text-xs text-gray-500">{assignment.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subject Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Subject Performance</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {grades.subjectScores.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{subject.subject}</span>
                        <span className="text-sm font-semibold text-gray-900">{subject.averageScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${subject.averageScore}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">{subject.activitiesCompleted} activities</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/student/courses"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BookOpenIcon className="h-6 w-6 text-blue-600 mr-3" />
              <span className="font-medium text-gray-900">Start Learning</span>
            </Link>
            <Link
              href="/student/timer"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <ClockIcon className="h-6 w-6 text-green-600 mr-3" />
              <span className="font-medium text-gray-900">Study Timer</span>
            </Link>
            <Link
              href="/student/progress"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
              <span className="font-medium text-gray-900">View Progress</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </StudentLayout>
  );
} 