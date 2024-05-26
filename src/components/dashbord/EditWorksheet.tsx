import React, { useEffect, useState } from 'react'
import { IWorksheet } from '../../../types'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_TOPIC, UPDATE_WORKSHEET } from '@/apollo/mutations/admin'
import { showToast } from '@/utils/toast'
import { FETCH_LEARNING } from '@/apollo/queries/dashboard'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface EditWorksheetProps {
  worksheet: IWorksheet
  // onSave: (updatedUser: IUser) => void;
}

const EditWorksheet: React.FC<EditWorksheetProps> = ({ worksheet }) => {
  const [editedWorksheet, setEditedWorksheet] = useState<IWorksheet>(worksheet)
  const [topicSchoolGrade, setTopicSchoolGrade] = useState('')
  const [bodyItems, setBodyItems] = useState([{ text: '', img: '' }])
  let subjectId: string | null = null
  let topicId: string | null = null
  if (typeof window !== 'undefined') {
    subjectId = localStorage.getItem('subjectId')
    topicId = localStorage.getItem('topicId')
  }
  const { data } = useQuery(FETCH_LEARNING)
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target

    if (name === 'bodyText') {
      setEditedWorksheet((prevState: IWorksheet) => ({
        ...prevState,
        body: prevState.body.map((bodyItem) => ({
          ...bodyItem,
          text: value,
        })),
      }))
    } else {
      setEditedWorksheet((prevState: IWorksheet) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const [editWorksheetInfo, { loading }] = useMutation(UPDATE_WORKSHEET, {
    variables: {
      id: editedWorksheet._id,
      input: {
        title: editedWorksheet.title,
        difficulty: editedWorksheet.difficulty,
        body: editedWorksheet.body,
        levelId: topicSchoolGrade,
        topicId: topicId,
        subjectId: subjectId,
      },
    },
    onCompleted: (data) => {
      console.log(data)
      showToast('success', 'Worksheet Updated')
      // reload the page
    },
    onError: (error) => {
      showToast('error', error.message)
      console.log(error)
      // setLoading(false);
    },
  })
  const handleSave = () => {
    // Remove __typename field from each body item
    const bodyWithoutTypename = editedWorksheet.body.map(
      ({ __typename, ...item }) => item,
    )

    // Create a new worksheet object without __typename fields
    const worksheetToSend = { ...editedWorksheet, body: bodyWithoutTypename }

    // Then use `worksheetToSend` in your mutation
    editWorksheetInfo({
      variables: {
        id: worksheetToSend._id,
        input: {
          title: worksheetToSend.title,
          difficulty: worksheetToSend.difficulty,
          body: worksheetToSend.body,
          levelId: topicSchoolGrade,
          topicId: topicId,
          subjectId: subjectId,
        },
      },
    })
  }

  useEffect(() => {
    setEditedWorksheet(worksheet)
  }, [worksheet])

  const handleAddBodyItem = () => {
    setEditedWorksheet({
      ...editedWorksheet,
      body: [...editedWorksheet.body, { __typename: '', text: '', img: '' }],
    })
  }

  const handleRemoveBodyItem = (index: number) => {
    setEditedWorksheet({
      ...editedWorksheet,
      body: editedWorksheet.body.filter((_, i) => i !== index),
    })
  }

  const handleBodyItemChange = (
    index: number,
    field: 'text' | 'img',
    value: string,
  ) => {
    setEditedWorksheet({
      ...editedWorksheet,
      body: editedWorksheet.body.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    })
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0] // Add null check for e.target.files

    const reader = new FileReader()

    reader.onloadend = () => {
      handleBodyItemChange(index, 'img', reader.result?.toString() || '')
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }
  return (
    <div>
      <h2 className="mb-8 mt-8">Edit Topic</h2>
      <form className="w-[800px] space-y-6">
        <div className="flex space-x-5">
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label
              htmlFor="title"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Worksheet Title
            </label>
            <div className="mt-2">
              <input
                type="name"
                name="title"
                id="title"
                value={editedWorksheet.title}
                onChange={handleInputChange}
                className="md:text-md block w-full max-w-[400px] rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="Full name"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label
              htmlFor="img"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              School Grades
            </label>
            <select
              value={topicSchoolGrade}
              onChange={(e) => {
                setTopicSchoolGrade(e.target.value)
              }}
              className="md:text-md block w-full max-w-[400px] rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
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
        </div>
        {editedWorksheet.body.map((item, index) => (
          <div key={index} className="mt-6 flex items-start justify-between">
            <div>
              <div className="flex w-full flex-col items-start justify-between gap-y-1">
                <label htmlFor={`description-${index}`} className="w-full">
                  Description <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  id={`description-${index}`}
                  value={item.text}
                  onChange={(content, delta, source, editor) =>
                    handleBodyItemChange(index, 'text', editor.getHTML())
                  }
                  className="w-full max-w-[400px] lg:w-[100rem]"
                />
              </div>
              <button onClick={() => handleRemoveBodyItem(index)}>
                Remove
              </button>
              <div className="mt-6">
                <button type="button" onClick={handleAddBodyItem}>
                  Add Body Item
                </button>
              </div>
            </div>{' '}
            <div className="flex w-full flex-col items-start justify-between gap-y-1">
              <label htmlFor={`img-${index}`} className="w-full">
                Description image <span className="text-red-500">*</span>
              </label>
              <input
                id={`img-${index}`}
                type="file"
                onChange={(e) => handleFileChange(e, index)}
                className="my-2  w-[100%] max-w-[400px] px-4 lg:w-[100rem]"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="mt-5 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto"
          onClick={handleSave}
        >
          Update
        </button>
      </form>
    </div>
  )
}

export default EditWorksheet
