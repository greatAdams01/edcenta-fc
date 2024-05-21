import React, { useEffect, useState } from 'react'
import { IWorksheet } from '../../../types'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_TOPIC, UPDATE_WORKSHEET } from '@/apollo/mutations/admin'
import { showToast } from '@/utils/toast'
import { FETCH_LEARNING } from '@/apollo/queries/dashboard'

interface EditWorksheetProps {
  worksheet: IWorksheet
  // onSave: (updatedUser: IUser) => void;
}

const EditWorksheet: React.FC<EditWorksheetProps> = ({ worksheet }) => {
  const [editedWorksheet, setEditedWorksheet] = useState<IWorksheet>(worksheet)
  const [topicSchoolGrade, setTopicSchoolGrade] = useState('')
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
  const handleSave = () => {
    editWorksheetInfo()
  }
  const [editWorksheetInfo, { loading }] = useMutation(UPDATE_WORKSHEET, {
    variables: {
      id: editedWorksheet._id,
      input: {
        title: editedWorksheet.title,
        difficulty: editedWorksheet.difficulty,
        body: editedWorksheet.body.map(
          ({ __typename, ...bodyItem }) => bodyItem,
        ),
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

  useEffect(() => {
    setEditedWorksheet(worksheet)
  }, [worksheet])
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    const reader = new FileReader()

    reader.onloadend = () => {
      setEditedWorksheet((prevState: IWorksheet) => ({
        ...prevState,
        body: prevState.body.map((bodyItem) => ({
          ...bodyItem,
          img: reader.result?.toString() || '',
        })),
      }))
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
              htmlFor="name"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Worksheet Title
            </label>
            <div className="mt-2">
              <input
                type="name"
                name="name"
                id="name"
                value={editedWorksheet.title}
                onChange={handleInputChange}
                className="md:text-md block w-full max-w-[400px] rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="Full name"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label
              htmlFor="bodyText"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Body Text
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="bodyText"
                id="bodyText"
                value={
                  editedWorksheet &&
                  editedWorksheet.body &&
                  editedWorksheet.body[0]
                    ? editedWorksheet.body[0].text
                    : ''
                }
                onChange={handleInputChange}
                className="md:text-md block w-full max-w-[400px] rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="Body text"
              />
            </div>
          </div>
        </div>
        <div className="flex space-x-5">
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
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label
              htmlFor="img"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Description image
            </label>
            <div className="mt-2">
              <input
                id="img"
                type="file"
                name="img"
                onChange={handleFileChange}
                className="md:text-md block w-full max-w-[400px] px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
              />
            </div>
          </div>
        </div>
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
