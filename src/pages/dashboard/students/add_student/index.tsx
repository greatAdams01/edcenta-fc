import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  UserIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

import AppLayout from '@/layout/AppLayout'
import { USER, STUDENTS, FETCH_SCHOOL_GRADES } from '@/apollo/queries/dashboard'
import { CREATE_STUDENT } from '@/apollo/mutations/dashboard'

export default function CreateStudent() {
  const router = useRouter()
  const { data: userData } = useQuery(USER)
  const user = userData?.user || {}

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    grade: '',
    creatorId: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: gradesData, loading: gradesLoading } = useQuery(FETCH_SCHOOL_GRADES, {
    variables: { page: 1, limit: 100 },
  })

  useEffect(() => {
    if (userData && userData.user) {
      setFormData(prev => ({ ...prev, creatorId: userData.user._id || '' }))
    }
  }, [userData])

  const [createStudent, { loading }] = useMutation(CREATE_STUDENT, {
    onCompleted: (data) => {
      console.log(data)
      toast.success('Student created successfully!')
      setIsSubmitting(false)
      setTimeout(() => {
        router.push('/dashboard/students')
      }, 2000)
    },
    onError: (error) => {
      toast.error(error.message.replace(/'/g, "&apos;"))
      setIsSubmitting(false)
      console.log(error)
    },
    refetchQueries: [{ query: STUDENTS }],
  })

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Student name is required'
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters'
      }

      if (!formData.username.trim()) {
        newErrors.username = 'Username is required'
      } else if (formData.username.includes(' ')) {
        newErrors.username = 'Username cannot contain spaces'
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters'
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      if (!formData.age) {
        newErrors.age = 'Age is required'
      } else if (parseInt(formData.age) < 3 || parseInt(formData.age) > 25) {
        newErrors.age = 'Age must be between 3 and 25'
      }

      if (!formData.grade) {
        newErrors.grade = 'Please select a grade'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }

    setIsSubmitting(true)
    
    createStudent({
      variables: {
        input: {
          name: formData.name.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          age: parseInt(formData.age),
          grade: formData.grade,
          creatorId: formData.creatorId,
        },
      },
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const steps = [
    { id: 1, title: 'Basic Information', icon: UserIcon },
    { id: 2, title: 'Account Details', icon: LockClosedIcon },
    { id: 3, title: 'Review & Create', icon: CheckCircleIcon }
  ]

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )

  const InputField = ({ 
    label, 
    type = "text", 
    field, 
    icon: Icon, 
    placeholder, 
    required = false 
  }: {
    label: string
    type?: string
    field: string
    icon: any
    placeholder: string
    required?: boolean
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          value={formData[field as keyof typeof formData]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors[field] ? 'border-red-300' : 'border-gray-300'
          }`}
        />
      </div>
      {errors[field] && (
        <p className="text-sm text-red-600">{errors[field]}</p>
      )}
    </div>
  )

  const SelectField = ({ 
    label, 
    field, 
    icon: Icon, 
    options, 
    loading = false, 
    required = false 
  }: {
    label: string
    field: string
    icon: any
    options: any[]
    loading?: boolean
    required?: boolean
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <select
          value={formData[field as keyof typeof formData]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={loading}
          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors[field] ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">{loading ? 'Loading...' : `Select ${label.toLowerCase()}`}</option>
          {options.map((option) => (
            <option key={option._id} value={option._id}>
              {option.year || option.name}
            </option>
          ))}
        </select>
      </div>
      {errors[field] && (
        <p className="text-sm text-red-600">{errors[field]}</p>
      )}
    </div>
  )

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
                <p className="text-sm text-gray-600">Create a new student account</p>
              </div>
            </div>
          </div>

          <StepIndicator />

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                  <p className="text-sm text-gray-600 mb-6">Enter the student's basic details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Student Name"
                    field="name"
                    icon={UserIcon}
                    placeholder="Enter student's full name"
                    required
                  />
                  <InputField
                    label="Username"
                    field="username"
                    icon={UserIcon}
                    placeholder="Choose a unique username"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <InputField
                    label="Guardian Email"
                    type="email"
                    field="email"
                    icon={EnvelopeIcon}
                    placeholder="Enter guardian's email address"
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Account Details */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h2>
                  <p className="text-sm text-gray-600 mb-6">Set up the student's account credentials</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Password"
                    type="password"
                    field="password"
                    icon={LockClosedIcon}
                    placeholder="Create a secure password"
                    required
                  />
                  <InputField
                    label="Confirm Password"
                    type="password"
                    field="confirmPassword"
                    icon={LockClosedIcon}
                    placeholder="Confirm the password"
                    required
                  />
                  <InputField
                    label="Age"
                    type="number"
                    field="age"
                    icon={CalendarIcon}
                    placeholder="Enter student's age"
                    required
                  />
                  <SelectField
                    label="Grade/Class"
                    field="grade"
                    icon={AcademicCapIcon}
                    options={gradesData?.schoolGrades?.data || []}
                    loading={gradesLoading}
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Information</h2>
                  <p className="text-sm text-gray-600 mb-6">Please review the information before creating the student account</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Student Name</label>
                      <p className="text-gray-900">{formData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Username</label>
                      <p className="text-gray-900">@{formData.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Guardian Email</label>
                      <p className="text-gray-900">{formData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Age</label>
                      <p className="text-gray-900">{formData.age} years old</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Grade</label>
                      <p className="text-gray-900">
                        {gradesData?.schoolGrades?.data?.find((g: any) => g._id === formData.grade)?.year || 'Not selected'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Student
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
      <ToastContainer position="top-right" />
    </AppLayout>
  )
}
