import React, { useEffect, useState } from 'react'
import { ITopic } from '../../../types'
import { useMutation } from '@apollo/client'
import { UPDATE_TOPIC } from '@/apollo/mutations/admin'
import { showToast } from '@/utils/toast'

interface EditTopicProps {
  topic: ITopic
  // onSave: (updatedUser: IUser) => void;
}

const EditTopic: React.FC<EditTopicProps> = ({ topic }) => {
  const [editedTopic, setEditedTopic] = useState<ITopic>(topic)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setEditedTopic((prevSubject) => ({
      ...prevSubject,
      [name]: value,
    }))
  }
  const handleSave = () => {
    editUserInfo()
  }
  const [editUserInfo, { loading }] = useMutation(UPDATE_TOPIC, {
    variables: {
      id: editedTopic._id,
      name: editedTopic.name,
    },
    onCompleted: (data) => {
      console.log(data)
      showToast('success', 'User Updated')
      // reload the page
    },
    onError: (error) => {
      showToast('error', error.message)
      console.log(error)
      // setLoading(false);
    },
  })

  useEffect(() => {
    setEditedTopic(topic)
  }, [topic])

  return (
    <div>
      <h2>Edit Topic</h2>
      <form className="w-[800px]">
        <div className="flex space-x-5">
          <div>
            <label
              htmlFor="name"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Full name
            </label>
            <div className="mt-2">
              <input
                type="name"
                name="name"
                id="name"
                value={editedTopic.name}
                onChange={handleInputChange}
                className="md:text-md block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="Full name"
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

export default EditTopic
