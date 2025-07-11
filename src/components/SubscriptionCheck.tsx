import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { GET_SUBSCRIPTION } from "@/apollo/queries/dashboard"
import ModalAuth from "./ModalComp"
import Link from "next/link"
import { 
  CrownIcon, 
  CheckCircleIcon, 
  StarIcon, 
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlayIcon,
  ArrowRightIcon,
  SparklesIcon
} from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import { manrope } from "@/utils/font"

interface SubscriptionCheckProps {
  children: React.ReactNode
}

const SubscriptionCheck = ({ children }: SubscriptionCheckProps) => {
  const [showModal, setShowModal] = useState(false)
  const { data: subscriptionData, loading } = useQuery(GET_SUBSCRIPTION, { fetchPolicy: 'network-only' })

  useEffect(() => {
    console.log('Subscription data:', subscriptionData)
    if (subscriptionData?.getSubscription?.status !== "active") {
      setShowModal(true)
    }
  }, [subscriptionData])

  if (loading) return null // or a spinner if you prefer

  if (subscriptionData?.getSubscription?.status !== "active") {
    return (
      <ModalAuth isOpen={showModal} onClose={() => setShowModal(false)} styling="w-full max-w-4xl">
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 -mx-6 -mt-6 px-6 py-8 rounded-t-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <CrownIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className={`${manrope.className} text-3xl font-bold text-white mb-2`}>
                Upgrade to Premium
              </h2>
              <p className={`${manrope.className} text-purple-100 text-lg`}>
                Unlock unlimited access to all features and resources
              </p>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Features */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <div>
                  <h3 className={`${manrope.className} text-xl font-semibold text-gray-900 mb-4`}>
                    What you'll get with Premium
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 flex-shrink-0 mt-0.5">
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className={`${manrope.className} text-sm font-medium text-gray-900`}>
                          Unlimited Worksheet Assignments
                        </p>
                        <p className={`${manrope.className} text-sm text-gray-600`}>
                          Assign as many worksheets as you need to your students
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 flex-shrink-0 mt-0.5">
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className={`${manrope.className} text-sm font-medium text-gray-900`}>
                          Advanced Analytics & Reports
                        </p>
                        <p className={`${manrope.className} text-sm text-gray-600`}>
                          Detailed insights into student performance and progress
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 flex-shrink-0 mt-0.5">
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className={`${manrope.className} text-sm font-medium text-gray-900`}>
                          Custom Assessment Creation
                        </p>
                        <p className={`${manrope.className} text-sm text-gray-600`}>
                          Create personalized assessments for your curriculum
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 flex-shrink-0 mt-0.5">
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className={`${manrope.className} text-sm font-medium text-gray-900`}>
                          Priority Support
                        </p>
                        <p className={`${manrope.className} text-sm text-gray-600`}>
                          Get help faster with dedicated customer support
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserGroupIcon className="h-5 w-5 text-blue-600" />
                      <span className={`${manrope.className} text-sm font-semibold text-blue-900`}>Students</span>
                    </div>
                    <p className={`${manrope.className} text-xs text-blue-700`}>Unlimited student management</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <DocumentTextIcon className="h-5 w-5 text-green-600" />
                      <span className={`${manrope.className} text-sm font-semibold text-green-900`}>Worksheets</span>
                    </div>
                    <p className={`${manrope.className} text-xs text-green-700`}>Unlimited worksheet creation</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <ChartBarIcon className="h-5 w-5 text-purple-600" />
                      <span className={`${manrope.className} text-sm font-semibold text-purple-900`}>Analytics</span>
                    </div>
                    <p className={`${manrope.className} text-xs text-purple-700`}>Advanced performance tracking</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <PlayIcon className="h-5 w-5 text-orange-600" />
                      <span className={`${manrope.className} text-sm font-semibold text-orange-900`}>Assessments</span>
                    </div>
                    <p className={`${manrope.className} text-xs text-orange-700`}>Custom assessment tools</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <StarIcon className="h-6 w-6 text-yellow-500" />
                      <h4 className={`${manrope.className} text-xl font-bold text-gray-900`}>
                        Premium Plan
                      </h4>
                      <StarIcon className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="mb-4">
                      <span className={`${manrope.className} text-3xl font-bold text-purple-600`}>
                        $29
                      </span>
                      <span className={`${manrope.className} text-gray-600`}>/month</span>
                    </div>
                    <p className={`${manrope.className} text-sm text-gray-600`}>
                      Cancel anytime • 7-day free trial
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Link
                      href="/dashboard/subscription"
                      className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Start Free Trial
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Link>
                    
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>

                {/* Testimonials */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h5 className={`${manrope.className} font-semibold text-gray-900 mb-4`}>
                    What teachers are saying
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600">
                        S
                      </div>
                      <div>
                        <p className={`${manrope.className} text-sm text-gray-700`}>
                          "The analytics have completely transformed how I track student progress."
                        </p>
                        <p className={`${manrope.className} text-xs text-gray-500 mt-1`}>
                          - Sarah M., Math Teacher
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                        M
                      </div>
                      <div>
                        <p className={`${manrope.className} text-sm text-gray-700`}>
                          "Unlimited worksheets mean I can create exactly what my students need."
                        </p>
                        <p className={`${manrope.className} text-xs text-gray-500 mt-1`}>
                          - Michael R., Science Teacher
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </ModalAuth>
    )
  }

  return <>{children}</>
}

export default SubscriptionCheck 