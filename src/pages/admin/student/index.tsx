import { useState, useEffect, use } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'


import Pagination from "@/components/dashbord/Pagination"
import AdminLayout from "@/layout/AdminLayout"
import { STUDENTS } from '@/apollo/queries/admin';
import ModalAuth from '@/components/ModalComp';
import { AccountType, IStudent } from '../../../../types';
import { DELETE_STUDENT } from '@/apollo/mutations/admin';
import { showToast } from '@/utils/toast';
import EditStudent from '@/components/dashbord/EditStudent';


function Students() {
  const [page, setPage] = useState(1)
  const [studentList, setStudents]  = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [toDelete, setDelete] = useState(false)
  const [itemId, setItemId] = useState('')
  const [student, setStudent] = useState<IStudent>({
    name: '',
    username: '',
    email: '',
    age: 0,
    creatorId: '',
    grade: {
      ages: '',
      stage: 0,
      year: ''
    },
    password: '',
    lastLoggedIn: '',
    assessment: [''],
    schoolId: '',
    _id: '',
    isActive: false,

  })

  const handleDelete = (id?: string) => {
    setItemId(id ? id : '')
    setDelete(!toDelete)
    setOpen(!open)
  }
  const handleEdit = (id?: string) => {
    setItemId(id ? id : '')
    setOpen(!open)
  }

  const [students, { loading, error, data } ] = useLazyQuery(STUDENTS, {
    variables: { page, limit: 20, filter: '' },
    onCompleted: (data) => {
      setStudents(data.students.data)
    }
  })

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
  }

  const [deleteStudent, deleteStatus] = useMutation(DELETE_STUDENT, {
    variables: {
      deleteStudentId: itemId,
    },
    onCompleted: (data) => {
      console.log(data)
        showToast('success', 'Student deleted')
      // reload the page
      window.location.reload()
    },
    onError: (error) => {
      showToast('error', error.message)
      // setLoading(false);
    },
  });
  
  useEffect(() => {
    if (itemId) {
      
      const student = studentList.find((student) => student._id === itemId)
      setStudent(student)
    }
    // Fetch data from API
    students()
  }, [page, itemId])
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Students</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the Students in your account including their name, username, email .
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Student
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                    Name
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                    Username
                  </th>
                  {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th> */}
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Year
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Stage
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              {
                data && (
                  <tbody className="bg-white">
                {studentList.map((person: any) => (
                  <tr key={person._id} className="even:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                    {person.name}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                    {person.username}
                    </td>
                    {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td> */}
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.grade.year}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.grade.stage}</td>
                    
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.isActive ? 'Active' : 'InActive'}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900" onClick={() => handleEdit(person._id)}>
                        Edit<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                      <a href="#" className="text-red-600 hover:text-red-900"  onClick={() => handleDelete(person._id)}>
                        Delete<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
                )
              }
            </table>
          </div>
        </div>
      </div>
    </div>
    <Pagination page={page} count={data?.students?.totalPage} handlePageChange={async (e) => handlePageChange(e)} />
    <ModalAuth isOpen={open} XIcon={true} onClose={() => toDelete ? handleDelete() : setOpen(false)} styling={toDelete ? 'w-[500px] m-auto' : 'w-[1000px] m-auto'}>
      {
        toDelete ? 
        <>
            <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Delete account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className='font-bold'> {student?.name}</span> ? All of {`it's`} data will be permanently removed
                        from our servers forever. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={deleteStatus.loading}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => deleteStudent()}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    disabled={deleteStatus.loading}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => handleDelete()}
                  >
                    Cancel
                  </button>
                </div>
        </> 
        : <>
          <EditStudent student={student} />
        </>
      }
    </ModalAuth>
    </AdminLayout>
  )
}

export default Students
