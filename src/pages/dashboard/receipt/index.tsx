import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import AppLayout from '../../../layout/AppLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { GET_SUBSCRIPTION } from '@/apollo/queries/dashboard'

const fakeData = {
  data: {
    getSubscription: {
      transactionRef: 'TX123456789',
      plan: {
        title: 'Premium Plan',
        type: 'Annual',
      },
      status: 'Active',
      price: 199.99,
      paymentMethod: 'Credit Card',
      startDate: '2023-01-01',
      endDate: '2024-01-01',
      autoRenew: true,
    },
  },
  loading: false,
  error: null,
}
export default function SubscriptionReceipt() {
  // const { data, loading, error } = useQuery(GET_SUBSCRIPTION_QUERY);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error : {error.message}</p>;

  const { getSubscription: subscription } = fakeData.data

  return (
    <AppLayout>
      <div className="mx-auto max-w-md rounded-lg bg-white p-4 shadow-md">
        <div className="flex w-full flex-col items-center justify-center gap-6 rounded-t-lg p-2 text-center">
          <FontAwesomeIcon
            icon={faCircleCheck}
            size="6x"
            style={{ color: 'green' }}
          />
          <h1 className="text-3xl font-bold tracking-tight text-green-500">
            Successful
          </h1>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Subscription Receipt
        </h2>
        <div className="mt-2">
          <p className="text-gray-600">
            Transaction Reference: {subscription.transactionRef}
          </p>
          <p className="text-gray-600">
            Plan: {subscription.plan.title} ({subscription.plan.type})
          </p>
          <p className="text-gray-600">Status: {subscription.status}</p>
          <p className="text-gray-600">Price: ${subscription.price}</p>
          <p className="text-gray-600">
            Payment Method: {subscription.paymentMethod}
          </p>
          <p className="text-gray-600">
            Start Date: {new Date(subscription.startDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            Expiry Date: {new Date(subscription.endDate).toLocaleDateString()}
          </p>
          {/* Continue with the rest of your component */}
        </div>
      </div>
    </AppLayout>
  )
}
