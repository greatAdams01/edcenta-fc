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

  const [checkBox, setCheckBox] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creatorId, setCreatorId] = useState('')

  useEffect(() => {
    if (data && data.user) {
      setCreatorId(data.user._id || '')
    }
  }, [data])

  const [createStudent, { loading }] = useMutation(CREATE_STUDENT, {
    variables: {
      input: {
        checkBox,
        name,
        description,
        creatorId,
      },
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Student created successfully.')
      setTimeout(() => {
        path.push('/dashboard/group')
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
      console.log('Group name field cannot empty')
      toast.error('Group name field cannot empty')
      return
    }

    createStudent()
  }

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="flex w-full justify-self-center rounded-md border-2 p-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full ">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-bold">Add Group</h1>
                <button
                  type="submit"
                  className={`rounded-md bg-blue-500 p-2 px-4 font-bold text-white`}
                >
                  Create
                </button>
              </div>
              <div className="mt-6 w-full items-center gap-6 md:grid md:w-4/6">
                <div className="my-2 flex pr-6">
                  <label htmlFor="status" className="flex w-full">
                    Status
                  </label>
                  <label className="switch">
                    <input type="checkbox" value={checkBox} />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="justofy-between my-2 flex w-full">
                  <label htmlFor="name" className="flex w-full md:w-[10rem]">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target?.value)}
                    className="mx-4 my-2 h-12 w-full rounded-md border-2 px-4"
                  />
                </div>

                <div className="justofy-between  my-2 flex w-full">
                  <label
                    htmlFor="description"
                    className="flex w-full md:w-[10rem]"
                  >
                    Desciption
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target?.value)}
                    className="mx-4 my-2 h-40 w-full rounded-md border-2 px-4"
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
