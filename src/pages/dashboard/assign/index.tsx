import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import AppLayout from '../../../layout/AppLayout'
import { FETCH_LEARNING } from '@/apollo/queries/dashboard'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Grade {
  _id: string
  stage: number
  year: string
  ages: string
  subjects: {
    _id: string
    name: string
    worksheet: number
    topics: number
  }[]
}

export default function Assign() {
  const [open, setOpen] = useState(false)
  const { data, refetch } = useQuery(FETCH_LEARNING, {
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data) {
      console.log(JSON.stringify(data, null, 2))
    }
  }, [data])
  const [selectedCategory, setSelectedCategory] = useState<
    'worksheet' | 'assessment'
  >('worksheet')

  const subjects: string[] =
    data?.fetchLearning[0]?.subjects.map(
      (subjects: { name: string }) => subjects.name,
    ) || []

  if (!data) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-start justify-center bg-[#010B1ACC]`}
      >
        <div className={`z-10 m-auto w-[500px] rounded-md bg-white p-6 py-12`}>
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon
                className="h-6 w-6 text-red-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                You have no subscription
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Subcribe to one of our plans
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 gap-x-3 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Link
              href={`/dashboard`}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Go Back
            </Link>{' '}
            <Link
              href={`/dashboard/subscription`}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto hover:text-gray-900"
            >
              View plans
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Assigned Classes
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all assigned classes and students.
            </p>
          </div>
          <div className="items center mt-4 flex sm:ml-16 sm:mt-0 sm:flex-none">
            <div className="mr-2 flex items-center">
              <p className="mr-2 font-bold">Select Category:</p>
              <select
                className="rounded-md border-2 border-purple-500 px-3 py-2 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value as 'worksheet' | 'assessment',
                  )
                }
              >
                <option value="worksheet">Worksheet</option>
                <option value="assessment">Assessment</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="ml-4">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Year
                    </th>
                    {subjects.map((subjects, index) => (
                      <th
                        key={index}
                        className={`px-3 py-3.5 text-center text-sm font-bold ${
                          index === 0
                            ? 'bg-yellow-500'
                            : index === 1
                              ? 'bg-green-500'
                              : index === 2
                                ? 'bg-blue-500'
                                : 'bg-orange-500'
                        }`}
                      >
                        {subjects}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data &&
                    data.fetchLearning.map((grade: Grade) => (
                      <tr key={grade._id}>
                        <td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
                          {grade.year}
                        </td>
                        {grade.subjects.map((subject, index) => (
                          <td
                            key={`${grade.year}-${subject._id}`}
                            className={`px-3 py-3.5 text-center text-sm font-semibold ${
                              index === 0
                                ? 'bg-yellow-500 hover:bg-yellow-800 hover:text-white'
                                : index === 1
                                  ? 'bg-green-500 hover:bg-green-900 hover:text-white'
                                  : index === 2
                                    ? 'bg-blue-500 hover:bg-blue-900 hover:text-white'
                                    : 'bg-orange-500 hover:bg-orange-900 hover:text-white'
                            }`}
                          >
                            {selectedCategory === 'worksheet' &&
                            subject.worksheet > 0 ? (
                              <Link
                                href={`/dashboard/assign/worksheet/${subject._id}`}
                              >
                                <p className="mr-2">
                                  Worksheet: {subject.worksheet}
                                </p>
                                <p className="mr-2">Topics: {subject.topics}</p>
                              </Link>
                            ) : selectedCategory === 'assessment' &&
                              subject.topics > 0 ? (
                              <Link
                                href={`/dashboard/assign/assessment/${subject._id}`}
                              >
                                <p className="mr-2">
                                  Assessment: {subject.worksheet}
                                </p>
                              </Link>
                            ) : (
                              <span>No {selectedCategory} available</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
