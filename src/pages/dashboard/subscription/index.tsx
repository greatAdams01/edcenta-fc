"use client"

import { useState, useEffect } from "react"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useMutation, useQuery } from "@apollo/client"
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  ArrowPathIcon, 
  PlusCircleIcon,
  CalendarIcon,
  ShieldCheckIcon,
  StarIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline"
import { motion, AnimatePresence } from "framer-motion"

import AppLayout from "../../../layout/AppLayout"
import { GET_PLANS, GET_SUBSCRIPTION } from "@/apollo/queries/dashboard"
import { SUBSCRIBE_TO_PLAN } from "@/apollo/mutations/dashboard"
import { showToast } from "@/utils/toast"
import type { IPlan } from "../../../../types"
import ModalAuth from "@/components/ModalComp"
import CustomPlan from "@/components/dashbord/CustomPlan"

function Index() {
  const [plans, setPlans] = useState<IPlan[]>([])
  const [open, setOpen] = useState(false)
  const [showPlanDetails, setShowPlanDetails] = useState<string | null>(null)
  const { data: subscriptionData, refetch: refetchSubscription } = useQuery(GET_SUBSCRIPTION, {
    fetchPolicy: "network-only",
  })
  const [changePlan, setChangePlan] = useState(false)
  const { data: plansData, refetch: refetchPlans } = useQuery(GET_PLANS, {
    fetchPolicy: "network-only",
  })

  const [subscribeToPlan, { loading }] = useMutation(SUBSCRIBE_TO_PLAN, {
    variables: {
      planCode: "",
    },
    onCompleted: (data) => {
      console.log(data)
      if (data.subscribeToPlan && data.subscribeToPlan.authorization_url) {
        window.location.href = data.subscribeToPlan.authorization_url
      }
    },
    onError: (error) => {
      showToast("error", error.message)
      console.log(error)
    },
  })

  const handleSubscribe = (planCode: string) => {
    subscribeToPlan({
      variables: { planCode },
    })
  }

  useEffect(() => {
    if (!subscriptionData || Object.keys(subscriptionData).length === 0) {
      refetchPlans()
    }
  }, [subscriptionData, refetchPlans])

  useEffect(() => {
    if (plansData && plansData.getPlans) {
      setPlans(plansData.getPlans)
      console.log(plans)
    }
  }, [plans, plansData])

  const formattedDate = subscriptionData?.getSubscription?.endDate
    ? new Date(subscriptionData.getSubscription.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  const vatRate = 0.2
  const planPrice = subscriptionData?.getSubscription?.plan?.planPrice || 0
  const vatAmount = planPrice * vatRate
  const monthlyTotal = planPrice + vatAmount

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'pending':
        return <ClockIcon className="h-4 w-4" />
      case 'expired':
        return <XCircleIcon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const PlanCard = ({ plan, isPopular = false }: { plan: IPlan; isPopular?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
        isPopular 
          ? 'border-purple-500 scale-105' 
          : 'border-gray-200 hover:border-purple-300'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
            <StarIcon className="h-4 w-4 mr-1" />
            Most Popular
          </span>
        </div>
      )}

      <div className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
          <p className="text-gray-600 mb-4">{plan.subTitle}</p>
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">₦{plan.planPrice}</span>
            <span className="text-gray-500">/month</span>
          </div>

          {plan.priceOfFreeTrial && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-green-800">
                <strong>Free Trial:</strong> ₦{plan.priceOfFreeTrial}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Price per Course:</span>
            <span className="text-sm font-semibold text-gray-900">₦{plan.pricePerCourse}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Plan Type:</span>
            <span className="text-sm font-semibold text-gray-900 capitalize">{plan.type}</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <AcademicCapIcon className="h-4 w-4 mr-2" />
            Included Courses
          </h4>
          <div className="space-y-2">
            {plan.allowedCourseList.slice(0, 3).map((course) => (
              <div key={course._id} className="flex items-center text-sm text-gray-600">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {course.name}
              </div>
            ))}
            {plan.allowedCourseList.length > 3 && (
              <button
                onClick={() => setShowPlanDetails(showPlanDetails === plan._id ? null : plan._id)}
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
              >
                {showPlanDetails === plan._id ? (
                  <>
                    Show less <ChevronUpIcon className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Show {plan.allowedCourseList.length - 3} more <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            )}
          </div>
          
          <AnimatePresence>
            {showPlanDetails === plan._id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                {plan.allowedCourseList.slice(3).map((course) => (
                  <div key={course._id} className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {course.name}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSubscribe(plan.planCode)}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center ${
            isPopular
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              : 'bg-gray-900 hover:bg-gray-800'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              Choose Plan
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {!changePlan && subscriptionData ? "My Subscription" : "Choose Your Plan"}
              </h1>
              <p className="text-purple-100">
                {!changePlan && subscriptionData 
                  ? "Manage your current subscription and billing" 
                  : "Select the perfect plan for your learning journey"
                }
              </p>
            </div>
            {!changePlan && subscriptionData && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChangePlan(true)}
                className="mt-4 lg:mt-0 inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all duration-200"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Change Plan
              </motion.button>
            )}
          </div>
        </div>

        {!changePlan && subscriptionData?.getSubscription ? (
          /* Current Subscription View */
          <div className="space-y-6">
            {/* Subscription Status Cards */}
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
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">
                      {subscriptionData.getSubscription.status}
                    </p>
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
                    <CreditCardIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₦{((planPrice / 12) / 100).toFixed(2)}
                    </p>
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
                    <CalendarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Renewal Date</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formattedDate}
                    </p>
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
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <ShieldCheckIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Plan Type</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">
                      {subscriptionData.getSubscription.plan.type}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Current Plan Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Current Plan Details</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(subscriptionData.getSubscription.status)}`}>
                  {getStatusIcon(subscriptionData.getSubscription.status)}
                  <span className="ml-1 capitalize">{subscriptionData.getSubscription.status}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{subscriptionData.getSubscription.plan.title}</h3>
                  <p className="text-gray-600 mb-6">{subscriptionData.getSubscription.plan.subTitle}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan Price:</span>
                      <span className="font-semibold">₦{(planPrice / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT (20%):</span>
                      <span className="font-semibold">₦{(vatAmount / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Monthly Total:</span>
                        <span className="text-lg font-bold text-gray-900">₦{(monthlyTotal / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Included Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Access to all course materials</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Progress tracking and analytics</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">24/7 customer support</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Certificate upon completion</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Update Payment Method
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Cancel Subscription
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Plan Selection View */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Plans</h2>
                <p className="text-gray-600">Choose the plan that best fits your learning needs</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(true)}
                className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Custom Plan
              </motion.button>
            </div>

            {plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                  <PlanCard 
                    key={plan._id} 
                    plan={plan} 
                    isPopular={index === 1} // Make the middle plan popular
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No plans available</h3>
                <p className="text-gray-600">Please check back later for available subscription plans.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />

      <ModalAuth isOpen={open} XIcon={true} onClose={() => setOpen(false)} styling={"w-[1000px] m-auto"}>
        <CustomPlan />
      </ModalAuth>
    </AppLayout>
  )
}

export default Index

