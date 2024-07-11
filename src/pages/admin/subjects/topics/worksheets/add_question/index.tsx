import { CREATE_QUESTION, EDIT_QUESTION } from '@/apollo/mutations/admin'
import { GET_QUESTION } from '@/apollo/queries/admin'
import AdminLayout from '@/layout/AdminLayout'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddQuestion = () => {
  const path = useRouter()
  const uploadRef = useRef<HTMLInputElement>(null)
  const page = useSearchParams()?.get('worksheet')
  const question = useSearchParams()?.get('question')
  // console.log(question, page)

  const [img, setImg] = useState('')
  const [title, setTitle] = useState('')
  const [isObjective, setIsObjective] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [description, setDescription] = useState('')
  const [worksheetId, setWorksheetId] = useState('')
  let option = {
    option: '',
    isCorrect: false,
  }
  const [getQuestion] = useLazyQuery(GET_QUESTION, {
    variables: { id: question },
    onCompleted: (data) => {
      console.log('Data:', data)
      const selectedValuesArray = data.question.options.map(
        ({ option, isCorrect }: any) => ({ option, isCorrect }),
      )
      setOptions(selectedValuesArray)
      setWorksheetId(data.question.worksheetId)
      setIsObjective(data.question.isObjective)
      setTitle(data.question.title)
      setExplanation(data.question.explanation)
      setDescription(data.question.body[0].text)
      setImg(data.question.body[0].img)
      // setWorksheets(data.worksheets.data)
    },
    onError: (error) => {
      console.log('Error:', error)
    },
  })
  const [options, setOptions] = useState([option])

  const [createQuestion, { loading }] = useMutation(CREATE_QUESTION, {
    variables: {
      title,
      isObjective,
      options,
      explanation,
      body: {
        img,
        text: description,
      },
      worksheetId: page,
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Question created successfully.')
      setTimeout(() => {
        path.push(`/admin/subjects/topics/worksheets/worksheet/${page}`)
      }, 5000)
    },
    onError: (error) => {
      toast.error('Error creating Question: ' + error)
    },
  })

  const [editQuestion] = useMutation(EDIT_QUESTION, {
    variables: {
      id: question,
      input: {
        title: title,
        isObjective,
        options,
        explanation,
        body: {
          img,
          text: description,
        },
        worksheetId,
      },
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Question edited successfully.')
      setTimeout(() => {
        path.push(`/admin/subjects/topics/worksheets/worksheet/${worksheetId}`)
      }, 5000)
    },
    onError: (error) => {
      toast.error('Error editing question: ' + error)
    },
  })

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (title === '') {
      console.log('Title field cannot be empty')
      toast.error('Title field cannot be empty')
      return
    }
    if (explanation === '') {
      console.log('Explanation field cannot be empty')
      toast.error('Explanation field cannot be empty')
      return
    }
    if (description === '') {
      console.log('Description field cannot be empty')
      toast.error('Description field cannot be empty')
      return
    }
    if (img === '') {
      console.log('Description Image field cannot be empty')
      toast.error('Description Image field cannot be empty')
      return
    }
    // Check if any body item is empty
    if (isObjective) {
      for (let item of options) {
        if (item.option.trim() === '') {
          console.log('Option item cannot be empty')
          toast.error('Option item cannot be empty')
          return
        }
      }
      if (options.length !== 4) {
        toast.error('Option cannot be less than or greater than 4')
        return
      }
      const hasActive = options.some((item) => item.isCorrect === true)

      if (!hasActive) {
        toast.error('An option should have a correct value')
        return
      }
    }

    if (page === null) {
      editQuestion()
      return
    }
    createQuestion()
  }

  const handleBodyItemChange = (
    index: number,
    field: string,
    value: string | Boolean,
  ) => {
    setOptions(
      options.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    )
  }

  const setActiveIndex = (index: number) => {
    // Use map to create a new array with the updated active property
    const updatedItems = options.map((item, i) => ({
      ...item,
      isCorrect: i === index,
    }))

    // Update the state with the new array
    setOptions(updatedItems)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] // Add null check for e.target.files

    const reader = new FileReader()

    reader.onloadend = () => {
      setImg(reader.result?.toString() || '')
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (question !== null) {
      getQuestion()
    }
  }, [question])
  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between">
          <button
            onClick={() => path.back()}
            className="mb-6 flex items-center gap-1 text-left text-black"
          >
            <IoIosArrowBack /> <div>Back</div>
          </button>
          <button
            onClick={(e) => handleSubmit(e)}
            className="rounded-md bg-indigo-600 p-3 text-white"
          >
            {page !== null ? (loading ? 'loading...' : 'Create') : 'Update'}
          </button>
        </div>
        <div className="flex justify-between">
          <div className="flex w-full flex-col items-start gap-y-1">
            <label htmlFor="title">
              Title <span className="text-red-500">*</span>{' '}
            </label>
            <input
              value={title}
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
            />
          </div>
          <div className="flex w-full flex-col items-start  gap-y-1">
            <label htmlFor="">
              Objective? <span className="text-red-500">*</span>
            </label>
            <div>
              {/* <span>{isObjective ? 'Active' : 'Inactive'}</span> */}
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isObjective}
                  onChange={(e) => setIsObjective(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            {/* <input id='title' onChange={e => setIsObjective(e.target.checked)} type="checkbox" className="" /> */}
          </div>
        </div>
        <div>
          <label htmlFor="explanation">
            Explanation <span className="text-red-500">*</span>{' '}
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="my-2 h-32 w-[100%]  rounded-md border-2 px-4"
            id="explanation"
          ></textarea>
        </div>
        <div className="flex justify-between">
          <div className="flex w-full flex-col items-start gap-y-1">
            <label htmlFor="body">
              Description <span className="text-red-500">*</span>{' '}
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="body"
              type="text"
              className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
            />
          </div>

          <div className="flex w-full flex-col items-start gap-y-1">
            <label htmlFor={`img`} className="w-full">
              Description image <span className="text-red-500">*</span>
            </label>
            {img === '' ? (
              <input
                value={'Upload Image'}
                className="my-2 cursor-pointer rounded-md bg-blue-500 p-1 px-6 text-xs text-white"
                type="button"
                onClick={() => uploadRef.current?.click()}
              />
            ) : (
              <img
                src={img}
                onClick={() => uploadRef.current?.click()}
                className="w-44 "
                alt=""
              />
            )}
            <input
              id={`img`}
              type="file"
              onChange={(e) => handleFileChange(e)}
              ref={uploadRef}
              className="my-2 hidden w-[100%] max-w-[400px] lg:w-[100rem]"
            />
          </div>
        </div>
        {isObjective ? (
          <>
            <p className="my-4">
              Options <span className="text-red-500">*</span>
            </p>
            <div>
              {options.map((option, index) => (
                <div key={index} className="flex">
                  <div className="flex w-full flex-col items-start gap-y-1">
                    <label className="text-sm" htmlFor="">
                      Option {index + 1}
                    </label>
                    <input
                      onChange={(e) =>
                        handleBodyItemChange(index, 'option', e.target.value)
                      }
                      value={option.option}
                      className="my-2 h-12 w-full rounded-md border-2 px-4 "
                      type="text"
                    />
                  </div>
                  <div className="my-auto">
                    <button
                      onClick={() => setActiveIndex(index)}
                      className={
                        option.isCorrect
                          ? 'my-auto ml-20 h-16 rounded-md bg-green-500 p-3 text-white'
                          : 'my-auto ml-20 h-16 cursor-pointer rounded-md p-3 hover:bg-gray-300'
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {options.length === 4 ? null : (
              <button
                onClick={() => setOptions([...options, option])}
                className="rounded-md bg-indigo-600 p-3 text-white"
              >
                Add
              </button>
            )}
          </>
        ) : null}
      </div>
    </AdminLayout>
  )
}

export default AddQuestion
