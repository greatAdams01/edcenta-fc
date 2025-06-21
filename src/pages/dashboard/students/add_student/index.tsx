import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AppLayout from '@/layout/AppLayout'

import { USER, STUDENTS, FETCH_SCHOOL_GRADES } from '@/apollo/queries/dashboard'

import { CREATE_STUDENT } from '@/apollo/mutations/dashboard'

export default function Create() {
  const { data } = useQuery(USER)
  const User = data?.USER || []

  const path = useRouter()

  const [name, setName] = useState('')
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState('')
  const [grade, setGrade] = useState('')
  const [creatorId, setCreatorId] = useState('')

  const { data: gradesData, loading: gradesLoading } = useQuery(FETCH_SCHOOL_GRADES, {
    variables: { page: 1, limit: 100 },
  });

  useEffect(() => {
    if (data && data.user) {
      setCreatorId(data.user._id || '')
    }
  }, [data])

  const [createStudent, { loading }] = useMutation(CREATE_STUDENT, {
    variables: {
      input: {
        name,
        username,
        email,
        password,
        age: parseInt(age),
        grade,
        creatorId,
      },
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Student created successfully.')
      setTimeout(() => {
        path.push('/dashboard/students')
      }, 5000)
    },
    onError: (error) => {
      toast.error(
        error.message
        // 'Error creating student: this email might already been used by another student',
      )
      console.log(error)
    },
    refetchQueries: [{ query: STUDENTS }],
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (name === '') {
      console.log('Student name field cannot empty')
      toast.error('Student name field cannot empty')
      return
    }
    if (username.trim() === '') {
      console.log('UserName field cannot be empty')
      toast.error('UserName field cannot be empty')
      return
    }
    if (username.includes(' ')) {
      console.log('Username cannot contain spaces')
      toast.error('Username cannot contain spaces')
      return
    }
    if (email === '') {
      console.log('Enter a valid email address')
      toast.error('Enter a valid email address')
      return
    }
    if (password === '') {
      console.log('Password field cannot be empty')
      toast.error('Password field cannot be empty')
      return
    }

    if (age === '') {
      console.log('Identify an Age')
      toast.error('Identify an Age')
      return
    }

    if (!grade) {
      console.log('Please add grade')
      toast.error('Please add grade')
      return
    }
    createStudent()
    console.log(creatorId)
  }

  return (
    <AppLayout>
      <div className="flex justify-center px-2 py-6 sm:px-4">
        <div className="w-full max-w-screen-md rounded-md border-2 p-4 sm:p-6 lg:p-8 bg-white">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-lg font-bold">Add Student</h1>
              <button
                type="submit"
                className="rounded-md bg-blue-500 p-2 px-4 font-bold text-white w-full sm:w-auto"
              >
                Create
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <div className="flex flex-col items-start gap-y-1">
                <label htmlFor="First name" className="w-full">
                  Student name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target?.value)}
                  className="my-2 h-12 w-full rounded-md border-2 px-4"
                />
              </div>
              <div className="flex flex-col items-start gap-y-1">
                <label htmlFor="Last name" className="w-full">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target?.value)}
                  className="my-2 h-12 w-full rounded-md border-2 px-4"
                />
              </div>
              <div className="flex flex-col items-start gap-y-1">
                <label htmlFor="Last name" className="w-full">
                  Guardian Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target?.value)}
                  className="my-2 h-12 w-full rounded-md border-2 px-4"
                />
              </div>
              <div className="flex flex-col items-start gap-y-1">
                <label htmlFor="Last name" className="w-full">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target?.value)}
                  className="my-2 h-12 w-full rounded-md border-2 px-4"
                />
              </div>
              <div className="flex flex-col items-start gap-y-1">
                <label htmlFor="Last name" className="w-full">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target?.value)}
                  className="my-2 h-12 w-full rounded-md border-2 px-4"
                />
              </div>
              <div className="flex flex-col items-start gap-y-1">
                <label htmlFor="Last name" className="w-full">
                  Year <span className="text-red-500">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="my-2 h-12 w-full rounded-md border-2 px-4"
                  disabled={gradesLoading}
                >
                  <option value="">{gradesLoading ? 'Loading...' : 'Select class'}</option>
                  {gradesData?.schoolGrades?.data?.map((g: any) => (
                    <option key={g._id} value={g._id}>{g.year}</option>
                  ))}
                </select>
              </div>
              <div className="hidden flex-col items-start gap-y-1">
                <label htmlFor="Last name" className="w-full">
                  Creator's ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={creatorId}
                  onChange={(e) => setCreatorId(e.target?.value)}
                  className="my-2 h-12 w-full rounded-md border-2 px-4"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </AppLayout>
  )
}
