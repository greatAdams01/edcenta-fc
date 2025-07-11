import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import StudentLayout from '@/layout/StudentLayout';
import {
  BookOpenIcon,
  PlayIcon,
  ClockIcon,
  StarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// GraphQL queries
const SUBJECTS_LIST = `
  query Subjects($page: Int, $limit: Int) {
    subjects(page: $page, limit: $limit) {
      data {
        _id
        name
        slug
        tags
        description
        topics {
          data {
            _id
            name
            slug
          }
        }
        createdAt
      }
    }
  }
`;

export default function StudentCourses() {
  const router = useRouter();
  const authData: any = getCookie('Authdata');
  const [student, setStudent] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Mock data for courses
  const [courses] = useState([
    {
      id: 1,
      title: 'Mathematics Fundamentals',
      subject: 'Mathematics',
      description: 'Master the basics of mathematics including algebra, geometry, and arithmetic.',
      topics: 12,
      completedTopics: 8,
      difficulty: 'Beginner',
      duration: '8 weeks',
      rating: 4.8,
      enrolled: 1250,
      image: '/hero1.jpg'
    },
    {
      id: 2,
      title: 'Science Explorer',
      subject: 'Science',
      description: 'Discover the wonders of science through interactive experiments and lessons.',
      topics: 15,
      completedTopics: 5,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      rating: 4.6,
      enrolled: 980,
      image: '/hero2.jpg'
    },
    {
      id: 3,
      title: 'English Language Arts',
      subject: 'English',
      description: 'Develop your reading, writing, and communication skills.',
      topics: 18,
      completedTopics: 12,
      difficulty: 'Beginner',
      duration: '12 weeks',
      rating: 4.9,
      enrolled: 2100,
      image: '/hero3.jpg'
    },
    {
      id: 4,
      title: 'Advanced Mathematics',
      subject: 'Mathematics',
      description: 'Advanced concepts in calculus, trigonometry, and statistics.',
      topics: 20,
      completedTopics: 3,
      difficulty: 'Advanced',
      duration: '15 weeks',
      rating: 4.7,
      enrolled: 650,
      image: '/hero4.jpg'
    }
  ]);

  const subjects = ['all', 'Mathematics', 'Science', 'English', 'History', 'Geography'];

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

  const filteredCourses = selectedSubject === 'all' 
    ? courses 
    : courses.filter(course => course.subject === selectedSubject);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="mt-2 text-gray-600">
              Continue your learning journey with our comprehensive courses
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/student/progress"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              View Progress
            </Link>
          </div>
        </motion.div>

        {/* Subject Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Subject</h2>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSubject === subject
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject === 'all' ? 'All Subjects' : subject}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Course Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                  <p className="text-blue-100 text-sm">{course.subject}</p>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">
                      {course.completedTopics}/{course.topics} topics
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(course.completedTopics, course.topics)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getProgressPercentage(course.completedTopics, course.topics)}% complete
                  </p>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                    {course.rating}
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    {course.enrolled}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/student/course/${course.id}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  {course.completedTopics > 0 ? 'Continue Learning' : 'Start Learning'}
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              No courses match your current filter. Try selecting a different subject.
            </p>
          </motion.div>
        )}
      </div>
    </StudentLayout>
  );
} 