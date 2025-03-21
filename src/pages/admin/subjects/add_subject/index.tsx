import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { IoIosArrowBack } from 'react-icons/io'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AdminLayout from '@/layout/AdminLayout'

import { CREATE_SUBJECT } from '@/apollo/mutations/admin'

export default function Create() {
  const path = useRouter()
  const [subjectName, setSubjectName] = useState('')
  const [subjectDescription, setSubjectDescription] = useState('')

  const [createSubject, { loading }] = useMutation(CREATE_SUBJECT, {
    variables: {
      name: subjectName,
      description: subjectDescription,
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Subject created successfully.')
      setTimeout(() => {
        path.push('/admin/subjects')
      }, 5000)
    },
    onError: (error) => {
      toast.error('Error creating subject: ' + error)
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (subjectName === '') {
      console.log('Subject name field cannot be empty')
      toast.error('Subject name field cannot be empty')
      return
    }

    if (subjectDescription === '') {
      console.log('Description field cannot be empty')
      toast.error('Description field cannot be empty')
      return
    }

    createSubject()
  }

  return (
    <AdminLayout>
      <div className="grid justify-items-stretch">
        <button
          onClick={() => path.back()}
          className="mb-6 flex items-center gap-1 text-left text-black"
        >
          <IoIosArrowBack /> <div>Back</div>
        </button>
        <div className="flex w-full justify-self-center rounded-md border-2 p-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full ">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-bold">Add Subject</h1>
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
                    Subject name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target?.value)}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="Last name" className="w-full">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subjectDescription}
                    onChange={(e) => setSubjectDescription(e.target?.value)}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
