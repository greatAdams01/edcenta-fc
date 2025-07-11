"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useQuery, useMutation, gql } from "@apollo/client"
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  ArrowLeftIcon,
  BanknotesIcon,
  BriefcaseIcon,
  UserCircleIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline"
import { ToastContainer, toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion, AnimatePresence } from "framer-motion"

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
  const { data, loading } = useQuery(USER)
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
  const [isVerifying, setIsVerifying] = useState(false)
  const [isAccountVerifying, setIsAccountVerifying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { data: banksData, loading: banksLoading } = useQuery(GET_BANKS)
  const [verifyBankAccount, { loading: verifyingBank }] = useMutation(VERIFY_BANK_ACCOUNT)
  const [banks, setBanks] = useState<Bank[]>([])
  const [bankCode, setBankCode] = useState("")
  const [verifiedAccountName, setVerifiedAccountName] = useState("")

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
    setIsSubmitting(true)

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
      toast.success("Profile updated successfully! 🎉")
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error("Error updating profile: " + errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAccountNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAccountNumber = e.target.value;
    setAccountNumber(newAccountNumber);
    
    if (newAccountNumber && bankCode && newAccountNumber.length >= 10) {
      setIsAccountVerifying(true);
      try {
        const { data } = await verifyBankAccount({
          variables: {
            accountNumber: newAccountNumber,
            code: bankCode,
          },
        });

        if (data && data.verifyBankAccount) {
          setVerifiedAccountName(data.verifyBankAccount.account_name);
          setBName(data.verifyBankAccount.account_name);
          toast.success("Account verified successfully! ✅")
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        toast.error("Failed to verify account: " + errorMessage);
        setVerifiedAccountName("");
        setBName("");
      } finally {
        setIsAccountVerifying(false);
      }
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBank = banks.find(bank => bank.code === e.target.value);
    setBankCode(e.target.value);
    setBankName(selectedBank?.slug || "");
    
    if (accountNumber && accountNumber.length >= 10) {
      handleAccountNumberChange({ target: { value: accountNumber } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    type = "text", 
    required = false, 
    readOnly = false, 
    icon: Icon,
    placeholder = "",
    maxLength,
    className = ""
  }: {
    label: string
    value: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
    required?: boolean
    readOnly?: boolean
    icon?: any
    placeholder?: string
    maxLength?: number
    className?: string
  }) => (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 ${
            Icon ? 'pl-10' : ''
          } ${
            readOnly 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
              : 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-gray-400'
          }`}
        />
      </div>
    </div>
  );

  const SelectField = ({ 
    label, 
    value, 
    onChange, 
    options, 
    required = false, 
    loading = false,
    icon: Icon
  }: {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: { value: string; label: string }[]
    required?: boolean
    loading?: boolean
    icon?: any
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <select
          value={value}
          onChange={onChange}
          disabled={loading}
          className={`block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 ${
            Icon ? 'pl-10' : ''
          } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-gray-400 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <option value="">{loading ? 'Loading banks...' : 'Select a bank'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const FormSection = ({ 
    title, 
    description, 
    icon: Icon, 
    children, 
    className = "" 
  }: {
    title: string
    description: string
    icon: any
    children: React.ReactNode
    className?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profile Details</h1>
              <p className="text-indigo-100">
                Manage your personal information, banking details, and account settings
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back
              </motion.button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <FormSection
            title="Personal Information"
            description="Update your basic personal details and contact information"
            icon={UserIcon}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                icon={UserCircleIcon}
                placeholder="Enter your first name"
              />
              <InputField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                icon={UserCircleIcon}
                placeholder="Enter your last name"
              />
              <InputField
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                icon={EnvelopeIcon}
                placeholder="Enter your email address"
              />
              <InputField
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                required
                icon={PhoneIcon}
                placeholder="Enter your phone number"
              />
              <InputField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                icon={MapPinIcon}
                placeholder="Enter your address"
              />
              <InputField
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                icon={BuildingOfficeIcon}
                placeholder="Enter your city"
              />
            </div>
          </FormSection>

          {/* Account Information */}
          <FormSection
            title="Account Information"
            description="Your account type and security settings"
            icon={ShieldCheckIcon}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Account Type"
                value={accountType}
                readOnly
                icon={UserIcon}
                className="md:col-span-2"
              />
              
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <motion.button
                    type="button"
                    onClick={ifClicked}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Change Password
                  </motion.button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pl-10 text-gray-500 shadow-sm">
                    ••••••••••••••••
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {change && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <Password />
                </motion.div>
              )}
            </AnimatePresence>
          </FormSection>

          {/* Banking Information */}
          <FormSection
            title="Banking Information"
            description="Update your banking details for payments and transactions"
            icon={BanknotesIcon}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Bank Name"
                value={bankCode}
                onChange={handleBankChange}
                options={banks.map(bank => ({ value: bank.code, label: bank.slug }))}
                required
                loading={banksLoading}
                icon={BuildingOfficeIcon}
              />
              
              <InputField
                label="Account Number"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                required
                maxLength={10}
                icon={CreditCardIcon}
                placeholder="Enter 10-digit account number"
              />
              
              <InputField
                label="Account Name"
                value={bName || verifiedAccountName}
                readOnly
                icon={UserIcon}
                className="md:col-span-2"
              />
              
              {isAccountVerifying && (
                <div className="md:col-span-2 flex items-center space-x-2 text-indigo-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span className="text-sm">Verifying account...</span>
                </div>
              )}
              
              {verifiedAccountName && (
                <div className="md:col-span-2 flex items-center space-x-2 text-green-600">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Account verified successfully!</span>
                </div>
              )}
            </div>
          </FormSection>

          {/* Occupation */}
          <FormSection
            title="Professional Information"
            description="Update your occupation and professional details"
            icon={BriefcaseIcon}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                required
                icon={BriefcaseIcon}
                placeholder="Enter your occupation"
              />
            </div>
          </FormSection>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
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

