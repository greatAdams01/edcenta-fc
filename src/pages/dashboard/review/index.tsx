import { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
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
  XCircleIcon,
  TrophyIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

import AppLayout from '../../../layout/AppLayout';
import { FETCH_ASSIGNED, TOPIC_QUERY } from '@/apollo/queries/dashboard';
import { convertTimestampToDate } from '@/utils/convertDate';
import SubscriptionCheck from '@/components/SubscriptionCheck';

interface Grade {
  _id: string;
  stage: number;
  year: string;
  ages: string;
  subject: {
    _id: string;
    name: string;
    worksheet: {
      _id: string;
      title: string;
      levelId: string;
    }[];
    topics: {
      _id: string;
      name: string;
      levelId: string;
    }[];
  }[];
}

export default function Review() {
  const { data, loading } = useQuery(FETCH_ASSIGNED, {
    variables: { status: 'COMPLETED' },
    fetchPolicy: "network-only",
  });

  const [topics, setTopics] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

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
    
    let matchesScore = true;
    if (scoreFilter !== "all" && activity.score !== null && activity.score !== undefined) {
      const score = parseFloat(activity.score);
      switch (scoreFilter) {
        case "excellent":
          matchesScore = score >= 90;
          break;
        case "good":
          matchesScore = score >= 70 && score < 90;
          break;
        case "average":
          matchesScore = score >= 50 && score < 70;
          break;
        case "needs_improvement":
          matchesScore = score < 50;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesDifficulty && matchesScore;
  }) || [];

  // Calculate statistics
  const totalActivities = data?.fetchAssigned?.data?.length || 0;
  const averageScore = data?.fetchAssigned?.data?.reduce((sum: number, activity: any) => 
    sum + (parseFloat(activity.score) || 0), 0) / totalActivities || 0;
  
  const excellentScores = data?.fetchAssigned?.data?.filter((a: any) => parseFloat(a.score) >= 90).length || 0;
  const goodScores = data?.fetchAssigned?.data?.filter((a: any) => parseFloat(a.score) >= 70 && parseFloat(a.score) < 90).length || 0;
  const averageScores = data?.fetchAssigned?.data?.filter((a: any) => parseFloat(a.score) >= 50 && parseFloat(a.score) < 70).length || 0;
  const needsImprovement = data?.fetchAssigned?.data?.filter((a: any) => parseFloat(a.score) < 50).length || 0;

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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <TrophyIcon className="h-4 w-4" />;
    if (score >= 70) return <StarIcon className="h-4 w-4" />;
    if (score >= 50) return <CheckCircleIcon className="h-4 w-4" />;
    return <XCircleIcon className="h-4 w-4" />;
  };

  return (
    <SubscriptionCheck>
      <AppLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Performance Review</h1>
                <p className="text-green-100">
                  Review your completed activities and track your learning progress
                </p>
              </div>
              <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200"
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  View Analytics
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
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Completed</p>
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
                <div className="p-3 bg-blue-100 rounded-lg">
                  {/* <TrendingUpIcon className="h-6 w-6 text-blue-600" /> */}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}%</p>
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
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <TrophyIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Excellent (90%+)</p>
                  <p className="text-2xl font-bold text-gray-900">{excellentScores}</p>
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
                <div className="p-3 bg-purple-100 rounded-lg">
                  <StarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Good (70%+)</p>
                  <p className="text-2xl font-bold text-gray-900">{goodScores}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average (50%+)</p>
                  <p className="text-2xl font-bold text-gray-900">{averageScores}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Needs Improvement</p>
                  <p className="text-2xl font-bold text-gray-900">{needsImprovement}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Completed Activities</h2>
                <p className="text-gray-600">Filter and search through your completed activities</p>
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
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="worksheet">Worksheets</option>
                  <option value="assessment">Assessments</option>
                </select>

                {/* Difficulty Filter */}
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>

                {/* Score Filter */}
                <select
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Scores</option>
                  <option value="excellent">Excellent (90%+)</option>
                  <option value="good">Good (70%+)</option>
                  <option value="average">Average (50%+)</option>
                  <option value="needs_improvement">Needs Improvement</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading completed activities...</p>
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
                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(activity.worksheetId?.difficulty)}`}>
                            {getDifficultyIcon(activity.worksheetId?.difficulty)}
                            <span className="ml-1">{activity.worksheetId?.difficulty || 'Unknown'}</span>
                          </span>
                          {activity.score && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScoreColor(parseFloat(activity.score))}`}>
                              {getScoreIcon(parseFloat(activity.score))}
                              <span className="ml-1">{activity.score}%</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Completed:</span>
                          <span className="text-gray-900">
                            {convertTimestampToDate(activity.completedAt)}
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
                            <span className="text-gray-600">First Attempt:</span>
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
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Review
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ArrowRightIcon className="h-4 w-4 mr-2" />
                          Retake
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed activities found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterType !== "all" || difficultyFilter !== "all" || scoreFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You haven't completed any activities yet"}
                </p>
                {!searchTerm && filterType === "all" && difficultyFilter === "all" && scoreFilter === "all" && (
                  <Link
                    href="/dashboard/preview"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <ArrowRightIcon className="h-5 w-5 mr-2" />
                    Start Activities
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
