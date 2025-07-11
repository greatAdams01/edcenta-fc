import { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { 
  EyeIcon, 
  ClockIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlayIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

import AppLayout from '../../../layout/AppLayout';
import { FETCH_ASSIGNED, TOPIC_QUERY } from '@/apollo/queries/dashboard';
import SubscriptionCheck from '@/components/SubscriptionCheck'

export default function Preview() {
  const { data, loading } = useQuery(FETCH_ASSIGNED, {
    variables: { status: 'ASSIGNED' },
    fetchPolicy: "network-only",
  });

  const [topics, setTopics] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const [getTopic, { data: topicData }] = useLazyQuery(TOPIC_QUERY);

  useEffect(() => {
    if (data?.fetchAssigned?.data) {
      const topicIds = data.fetchAssigned.data.map((single: any) => single.worksheetId?.topicId);
      fetchTopics(topicIds);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const fetchTopics = async (topicIds: string[]) => {
    const topicPromises = topicIds.map((id) =>
      getTopic({ variables: { topicId: id } }).then((res) => ({
        id,
        name: res.data?.topic?.name,
      }))
    );

    const topicsData = await Promise.all(topicPromises);
    const topicMap = topicsData.reduce((acc, topic) => {
      if (topic.name) {
        acc[topic.id] = topic.name;
      }
      return acc;
    }, {} as { [key: string]: string });

    setTopics(topicMap);
  };

  // Filter activities based on search and filters
  const filteredActivities = data?.fetchAssigned?.data?.filter((activity: any) => {
    const matchesSearch = activity.worksheetId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topics[activity.worksheetId?.topicId]?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || 
                       (filterType === "worksheet" && activity.worksheetId?.title) ||
                       (filterType === "assessment" && activity.worksheetId?.assessmentType);
    const matchesDifficulty = difficultyFilter === "all" || activity.worksheetId?.difficulty === difficultyFilter;
    
    return matchesSearch && matchesType && matchesDifficulty;
  }) || [];

  // Calculate statistics
  const totalActivities = data?.fetchAssigned?.data?.length || 0;
  const pendingActivities = data?.fetchAssigned?.data?.filter((a: any) => a.status === 'PENDING').length || 0;
  const inProgressActivities = data?.fetchAssigned?.data?.filter((a: any) => a.status === 'IN_PROGRESS').length || 0;
  const completedActivities = data?.fetchAssigned?.data?.filter((a: any) => a.status === 'COMPLETED').length || 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HARD':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'MEDIUM':
        return <StarIcon className="h-4 w-4" />;
      case 'HARD':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <StarIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  return (
    <SubscriptionCheck>
      <AppLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Activity Preview</h1>
                <p className="text-blue-100">
                  Review and manage your assigned activities and assignments
                </p>
              </div>
              <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200"
                >
                  <EyeIcon className="h-5 w-5 mr-2" />
                  View All
                </motion.button>
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
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
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
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingActivities}</p>
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
                  <PlayIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{inProgressActivities}</p>
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
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedActivities}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Assigned Activities</h2>
                <p className="text-gray-600">Filter and search through your assigned activities</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="worksheet">Worksheets</option>
                  <option value="assessment">Assessments</option>
                </select>

                {/* Difficulty Filter */}
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading activities...</p>
              </div>
            ) : filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredActivities.map((activity: any, index: number) => (
                  <motion.div
                    key={activity._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {activity.worksheetId?.title || 'Untitled Activity'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {topics[activity.worksheetId?.topicId] || 'Loading topic...'}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(activity.worksheetId?.difficulty)}`}>
                            {getDifficultyIcon(activity.worksheetId?.difficulty)}
                            <span className="ml-1">{activity.worksheetId?.difficulty || 'Unknown'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                            {activity.status || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Assigned:</span>
                          <span className="text-gray-900">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {activity.attemptedAt && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Last Attempt:</span>
                            <span className="text-gray-900">
                              {new Date(activity.attemptedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Preview
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ArrowRightIcon className="h-4 w-4 mr-2" />
                          Start
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterType !== "all" || difficultyFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You don't have any assigned activities yet"}
                </p>
                {!searchTerm && filterType === "all" && difficultyFilter === "all" && (
                  <Link
                    href="/dashboard/assign"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <ArrowRightIcon className="h-5 w-5 mr-2" />
                    Assign Activities
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </SubscriptionCheck>
  );
}
