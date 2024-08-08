import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AppLayout from '@/layout/AppLayout'

import { USER } from '@/apollo/queries/dashboard'

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
        'Error creating student: this email might already been used by another student',
      )
      console.log(error)
    },
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
      <div className="grid justify-items-stretch">
        <div className="flex w-full justify-self-center rounded-md border-2 p-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full ">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-bold">Add Student</h1>
                <button
                  type="submit"
                  className={`rounded-md bg-blue-500 p-2 px-4 font-bold text-white`}
                >
                  Create
                </button>
              </div>

              <div className="mt-6 justify-between md:grid md:grid-cols-2 md:gap-6">
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="First name" className="w-full">
                    Student name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target?.value)}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="Last name" className="w-full">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target?.value)}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="Last name" className="w-full">
                    Guardian Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target?.value)}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="Last name" className="w-full">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target?.value)}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="Last name" className="w-full">
                    {' '}
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target?.value)}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="Last name" className="w-full">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  >
                    <option value={''}>Select class</option>
                    <option value={'65ee6115df691bf5cea750a6'}>
                      Primary 1
                    </option>
                  </select>
                </div>
                <div className="hidden w-full items-center justify-between">
                  <label htmlFor="Last name" className="w-full">
                    Creator&quot;s ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={creatorId}
                    onChange={(e) => setCreatorId(e.target?.value)}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </AppLayout>
  )
}
