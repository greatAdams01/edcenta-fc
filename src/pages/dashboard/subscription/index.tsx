import React, { useState, useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useMutation } from '@apollo/client'

import AppLayout from '../../../layout/AppLayout'
import { GET_PLANS, GET_SUBSCRIPTION } from '@/apollo/queries/dashboard'
import { useQuery } from '@apollo/client'
import { SUBSCRIBE_TO_PLAN } from '@/apollo/mutations/dashboard'
import { showToast } from '@/utils/toast'

const getPlans = [
  {
    _id: '1',
    title: 'Basic Plan',
    pricePerCourse: 20,
    allowedCourseList: [
      { _id: 'c1', name: 'HTML Basics' },
      { _id: 'c2', name: 'CSS Fundamentals' },
    ],
    priceOfFreeTrial: 0,
    subTitle: 'A great start for beginners.',
    planPrice: 50,
    planCode: 'BASIC',
    type: 'Starter',
  },
  {
    _id: '2',
    title: 'Pro Plan',
    pricePerCourse: 15,
    allowedCourseList: [
      { _id: 'c3', name: 'JavaScript Essentials' },
      { _id: 'c4', name: 'Advanced CSS' },
      { _id: 'c5', name: 'Intro to React' },
    ],
    priceOfFreeTrial: 0,
    subTitle: 'For the aspiring developer.',
    planPrice: 100,
    planCode: 'PRO',
    type: 'Intermediate',
  },
  {
    _id: '3',
    title: 'Ultimate Plan',
    pricePerCourse: 10,
    allowedCourseList: [
      { _id: 'c6', name: 'Node.js from Scratch' },
      { _id: 'c7', name: 'Express Basics' },
      { _id: 'c8', name: 'MongoDB for Beginners' },
      { _id: 'c9', name: 'React Native Introduction' },
    ],
    priceOfFreeTrial: 0,
    subTitle: 'Everything you need to become a full-stack developer.',
    planPrice: 200,
    planCode: 'ULTIMATE',
    type: 'Advanced',
  },
]

function Index() {
  const { data: subscriptionData, refetch: refetchSubscription } = useQuery(
    GET_SUBSCRIPTION,
    {
      fetchPolicy: 'network-only',
    },
  )
  const { data: plansData, refetch: refetchPlans } = useQuery(GET_PLANS, {
    skip: true,
  })

  const [subscribeToPlan, { loading }] = useMutation(SUBSCRIBE_TO_PLAN, {
    variables: {
      planCode: '',
    },
    onCompleted: (data) => {
      console.log(data)
      showToast('success', 'Subscription successful')
    },
    onError: (error) => {
      showToast('error', error.message)
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
    if (subscriptionData) {
      console.log(JSON.stringify(subscriptionData, null, 2))
    }
    if (plansData) {
      console.log(JSON.stringify(plansData, null, 2))
    }
  }, [subscriptionData, plansData])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="flex w-full justify-self-center rounded-md border-2 p-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            {subscriptionData ? (
              <form onSubmit={handleSubmit} className="w-full ">
                <div className="my-4 flex w-full items-center justify-between">
                  <h1 className="text-lg font-bold">My Subscription</h1>
                </div>

                <div className="mt-6 justify-between md:grid md:grid-cols-2 md:gap-6">
                  <div className="my-2 font-bold">
                    <p>Status: {}</p>
                  </div>
                  <div className="my-2 font-bold">
                    <p>Total per Month: {}</p>
                  </div>
                  <div className="my-2 font-bold">Subscription Type: {}</div>
                  <div className="my-2 font-bold">Renewal Date: {}</div>
                  <div className="my-1 flex w-full py-2 font-bold">
                    <a
                      href="#"
                      className="flex w-full justify-center rounded-md border-2 p-2 text-center font-bold hover:border-black"
                    >
                      Change Plan
                    </a>
                  </div>
                  <div className="my-1 flex w-full py-2 font-bold">
                    <a
                      href="#"
                      className="flex w-full justify-center rounded-md border-2 p-2 text-center font-bold hover:border-black"
                    >
                      Update Card
                    </a>
                  </div>
                </div>
                <div className="my-6 font-bold">
                  <table className="w-full">
                    <colgroup>
                      <col className="w-full sm:w-6/12" />
                      <col className="w-full sm:w-6/12" />
                    </colgroup>
                    <thead className=" w-full bg-gray-200 ">
                      <tr className="w-full">
                        <th scope="col" className="py-4 pl-2 text-start">
                          Subscription Plan
                        </th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody className="devide-white/5 divide-y">
                      <tr>
                        <td className="p-2">Educator Monthly Core</td>
                        <td className="text-end">$10.24</td>
                      </tr>
                    </tbody>
                    <thead className=" w-full bg-gray-200 ">
                      <tr className="w-full">
                        <th scope="col" className="py-4 pl-2 text-start">
                          Taxes
                        </th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody className="devide-white/5 divide-y">
                      <tr className="w-full">
                        <td className="p-2">Vat(20%)</td>
                        <td className="text-end">$1.05</td>
                      </tr>
                      <tr className="w-full">
                        <td className="p-2">Monthly Total</td>
                        <td className="font-bolder text-end underline">
                          $11.29
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </form>
            ) : (
              <div className="w-full ">
                <div className="my-4 space-y-3">
                  <h1 className="text-center text-xl font-bold sm:text-2xl">
                    PLANS
                  </h1>
                  <h2 className="text-lg font-bold">
                    Select any of the available plans
                  </h2>
                </div>

                <div className="mt-6 justify-center md:grid md:grid-cols-2 md:gap-6 xl:grid-cols-3">
                  {getPlans &&
                    getPlans.map((plan) => (
                      <div
                        key={plan._id}
                        className="flex max-w-sm flex-col justify-between overflow-hidden rounded-lg border border-black p-6 shadow-lg hover:border-blue-500"
                      >
                        <div>
                          <div className="py-4">
                            <div className="mb-2 text-xl font-bold">
                              {plan.title}
                            </div>
                            <p className="text-base text-gray-700">
                              {plan.subTitle}
                            </p>
                          </div>
                          <div className="pb-2 pt-4">
                            <p>Price per Course: ${plan.pricePerCourse}</p>
                            <p>Plan Price: ${plan.planPrice}</p>
                            <p>
                              Free Trial:{' '}
                              {plan.priceOfFreeTrial
                                ? `$${plan.priceOfFreeTrial}`
                                : 'No'}
                            </p>
                            <p>Type: {plan.type}</p>
                            <div className="mt-3">
                              <span className="mb-2 mr-2 inline-block rounded-full bg-green-400 px-3 py-1 text-sm font-semibold text-black">
                                Allowed Courses:
                              </span>
                              {plan.allowedCourseList.map((course) => (
                                <span
                                  key={course._id}
                                  className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                                >
                                  {course.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center pb-2 pt-4">
                          <button
                            className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                            onClick={() => handleSubscribe(plan.planCode)}
                          >
                            Choose Plan
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </AppLayout>
  )
}

export default Index
