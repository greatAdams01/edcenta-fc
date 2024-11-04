import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_QUESTIONS, WORKSHEET_BY_ID } from '@/apollo/queries/admin'
import { IWorksheet, IWorksheet2 } from '../../../../../../../types'
import AdminLayout from '@/layout/AdminLayout'
import ModalAuth from '@/components/ModalComp'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { showToast } from '@/utils/toast'
import { DELETE_QUESTION, DELETE_WORKSHEET } from '@/apollo/mutations/admin'
import EditWorksheet from '@/components/dashbord/EditWorksheet'
import { IoIosArrowBack } from 'react-icons/io'
import Link from 'next/link'

type WorksheetProps = {
  _id: string
}
interface DifficultyIndicatorProps {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
}
type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD'

const Topics: React.FC<WorksheetProps> = () => {
  const router = useRouter()
  const path = useRouter()
  const [questions, setQuestions] = useState([])
  const [deleteQuestion, setDeleteQuestion] = useState(false)
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
  const [worksheet, setWorksheet] = useState<IWorksheet2>({
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

  const [getQuestions, { }] = useLazyQuery(GET_QUESTIONS, {
    variables: {
      worksheetId: id,
      page: 1,
      limit: 10,
      filter: '',
      levelId: worksheet?.levelId,
      subjectId: worksheet?.subjectId,
    },
    onCompleted: (data) => {
      console.log('Questions:', data.questions)
      setQuestions(data.questions.data)
      // setWorksheet(data.worksheet)
    },
    onError: (error) => {
      console.log('Error:', error)
    },
  })

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
  const [questionDelete, deleteQuestionStatus] = useMutation(DELETE_QUESTION, {
    variables: {
      id: itemId,
    },
    onCompleted: (data) => {
      console.log(data)
      showToast('success', 'Question deleted')
      window.location.reload()
    },
    onError: (error) => {
      showToast('error', error.message)
      // setLoading(false);
    },
  })
  useEffect(() => {
    getWorksheet()
    getQuestions()
  }, [itemId, open])

  const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
    difficulty,
  }) => {
    const boxCount =
      {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3,
      }[difficulty as 'EASY' | 'MEDIUM' | 'HARD'] || 0

    return (
      <div className="flex">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`m-1 h-[20px] w-[28px] rounded-[2.86px] ${index < boxCount ? 'bg-[#23BDBD]]' : 'bg-gray-200'}`}
          ></div>
        ))}
      </div>
    )
  }
  function isDifficultyLevel(
    difficulty: string,
  ): difficulty is DifficultyLevel {
    return ['EASY', 'MEDIUM', 'HARD'].includes(difficulty)
  }
  const difficulty: string = worksheet.difficulty
  return (
    <AdminLayout>
      <div className="space-y-2 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between">
          <button
            onClick={() => path.back()}
            className="mb-6 flex items-center gap-1 text-left text-black"
          >
            <IoIosArrowBack /> <div>Back</div>
          </button>
          <div className="flex w-52 justify-between">
            <a
              href="#"
              className="my-auto text-indigo-600 hover:text-indigo-900"
              onClick={() => handleEdit(worksheet._id)}
            >
              Edit
            </a>
            <Link
              href={`/admin/subjects/topics/worksheets/add_question?worksheet=${id}`}
            >
              <button className="rounded-md bg-indigo-600 p-2 px-4 font-bold text-white">
                Add Question
              </button>
            </Link>
          </div>
        </div>
        <h1 className="text-center text-4xl font-bold text-gray-800">
          {worksheet.title}
        </h1>
        {/* <div className="text-center w-1/2 mx-auto">
          <div className=" justifiy-start flex items-center gap-2 text-base text-gray-700">
            <div>Difficulty:</div>
            {isDifficultyLevel(difficulty) && (
              <DifficultyIndicator difficulty={difficulty} />
            )}
          </div>
        </div> */}

        <div className='flex justify-between flex-wrap'>
          {worksheet.body.map((item, index) => (
            <div key={index} className="my-6 lg:w-[32%] bg-gray-100 p-3 rounded-md text-center">
              <div className="flex w-full justify-center">
                {item.img && (
                  <img
                    src={item.img}
                    alt="image"
                    className="h-full max-h-[400px]"
                  />
                )}
              </div>
              <div
                className="w-full font-bold text-lg"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </div>
          ))}
        </div>
      </div>
      {questions.length >= 1 && (
        <div>
          <h1 className="my-4 text-3xl">Questions</h1>
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
                        Title
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        Explanation
                      </th>
                      {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th> */}
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Is Objective
                      </th>

                      {/* <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th> */}
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  {data && (
                    <tbody className="bg-white">
                      {questions.map((question: any) => (
                        <tr key={question._id} className="even:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {question.title}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {question.explanation}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {question.isObjective ? 'true' : 'false'}
                          </td>

                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() =>
                                router.push(
                                  `/admin/subjects/topics/worksheets/add_question?question=${question._id}`,
                                )
                              }
                            >
                              Edit
                            </a>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <a
                              href="#"
                              className="text-red-600 hover:text-red-900"
                              onClick={() => {
                                setDeleteQuestion(true), setItemId(question._id)
                              }}
                            >
                              Delete
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {worksheet.vidLink && <div className='mx-auto w-1/2' dangerouslySetInnerHTML={{ __html: worksheet.vidLink }} />}

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
      <ModalAuth
        isOpen={deleteQuestion}
        XIcon={true}
        onClose={() => setDeleteQuestion(false)}
        styling={'w-[500px] m-auto'}
      >
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
                Delete Question
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this question? All of {`it's`}{' '}
                  data will be permanently removed from our servers forever.
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={deleteQuestionStatus.loading}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              onClick={() => questionDelete()}
            >
              Delete
            </button>
            <button
              type="button"
              disabled={deleteQuestionStatus.loading}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={() => setDeleteQuestion(false)}
            >
              Cancel
            </button>
          </div>
        </>
      </ModalAuth>
    </AdminLayout>
  )
}

export default Topics
