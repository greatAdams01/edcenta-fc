import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { TOPICS, WORKSHEETS } from '@/apollo/queries/admin'
import { IWorksheet } from '../../../../../../types'
import AdminLayout from '@/layout/AdminLayout'
import Link from 'next/link'
import Pagination from '@/components/dashbord/Pagination'
import ModalAuth from '@/components/ModalComp'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { showToast } from '@/utils/toast'
import { DELETE_WORKSHEET } from '@/apollo/mutations/admin'
import EditTopic from '@/components/dashbord/EditTopic'
import EditWorksheet from '@/components/dashbord/EditWorksheet'

type WorksheetProps = {
  _id: string
}

const Topics: React.FC<WorksheetProps> = () => {
  const router = useRouter()
  const { id } = router.query
  React.useEffect(() => {
    if (id) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('topicId', id as string)
      }
    }
  }, [id])
  const [page, setPage] = useState(1)
  const [worksheetList, setWorksheets] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [toDelete, setDelete] = useState(false)
  const [itemId, setItemId] = useState('')
  const [worksheet, setWorksheet] = useState<IWorksheet>({
    title: '',
    body: [],
    difficulty: '',
    vidLink: ''
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
  const [getWorksheet, { loading, error, data }] = useLazyQuery(WORKSHEETS, {
    variables: {
      page,
      limit: 10,
      filter: '',
      topicId: id,
      levelId: '',
      subjectId: '',
    },
    onCompleted: (data) => {
      console.log('Data:', data)
      console.log('Worksheets found:', data.worksheets.data.length)
      setWorksheets(data.worksheets.data)
    },
    onError: (error) => {
      console.log('Error:', error)
      console.log('Query variables:', { page, limit: 10, filter: '', topicId: id, levelId: '', subjectId: '' })
      showToast('error', `Failed to fetch worksheets: ${error.message}`)
    },
  })

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
    getWorksheet({ 
      variables: { 
        page: pageNum, 
        limit: 10, 
        filter: '', 
        topicId: id,
        levelId: '',
        subjectId: ''
      } 
    })
  }

  const [deleteTopic, deleteStatus] = useMutation(DELETE_WORKSHEET, {
    variables: {
      id: itemId,
    },
    onCompleted: (data) => {
      console.log(data)
      showToast('success', 'Worksheet deleted successfully')
      // Refetch worksheets after deletion
      getWorksheet()
    },
    onError: (error) => {
      showToast('error', error.message)
    },
  })

  useEffect(() => {
    if (itemId) {
      const topic = worksheetList.find((worksheet) => worksheet._id === itemId)
      setWorksheet(topic)
    }
  }, [itemId, worksheetList])

  // Fetch worksheets when component mounts or when id changes
  useEffect(() => {
    if (id) {
      getWorksheet()
    }
  }, [id])

  // Refetch when modal closes
  useEffect(() => {
    if (!open) {
      getWorksheet()
    }
  }, [open])

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Worksheets
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the worksheets available in this topic.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <a
              href={'/admin/subjects/topics/worksheets/add_worksheet'}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create worksheet
            </a>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading worksheets...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-red-500">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              Error loading worksheets: {error.message}
            </div>
          </div>
        )}

        {/* Worksheets Table */}
        {!loading && !error && (
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        Difficulty
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  {data && worksheetList.length > 0 ? (
                    <tbody className="bg-white">
                      {worksheetList.map((person, index) => (
                        <tr key={index} className="even:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            <Link
                              href={`worksheet/${person._id}`}
                              className="cursor-pointer text-indigo-600 hover:text-indigo-900"
                            >
                              {person.title}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {person.difficulty}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => handleEdit(person._id)}
                            >
                              Edit
                              <span className="sr-only">, {person.title}</span>
                            </a>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <a
                              href="#"
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDelete(person._id)}
                            >
                              Delete
                              <span className="sr-only">, {person.title}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody className="bg-white">
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500">
                          No worksheets found for this topic.
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination - Fixed to use worksheets instead of users */}
      {data && data.worksheets && data.worksheets.totalPage > 1 && (
        <Pagination
          page={page}
          count={data.worksheets.totalPage}
          handlePageChange={async (e) => handlePageChange(e)}
        />
      )}
      
      <ModalAuth
        isOpen={open}
        XIcon={true}
        onClose={() => (toDelete ? handleDelete() : setOpen(false))}
        styling={toDelete ? 'w-[500px] m-auto' : 'w-[1000px] m-auto'}
      >
        {toDelete ? (
          <>
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Delete Worksheet
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete{' '}
                    <span className="font-bold"> {worksheet?.title}</span> ? All
                    of {`it's`} data will be permanently removed from our
                    servers forever. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={deleteStatus.loading}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={() => deleteTopic()}
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
        ) : (
          <>
            <EditWorksheet worksheet={worksheet} />
          </>
        )}
      </ModalAuth>
    </AdminLayout>
  )
}

export default Topics
