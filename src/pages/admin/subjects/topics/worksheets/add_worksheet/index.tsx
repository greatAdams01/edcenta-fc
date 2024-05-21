import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { IoIosArrowBack } from 'react-icons/io'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AdminLayout from '@/layout/AdminLayout'

import { CREATE_WORKSHEET } from '@/apollo/mutations/admin'
import { FETCH_LEARNING } from '@/apollo/queries/dashboard'

export default function Create() {
  const path = useRouter()

  const [title, setTitle] = useState('')
  const [bodyText, setBodyText] = useState('')
  const [img, setImg] = useState('')
  const [topicSchoolGrade, setTopicSchoolGrade] = useState('')
  const [difficulty, setDifficulty] = useState('')
  let subjectId: string | null = null
  let topicId: string | null = null
  if (typeof window !== 'undefined') {
    subjectId = localStorage.getItem('subjectId')
    topicId = localStorage.getItem('topicId')
  }

  const { data } = useQuery(FETCH_LEARNING)

  const [createWorksheet, { loading }] = useMutation(CREATE_WORKSHEET, {
    variables: {
      title: title,
      body: {
        text: bodyText,
        img: img,
      },
      levelId: topicSchoolGrade,
      topicId: topicId,
      subjectId: subjectId,
      difficulty: difficulty,
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Topic created successfully.')
      setTimeout(() => {
        if (subjectId) {
          path.push(`/admin/subjects/topics/worksheets/${topicId}`)
        } else {
          // Handle the case where subjectId is null or undefined
        }
      }, 5000)
    },
    onError: (error) => {
      toast.error('Error creating subject: ' + error)
    },
  })
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    const reader = new FileReader()

    reader.onloadend = () => {
      setImg(reader.result?.toString() || '')
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (title === '') {
      console.log('Title field cannot be empty')
      toast.error('Title field cannot be empty')
      return
    }

    if (bodyText === '') {
      console.log('Body Text field cannot be empty')
      toast.error('Body Text field cannot be empty')
      return
    }

    if (topicSchoolGrade === '') {
      console.log('School grade field cannot be empty')
      toast.error('School grade field cannot be empty')
      return
    }
    if (img === '') {
      console.log('Img link field cannot be empty')
      toast.error('Img link field cannot be empty')
      return
    }
    if (difficulty === '') {
      console.log('Difficulty field cannot be empty')
      toast.error('Difficulty field cannot be empty')
      return
    }

    createWorksheet()
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
                <h1 className="text-lg font-bold">Add Worksheet</h1>
                <button
                  type="submit"
                  className={`rounded-md bg-blue-500 p-2 px-4 font-bold text-white`}
                >
                  Create
                </button>
              </div>

              <div className="mt-6 items-start justify-between md:grid md:grid-cols-2 md:gap-6">
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="title" className="w-full">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target?.value)}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>

                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="img" className="w-full">
                    Description image <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="img"
                    type="file"
                    onChange={handleFileChange}
                    className="my-2  w-[100%] max-w-[400px] px-4 lg:w-[100rem]"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="description" className="w-full">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target?.value)}
                    className="h-40 w-full max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="Last name" className="w-full">
                    School Grades <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={topicSchoolGrade}
                    onChange={(e) => {
                      setTopicSchoolGrade(e.target.value)
                    }}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  >
                    <option value="">Select grade</option>
                    {data &&
                      data.fetchLearning.map((stage: any) => (
                        <option key={stage._id} value={stage._id}>
                          {stage.year}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-y-1">
                  <label htmlFor="difficulty" className="w-full">
                    Select difficulty <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => {
                      setDifficulty(e.target.value)
                    }}
                    className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  >
                    <option value="">Select difficulty</option>
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
