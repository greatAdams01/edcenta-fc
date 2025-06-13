import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { GET_SUBSCRIPTION } from "@/apollo/queries/dashboard"
import ModalAuth from "./ModalComp"
import Link from "next/link"

interface SubscriptionCheckProps {
  children: React.ReactNode
}

const SubscriptionCheck = ({ children }: SubscriptionCheckProps) => {
  const [showModal, setShowModal] = useState(false)
  const { data: subscriptionData } = useQuery(GET_SUBSCRIPTION)

  useEffect(() => {
    if (subscriptionData?.getSubscription?.status !== "active") {
      setShowModal(true)
    }
  }, [subscriptionData])

  if (subscriptionData?.getSubscription?.status !== "active") {
    return (
      <>
        {children}
        <ModalAuth isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                No Active Subscription
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  You need an active subscription to access this feature. Please subscribe to continue.
                </p>
              </div>
              <div className="mt-5 sm:mt-6">
                <Link
                  href="/dashboard/subscription"
                  className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  View Subscription Plans
                </Link>
              </div>
            </div>
          </div>
        </ModalAuth>
      </>
    )
  }

  return <>{children}</>
}

export default SubscriptionCheck 