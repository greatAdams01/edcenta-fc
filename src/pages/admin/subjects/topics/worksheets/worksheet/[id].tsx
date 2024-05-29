import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { TOPICS, WORKSHEET_BY_ID, WORKSHEETS } from '@/apollo/queries/admin'
import { IWorksheet } from '../../../../../../../types'
import AdminLayout from '@/layout/AdminLayout'
import Link from 'next/link'
import Pagination from '@/components/dashbord/Pagination'
import ModalAuth from '@/components/ModalComp'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { showToast } from '@/utils/toast'
import { DELETE_WORKSHEET } from '@/apollo/mutations/admin'
import EditTopic from '@/components/dashbord/EditTopic'
import EditWorksheet from '@/components/dashbord/EditWorksheet'
import { IoIosArrowBack } from 'react-icons/io'

type WorksheetProps = {
  _id: string
}

const Topics: React.FC<WorksheetProps> = () => {
  const router = useRouter()
  const path = useRouter()
  const { id } = router.query
  React.useEffect(() => {
    if (id) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('topicId', id as string)
      }
    }
  }, [id])
  const [open, setOpen] = useState(false)
  const [toDelete, setDelete] = useState(false)
  const [itemId, setItemId] = useState('')
  const [worksheet, setWorksheet] = useState<IWorksheet>({
    title: '',
    body: [],
    difficulty: '',
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
  const [getWorksheet, { loading, error, data }] = useLazyQuery(
    WORKSHEET_BY_ID,
    {
      variables: { id: id },
      onCompleted: (data) => {
        console.log('Data:', data)
        setWorksheet(data.worksheet)
      },
      onError: (error) => {
        console.log('Error:', error)
      },
    },
  )
  useEffect(() => {
    console.log('worksheet', worksheet)
  }, [worksheet])

  const [deleteTopic, deleteStatus] = useMutation(DELETE_WORKSHEET, {
    variables: {
      id: itemId,
    },
    onCompleted: (data) => {
      console.log(data)
      showToast('success', 'Topic deleted')
      // reload the page
      window.location.reload()
    },
    onError: (error) => {
      showToast('error', error.message)
      // setLoading(false);
    },
  })
  useEffect(() => {
    getWorksheet()
  }, [itemId, open])
  return (
    <AdminLayout>
      <div className="space-y-2 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => path.back()}
          className="mb-6 flex items-center gap-1 text-left text-black"
        >
          <IoIosArrowBack /> <div>Back</div>
        </button>
        <h1 className="w-full text-center text-2xl font-semibold uppercase leading-6 text-gray-900">
          {worksheet.title}
        </h1>
        <div className="space-y-2 sm:flex sm:items-center sm:justify-between">
          <p className=" text-sm text-gray-700">
            Difficulty: {worksheet.difficulty}
          </p>
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => handleEdit(worksheet._id)}
          >
            Edit
          </a>
        </div>
        {worksheet.body.map((item, index) => (
          <div key={index}>
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
            <div className="flex w-full justify-center">
              {item.img && (
                <img
                  src={item.img}
                  alt="image"
                  className="h-full max-h-[400px] w-auto"
                />
              )}
            </div>
          </div>
        ))}
      </div>
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
