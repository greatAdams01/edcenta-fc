import { useState } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import AppLayout from '../../../layout/AppLayout'
import { FETCH_LEARNING } from '@/apollo/queries/dashboard'

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
  const { data } = useQuery(FETCH_LEARNING)
  const { data: test } = useQuery(FETCH_LEARNING)
  console.log(test)
  const [selectedCategory, setSelectedCategory] = useState<
    'worksheet' | 'assessment'
  >('worksheet')

  const subjects: string[] =
    data?.fetchLearning[0]?.subjects.map(
      (subjects: { name: string }) => subjects.name,
    ) || []

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
