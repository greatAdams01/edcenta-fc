import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_QUESTIONS, WORKSHEET_BY_ID } from '@/apollo/queries/admin'
import { IWorksheet, IWorksheet2 } from '../../../../../../../types'
import AdminLayout from '@/layout/AdminLayout'
import ModalAuth from '@/components/ModalComp'
import { ExclamationTriangleIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
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
  }, [getQuestions, getWorksheet, itemId, open])

  const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
    difficulty,
  }) => {
    const boxCount =
      {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3,
      }[difficulty as 'EASY' | 'MEDIUM' | 'HARD'] || 0

    const difficultyColors = {
      EASY: 'bg-green-500',
      MEDIUM: 'bg-yellow-500',
      HARD: 'bg-red-500'
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Difficulty:</span>
        <div className="flex gap-1">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={`h-3 w-6 rounded-sm transition-all duration-200 ${
                index < boxCount 
                  ? difficultyColors[difficulty as keyof typeof difficultyColors] || 'bg-gray-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700 capitalize">
          {difficulty.toLowerCase()}
        </span>
      </div>
    )
  }
  
  function isDifficultyLevel(
    difficulty: string,
  ): difficulty is DifficultyLevel {
    return ['EASY', 'MEDIUM', 'HARD'].includes(difficulty)
  }
  
  const difficulty: string = worksheet.difficulty

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Worksheet</h2>
            <p className="text-gray-600">Unable to load the worksheet. Please try again.</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => path.back()}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                >
                  <IoIosArrowBack className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-500">Worksheet Details</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleEdit(worksheet._id)}
                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Worksheet
                </button>
                <Link
                  href={`/admin/subjects/topics/worksheets/add_question?worksheet=${id}`}
                >
                  <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm">
                    <PlusIcon className="w-4 h-4" />
                    Add Question
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Worksheet Header Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {worksheet.title}
              </h1>
              {isDifficultyLevel(difficulty) && (
                <div className="flex justify-center">
                  <DifficultyIndicator difficulty={difficulty} />
                </div>
              )}
            </div>
            
            {/* Worksheet Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {worksheet.body.length}
                </div>
                <div className="text-sm text-gray-600">Content Sections</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {questions.length}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-violet-600 mb-2">
                  {worksheet.vidLink ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-600">Video Content</div>
              </div>
            </div>
          </div>

          {/* Worksheet Content */}
          {worksheet.body.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <EyeIcon className="w-4 h-4 text-indigo-600" />
                </div>
                Worksheet Content
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {worksheet.body.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-2">
                        Section {index + 1}
                      </div>
                      {item.img && (
                        <div className="mb-4">
                          <img
                            src={item.img}
                            alt={`Section ${index + 1} image`}
                            className="w-full h-48 object-cover rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Content */}
          {worksheet.vidLink && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </div>
                Video Content
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <div dangerouslySetInnerHTML={{ __html: worksheet.vidLink }} />
              </div>
            </div>
          )}

          {/* Questions Section */}
          {questions.length >= 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                Questions ({questions.length})
              </h2>
              
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Question Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Explanation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {questions.map((question: any, index: number) => (
                        <tr key={question._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {question.title}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {question.explanation}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              question.isObjective 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {question.isObjective ? 'Objective' : 'Subjective'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/subjects/topics/worksheets/add_question?question=${question._id}`,
                                  )
                                }
                                className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteQuestion(true)
                                  setItemId(question._id)
                                }}
                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
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

      {/* Delete Question Modal */}
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
