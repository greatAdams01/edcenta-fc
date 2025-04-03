"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useQuery, useMutation, gql } from "@apollo/client"
import { UserIcon } from "@heroicons/react/24/outline"
import { ToastContainer, toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import AppLayout from "../../../layout/AppLayout"
import { USER } from "@/apollo/queries/dashboard"
import { MUTATE_USER } from "@/apollo/mutations/dashboard"
import Password from "@/components/ui/password"

interface Bank {
  active: boolean
  slug: string
  code: string
}

const VERIFY_BANK_ACCOUNT = gql`
  mutation VerifyBankAccount($accountNumber: String, $code: String) {
    verifyBankAccount(account_number: $accountNumber, code: $code) {
      account_name
      account_number
    }
  }
`

const GET_BANKS = gql`
  query GetBanks {
    getBanks {
      active
      slug
      code
    }
  }
`

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

  const { data: banksData, loading: banksLoading } = useQuery(GET_BANKS)
  const [verifyBankAccount, { loading: verifyingBank }] = useMutation(VERIFY_BANK_ACCOUNT)
  const [banks, setBanks] = useState<Bank[]>([])
  const [bankCode, setBankCode] = useState("")
  const [verifiedAccountName, setVerifiedAccountName] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

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

  useEffect(() => {
    if (banksData && banksData.getBanks) {
      setBanks(banksData.getBanks.filter((bank: Bank) => bank.active))
    }
  }, [banksData])

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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error("Error updating profile: " + errorMessage)
    }
  }

  const handleVerifyAccount = async () => {
    if (!accountNumber || !bankCode) {
      toast.error("Please enter account number and select a bank")
      return
    }

    setIsVerifying(true)
    try {
      const { data } = await verifyBankAccount({
        variables: {
          accountNumber,
          code: bankCode,
        },
      })

      if (data && data.verifyBankAccount) {
        setVerifiedAccountName(data.verifyBankAccount.account_name)
        setBName(data.verifyBankAccount.account_name)
        toast.success("Account verified successfully")
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error("Failed to verify account: " + errorMessage)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="w-full justify-self-center rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="mb-6 flex w-full items-center justify-between gap-x-3 bg-purple-100 p-4 rounded-t-lg">
            <div className="flex w-full items-center justify-start gap-x-3">
              <UserIcon className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">My Details</h1>
            </div>
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="w-full flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">Update your personal information and account details</p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={ifClicked}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      Change Password
                    </button>
                  </div>
                  <div className="block w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 shadow-sm">
                    ••••••••
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="accountType"
                    value={accountType}
                    readOnly
                    title="Account type cannot be changed"
                    className="block w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 shadow-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900">Banking Information</h2>
                <p className="mt-1 text-sm text-gray-600">Update your banking details for payments and transactions</p>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="bName" className="block text-sm font-medium text-gray-700">
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bName"
                      value={bName || verifiedAccountName}
                      onChange={(e) => setBName(e.target.value)}
                      readOnly={!!verifiedAccountName}
                      className={`block w-full rounded-md border border-gray-300 ${verifiedAccountName ? "bg-gray-100" : "bg-white"} px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${verifiedAccountName ? "cursor-not-allowed" : ""}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="bankName"
                      value={bankCode}
                      onChange={(e) => {
                        setBankCode(e.target.value)
                        const selectedBank = banks.find((bank: Bank) => bank.code === e.target.value)
                        setBankName(selectedBank ? selectedBank.slug : "")
                      }}
                      className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="">Select a bank</option>
                      {banks.map((bank: Bank) => (
                        <option key={bank.code} value={bank.code}>
                          {bank.slug}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="block w-full rounded-l-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyAccount}
                        disabled={isVerifying || !accountNumber || !bankCode}
                        className="inline-flex items-center justify-center rounded-r-md bg-purple-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-300"
                      >
                        {isVerifying ? "Verifying..." : "Verify"}
                      </button>
                    </div>
                    {verifiedAccountName && (
                      <p className="mt-1 text-sm text-green-600">Verified: {verifiedAccountName}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                      Occupation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {change && (
                <div className="mt-8 border-t border-gray-200 pt-6">
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
        theme="light"
      />
    </AppLayout>
  )
}

export default Index

