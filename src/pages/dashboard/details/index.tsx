"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { UserIcon } from "@heroicons/react/24/outline"
import { ToastContainer, toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import AppLayout from "../../../layout/AppLayout"
import { USER } from "@/apollo/queries/dashboard"
import { MUTATE_USER } from "@/apollo/mutations/dashboard"
import Password from "@/components/ui/password"

function Index() {
  const { data } = useQuery(USER)
  const [updateUserInfo] = useMutation(MUTATE_USER)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [accountType, setAccountType] = useState("")
  const [bName, setBName] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [occupation, setOccupation] = useState("")
  const [change, isClicked] = useState<boolean>(false)

  useEffect(() => {
    if (data && data.user) {
      setFirstName(data.user.firstName || "")
      setLastName(data.user.lastName || "")
      setEmail(data.user.email || "")
      setPhone(data.user.phone || "")
      setAddress(data.user.address || "")
      setCity(data.user.city || "")
      setAccountType(data.user.accountType || "")
      setBName(data.user.bName || "")
      setBankName(data.user.bankName || "")
      setAccountNumber(data.user.acctNumber || "")
      setOccupation(data.user.occupation || "")
    }
  }, [data])

  const ifClicked = () => {
    isClicked(!change)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await updateUserInfo({
        variables: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          accountType,
          bName,
          bankName,
          accountNumber,
          occupation,
        },
      })
      toast.success("Profile updated successfully.")
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (error) {
      toast.error("Error updating profile: " + error)
    }
  }

  return (
    <AppLayout>
      <div className="grid justify-items-stretch transition-colors duration-200">
        <div className="w-full justify-self-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
          <div className="mb-6 flex w-full items-center justify-between gap-x-3 bg-purple-100 p-4 dark:bg-purple-900/20 rounded-t-lg transition-colors duration-200">
            <div className="flex w-full items-center justify-start gap-x-3">
              <UserIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                My Details
              </h1>
            </div>
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="w-full flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  Update your personal information and account details
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400 transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400 transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400 transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={ifClicked}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
                    >
                      Change Password
                    </button>
                  </div>
                  <div className="block w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 transition-colors duration-200">
                    ••••••••
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400 transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400 transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400 transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="accountType"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="accountType"
                    value={accountType}
                    readOnly
                    title="Account type cannot be changed"
                    className="block w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 shadow-sm cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700 transition-colors duration-200">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200">
                  Banking Information
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  Update your banking details for payments and transactions
                </p>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label
                      htmlFor="bName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bName"
                      value={bName}
                      onChange={(e) => setBName(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400 transition-colors duration-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="bankName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400 transition-colors duration-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400 transition-colors duration-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="occupation"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Occupation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              {change && (
                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700 transition-colors duration-200">
                  <Password />
                </div>
              )}
            </form>
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
    </AppLayout>
  )
}

export default Index

