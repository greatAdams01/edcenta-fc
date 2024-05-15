import { useState } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import AppLayout from '../../../layout/AppLayout'
import { SchoolGrades } from '@/apollo/queries/dashboard'

interface Grade {
  _id: string
  stage: number
  year: string
  ages: string
  subject: {
    _id: string
    name: string
    worksheet: {
      _id: string
      title: string
      levelId: string
      questions: string
    }[]
    topics: {
      _id: string
      name: string
      levelId: string
    }[]
  }[]
}

export default function Assign() {
  const { data } = useQuery(SchoolGrades, {
    variables: {
      page: 1,
      limit: 20,
      filter: '',
      searchParams: '',
    },
  })
  const [selectedCategory, setSelectedCategory] = useState<
    'worksheet' | 'assessment'
  >('worksheet')

  const subjects: string[] =
    data?.schoolGrades[0]?.subject.map(
      (subject: { name: string }) => subject.name,
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
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Age
                    </th>
                    {subjects.map((subject, index) => (
                      <th
                        key={subject}
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
                        {subject}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data &&
                    data.schoolGrades.map((grade: Grade) => (
                      <tr key={grade._id}>
                        <td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
                          {grade.year}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
                          {grade.ages}
                        </td>
                        {grade.subject.map((subject, index) => (
                          <td
                            key={subject._id}
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
                            subject.worksheet.length > 0 ? (
                              <Link
                                href={`/dashboard/assign/worksheet/${subject._id}`}
                              >
                                <p className="mr-2">
                                  Worksheet: {subject.worksheet.length}
                                </p>
                                <p className="mr-2">
                                  Topics: {subject.topics.length}
                                </p>
                              </Link>
                            ) : selectedCategory === 'assessment' &&
                              subject.topics.length > 0 ? (
                              <Link
                                href={`/dashboard/assign/assessment/${subject._id}`}
                              >
                                <p className="mr-2">
                                  Assessment:{' '}
                                  {subject.worksheet[index].questions.length}
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
