import { Fragment, useEffect, useState } from 'react'
import {
  PlusIcon, 
  ArrowRightEndOnRectangleIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link';
import EditStudent from '@/components/dashbord/EditStudent';
import ModalAuth from '@/components/ModalComp';
import { IStudent } from '../../../types';
import { USER, STUDENTS } from '@/apollo/queries/dashboard';
import AppLayout from '../../layout/AppLayout';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const router = useRouter();
  const { data: userData, loading: userLoading } = useQuery(USER);
  const { data: studentsData, loading: studentsLoading } = useQuery(STUDENTS);
  const user = userData?.user || [];
  const students = studentsData?.students?.data || [];
  const [student, setStudent] = useState<IStudent | null>(null)
  const [isOpen, setOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const groupedStudents = students.reduce((groups: any, student: any) => {
    const groupKey = student.grade?.year || 'Unknown';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(student);
    return groups;
  }, {});

  const [openSubtables, setOpenSubtables] = useState<Array<boolean>>(Array(Object.keys(groupedStudents).length).fill(false));
  const [accountType, setAccountType] = useState('' as string);

  const toggleDropdown = (index: number) => {
    const newOpenSubtables = [...openSubtables];
    newOpenSubtables[index] = !newOpenSubtables[index];
    setOpenSubtables(newOpenSubtables);
  };

  // Get Authdata from Cookies
  const authData: any = getCookie('Authdata');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (!authData) {
      router.push('/auth/login');
      return;
    }
    console.log(JSON.parse(authData).accountType);
    setAccountType(JSON.parse(authData).accountType);
  }, [isClient, authData, router]);

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter((s: any) => s.isActive).length;
  const inactiveStudents = totalStudents - activeStudents;
  const totalGrades = Object.keys(groupedStudents).length;

  // Filter students based on search and grade
  const filteredStudents = students.filter((student: any) => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === "all" || student.grade?.year === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />;
  };

  const getGradeColor = (grade: string) => {
    const colors = [
      'bg-gradient-to-r from-blue-400 to-blue-500',
      'bg-gradient-to-r from-green-400 to-green-500',
      'bg-gradient-to-r from-purple-400 to-purple-500',
      'bg-gradient-to-r from-pink-400 to-pink-500',
      'bg-gradient-to-r from-yellow-400 to-yellow-500',
      'bg-gradient-to-r from-indigo-400 to-indigo-500'
    ];
    const index = grade.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const StudentCard = ({ student }: { student: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{student.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{student.email}</p>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.isActive)}`}>
                {getStatusIcon(student.isActive)}
                <span className="ml-1">{student.isActive ? 'Active' : 'Inactive'}</span>
              </span>
              <span className="text-xs text-gray-500">Age: {student.age}</span>
            </div>
          </div>
          <div className="ml-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getGradeColor(student.grade?.year || 'Unknown')}`}>
              {student.grade?.year || 'Unknown'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Assigned</p>
            <p className="text-lg font-bold text-gray-900">1</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-lg font-bold text-gray-900">1</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Subject Averages</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-green-100 rounded">
              <p className="text-xs text-green-800 font-medium">8</p>
            </div>
            <div className="text-center p-2 bg-orange-100 rounded">
              <p className="text-xs text-orange-800 font-medium">99</p>
            </div>
            <div className="text-center p-2 bg-purple-100 rounded">
              <p className="text-xs text-purple-800 font-medium">200</p>
            </div>
            <div className="text-center p-2 bg-pink-100 rounded">
              <p className="text-xs text-pink-800 font-medium">9</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Points</p>
            <p className="text-lg font-bold text-gray-900">10</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Rewards</p>
            <Link href="/dashboard/reward" className="text-lg font-bold text-purple-600 hover:text-purple-700">
              0
            </Link>
          </div>
        </div>

        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setStudent(student); setOpen(true) }}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowRightEndOnRectangleIcon className="h-4 w-4 mr-2" />
            Login
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-indigo-100">
                Welcome back, {user.firstName}! Here&apos;s an overview of your students and their progress.
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Add Student
              </motion.button>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Account Status</h2>
              <p className="text-gray-600">Your current subscription and account information</p>
            </div>
            <div className="flex items-center space-x-3">
              {user.isActive ? (
                <div className="flex items-center space-x-2">
                  <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="flex-none rounded-full bg-red-400/10 p-1 text-red-400">
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <span className="text-sm font-medium text-red-600">Inactive</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Grades</p>
                <p className="text-2xl font-bold text-gray-900">{totalGrades}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Rewards</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.reduce((sum: number, s: any) => sum + (s.reward || 0), 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Student Management</h2>
              <p className="text-gray-600">Search and filter your students by grade or status</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Grade Filter */}
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Grades</option>
                {Object.keys(groupedStudents).map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ChartBarIcon className="h-4 w-4 inline mr-2" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <UserGroupIcon className="h-4 w-4 inline mr-2" />
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="space-y-6">
          {studentsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading students...</p>
            </div>
          ) : viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStudents.map((student: any, index: number) => (
                <StudentCard key={student._id} student={student} />
              ))}
            </div>
          ) : (
            // List View (Original Table Style)
            <div className="space-y-4">
              {Object.keys(groupedStudents).map((grade, index) => (
                <Fragment key={grade}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleDropdown(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg text-white ${getGradeColor(grade)}`}>
                            <AcademicCapIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{grade}</h3>
                            <p className="text-sm text-gray-600">
                              {groupedStudents[grade].length} {groupedStudents[grade].length === 1 ? 'student' : 'students'}
                            </p>
                          </div>
                        </div>
                        <ChevronDownIcon 
                          className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                            openSubtables[index] ? 'rotate-180' : ''
                          }`} 
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {openSubtables[index] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-200"
                        >
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Averages</th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rewards</th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {groupedStudents[grade].map((student: any) => (
                                  <tr key={student._id} className="hover:bg-gray-50">
                                    <td 
                                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                      onClick={() => { setStudent(student); setOpen(true) }}
                                    >
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                        <div className="text-sm text-gray-500">{student.email}</div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">1</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">1</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex justify-center space-x-1">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">8</span>
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">99</span>
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">200</span>
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-pink-100 text-pink-800">9</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">10</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                      <Link href="/dashboard/reward" className="text-purple-600 hover:text-purple-700">0</Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                      <button className="text-indigo-600 hover:text-indigo-900">
                                        <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Fragment>
              ))}
            </div>
          )}

          {filteredStudents.length === 0 && !studentsLoading && (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedGrade !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first student"}
              </p>
              {!searchTerm && selectedGrade === "all" && (
                <Link
                  href="/dashboard/students/add_student"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Add Student
                </Link>
              )}
            </div>
          )}
        </div>

        <ModalAuth
          isOpen={isOpen}
          XIcon={true}
          onClose={() => (setOpen(false))}>
          {student !== null && <EditStudent student={student} />}
        </ModalAuth>
      </div>
    </AppLayout>
  )
}
