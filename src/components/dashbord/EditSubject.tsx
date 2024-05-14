import React, { useEffect, useState } from 'react'
import { ISubject } from '../../../types'
import { useMutation } from '@apollo/client'
import { UPDATE_SUBJECT } from '@/apollo/mutations/admin'
import { showToast } from '@/utils/toast'
import close from '@/images/close.svg'
import Image from 'next/image'

interface EditSubjectProps {
  subject: ISubject
  // onSave: (updatedUser: IUser) => void;
}

const EditSubject: React.FC<EditSubjectProps> = ({ subject }) => {
  const [editedSubject, setEditedSubject] = useState<ISubject>(subject)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setEditedSubject((prevSubject) => ({
      ...prevSubject,
      [name]: value,
    }))
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
      e.preventDefault()
      setEditedSubject({
        ...editedSubject,
        tags: [...editedSubject.tags, e.currentTarget.value],
      })
      e.currentTarget.value = ''
    }
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.currentTarget.value.trim() !== '') {
      setEditedSubject({
        ...editedSubject,
        tags: [...editedSubject.tags, e.currentTarget.value],
      })
      e.currentTarget.value = ''
    }
  }
  const handleRemoveDescription = (index: number) => {
    setEditedSubject({
      ...editedSubject,
      tags: editedSubject.tags.filter((_, i) => i !== index),
    })
  }
  const handleSave = () => {
    editUserInfo()
  }
  const [editUserInfo, { loading }] = useMutation(UPDATE_SUBJECT, {
    variables: {
      id: editedSubject._id,
      name: editedSubject.name,
      description: editedSubject.description,
      slug: editedSubject.slug,
      tags: editedSubject.tags,
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
    setEditedSubject(subject)
  }, [subject])

  return (
    <div>
      <h2>Edit Subject</h2>
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
                value={editedSubject.name}
                onChange={handleInputChange}
                className="md:text-md block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="Full name"
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex space-x-5">
          <div>
            <label
              htmlFor="description"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                placeholder="Enter description"
                value={editedSubject.description}
                onChange={handleInputChange}
                className="md:text-md block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="slugs"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Slug
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="slug"
                id="slug"
                value={editedSubject.slug}
                onChange={handleInputChange}
                className="md:text-md block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="Enter slugs"
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex space-x-5">
          <div>
            <label
              htmlFor="tags"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Tags
            </label>
            <div
              className={`flex items-center px-4 ${
                editedSubject.tags ? 'py-1.5' : 'py-[11px]'
              } md:text-md mt-2 block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]`}
            >
              {editedSubject.tags.map((desc, index) => (
                <div
                  key={index}
                  className="mr-2 inline-flex h-8 w-[74px] items-center justify-center gap-2 rounded-[100px] bg-gray-200 px-2.5 py-1.5"
                >
                  <div className="text-sm font-normal leading-tight text-zinc-800">
                    {desc}
                  </div>
                  <Image
                    src={close}
                    className="relative h-4 w-4"
                    onClick={() => handleRemoveDescription(index)}
                    alt="close icon"
                    unoptimized
                  />
                </div>
              ))}
              <input
                id="tags"
                name="tags"
                type="text"
                placeholder="Enter tags"
                className="flex-grow focus:outline-transparent"
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
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

export default EditSubject
