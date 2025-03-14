"use client"

import { useState, useEffect } from "react"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useMutation, useQuery } from "@apollo/client"
import { CreditCardIcon, CheckCircleIcon, ArrowPathIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"

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
  }, [plansData])

  useEffect(() => {
    if (subscriptionData) {
      console.log(JSON.stringify(subscriptionData, null, 2))
    }
    if (plansData) {
      console.log(JSON.stringify(plansData, null, 2))
    }
  }, [subscriptionData, plansData])

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

  return (
    <AppLayout>
      <div className="grid justify-items-stretch transition-colors duration-200">
        <div className="w-full justify-self-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
          <div className="mb-6 flex w-full items-center justify-between gap-x-3 bg-purple-100 p-4 dark:bg-purple-900/20 rounded-t-lg transition-colors duration-200">
            <div className="flex w-full items-center justify-start gap-x-3">
              <CreditCardIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                {!changePlan && subscriptionData ? "My Subscription" : "Choose a Plan"}
              </h1>
            </div>
          </div>

          <div className="px-6 pb-6">
            {!changePlan && subscriptionData?.getSubscription ? (
              <div className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    Your current subscription details and billing information
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setChangePlan(true)}
                    className="mt-3 sm:mt-0 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200"
                  >
                    <ArrowPathIcon className="mr-2 h-5 w-5" />
                    Change Plan
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-gray-700 p-6 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 rounded-md bg-purple-200 dark:bg-purple-800 p-3">
                        <CheckCircleIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Status</dt>
                          <dd>
                            <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                              {subscriptionData.getSubscription.status}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-gray-700 p-6 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 rounded-md bg-purple-200 dark:bg-purple-800 p-3">
                        <CreditCardIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Monthly Total
                          </dt>
                          <dd>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              ₦{((planPrice / 12) * 100).toFixed(2)}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Subscription Type</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {subscriptionData.getSubscription.plan.type}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Renewal Date</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formattedDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="#"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <CreditCardIcon className="mr-2 h-5 w-5" />
                    Update Payment Method
                  </motion.a>
                </div>

                <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 transition-colors duration-200">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                      Subscription Details
                    </h3>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                    <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                        >
                          Subscription Plan
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white transition-colors duration-200">
                          {subscriptionData.getSubscription.plan.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right transition-colors duration-200">
                          ₦{(planPrice / 100).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                    <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                        >
                          Taxes
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white transition-colors duration-200">
                          VAT (20%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right transition-colors duration-200">
                          ₦{(vatAmount / 100).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                          Monthly Total
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white text-right underline transition-colors duration-200">
                          ₦{(monthlyTotal / 100).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                      Select a subscription plan
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-200">
                      Choose the plan that best fits your needs
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpen(true)}
                    className="mt-3 sm:mt-0 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200"
                  >
                    <PlusCircleIcon className="mr-2 h-5 w-5" />
                    Custom Plan
                  </motion.button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {plans &&
                    (plans as IPlan[]).map((plan: IPlan) => (
                      <motion.div
                        key={plan._id}
                        whileHover={{ scale: 1.02 }}
                        className="flex flex-col justify-between overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200"
                      >
                        <div className="p-6">
                          <div className="mb-5">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                              {plan.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                              {plan.subTitle}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                Price per Course:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                                ₦{plan.pricePerCourse}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                Plan Price:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                                ₦{plan.planPrice}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                Free Trial:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                                {plan.priceOfFreeTrial ? `₦${plan.priceOfFreeTrial}` : "No"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                Type:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                                {plan.type}
                              </span>
                            </div>
                          </div>

                          <div className="mt-5">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                              Allowed Courses:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {plan.allowedCourseList.map((course) => (
                                <span
                                  key={course._id}
                                  className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 transition-colors duration-200"
                                >
                                  {course.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 transition-colors duration-200">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSubscribe(plan.planCode)}
                            className="w-full inline-flex justify-center items-center rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200"
                            disabled={loading}
                          >
                            {loading ? "Processing..." : "Choose Plan"}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                </div>

                {plans.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      No plans available at the moment.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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
        
        transition={Slide}
      />

      <ModalAuth isOpen={open} XIcon={true} onClose={() => setOpen(false)} styling={"w-[1000px] m-auto"}>
        <CustomPlan />
      </ModalAuth>
    </AppLayout>
  )
}

export default Index

