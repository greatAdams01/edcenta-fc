import React, { useEffect, useState } from 'react'
import { IStudent } from '../../../types'
import { useMutation } from '@apollo/client'
import { EDIT_USER, UPDATE_STUDENT } from '@/apollo/mutations/admin'
import { showToast } from '@/utils/toast'

interface EditStudentProps {
  student: IStudent
  // onSave: (updatedUser: IStudent) => void;
}

const EditStudent: React.FC<EditStudentProps> = ({ student }) => {
  const [editedStudent, setEditedStudent] = useState<IStudent>(student)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }))
  }

  const handleSave = () => {
    updateStudent()
  }

  const activeMethods = [
    { id: 'true', title: 'Active' },
    { id: 'false', title: 'Inactive' },
  ]
  const [updateStudent, { loading }] = useMutation(UPDATE_STUDENT, {
    variables: {
      updateStudentId: student._id,
      input: {
        age: editedStudent.age,
        email: editedStudent.email,
        grade: editedStudent.grade._id,
        name: editedStudent.name,
        username: editedStudent.username,
        isActive: editedStudent.isActive,
      },
    },
    onCompleted: (data) => {
      console.log(data)
      showToast('success', 'User Updated')
      // reload the page
    },
    onError: (error) => {
      showToast('error', error.message)
      // setLoading(false);
    },
  })

  useEffect(() => {
    setEditedStudent(student)
  }, [student])

  return (
    <div>
      <h2>Edit Student</h2>
      <form className="w-[800px]">
        <div className="flex space-x-5">
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label
              htmlFor="name"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                value={editedStudent.name}
                onChange={handleInputChange}
                className="md:text-md block w-full max-w-[400px] rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="First name"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label
              htmlFor="username"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              User name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="username"
                id="username"
                value={editedStudent.username}
                onChange={handleInputChange}
                className="md:text-md block w-full max-w-[400px] rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="Last name"
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex space-x-5">
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label
              htmlFor="email"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                value={editedStudent.email}
                onChange={handleInputChange}
                className="md:text-md block w-full max-w-[400px] rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label
              htmlFor="age"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Age
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="age"
                id="age"
                value={editedStudent.age}
                onChange={handleInputChange}
                className="md:text-md block w-full max-w-[400px] rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="Age"
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex space-x-5">
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label
              htmlFor="grade"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Grade
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="grade"
                id="grade"
                value={editedStudent.grade.year}
                // onChange={handleInputChange}
                className="md:text-md block w-full max-w-[400px] rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:leading-6 lg:w-[400px]"
                placeholder="Grade"
              />
            </div>
          </div>

          <div>
            <label className="text-base font-semibold text-gray-900">
              Active status
            </label>
            <p className="text-sm text-gray-500">
              Active status of the student
            </p>
            <fieldset className="mt-4">
              <legend className="sr-only">Notification method</legend>
              <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                {activeMethods.map((activeMethod) => (
                  <div key={activeMethod.id} className="flex items-center">
                    <input
                      id={activeMethod.id}
                      name="notification-method"
                      type="radio"
                      defaultChecked={
                        editedStudent.isActive
                          ? activeMethod.id === 'true'
                          : activeMethod.id === 'false'
                      }
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor={activeMethod.id}
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      {activeMethod.title}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
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

export default EditStudent
