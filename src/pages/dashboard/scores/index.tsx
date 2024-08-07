import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ASSIGNMENTS, STUDENTS } from '@/apollo/queries/dashboard'
import AppLayout from '@/layout/AppLayout'
import { statData } from '@/utils/nav'
import { BsBarChartFill } from 'react-icons/bs'
import { USER_FULLNAME, STUDENT_NAME } from '@/apollo/queries/auth'
import { deleteCookie, getCookie } from 'cookies-next'

export default function Score() {
  const { data } = useQuery(STUDENTS)
  const students = data?.students.data || []
  const [assignmentList, setAssignmentList] = useState<any[]>([])
  const [statsData, setStatsData] = useState<any[]>([])
  const [currentScores, setCurrentScores] = useState(statsData.map((stat) => 0))
  const [fullName, setFullName] = useState('')
  const [isStudent, setIsStudent] = useState(false)
  const [page, setPage] = useState(1)

  const [user, { loading }] = useLazyQuery(USER_FULLNAME, {
    onCompleted: (data) => {
      setFullName(`${data.user.firstName} ${data.user.lastName}`)
    },
  })

  const [student] = useLazyQuery(STUDENT_NAME, {
    onCompleted: (data) => {
      setFullName(data.student.name)
    },
  })

  const authData: any = getCookie('Authdata')
  let authDataId: string | null = null

  if (authData) {
    try {
      authDataId = JSON.parse(authData)._id
    } catch (error) {
      console.error('Error parsing authData:', error)
    }
  }

  const [getAssignments, { error, data: assignments }] = useLazyQuery(
    ASSIGNMENTS,
    {
      variables: {
        studentId: authDataId,
        worksheetId: '',
      },
      onCompleted: (data) => {
        console.log('Raw data:', data) // Log the raw data object
        const assignmentsData = data.assignments.data
        setAssignmentList(assignmentsData)

        // Check if assignmentsData is an array and has elements
        if (Array.isArray(assignmentsData) && assignmentsData.length > 0) {
          const transformedData = assignmentsData
            .filter((assignment) => assignment.worksheetId) // Filter out assignments with null worksheetId
            .map((assignment) => ({
              subject: assignment.worksheetId.subjectId.name.substring(0, 3),
              score: assignment.score,
            }))
          console.log('Transformed Data:', transformedData) // Log the transformed data
          setStatsData(transformedData)
        } else {
          console.warn(
            'Assignments data is not an array or is empty:',
            assignmentsData,
          )
        }
      },
      onError: (error) => {
        console.log('Error:', error)
      },
    },
  )

  useEffect(() => {
    console.log('assignmentList', assignmentList)

    console.log(statsData)
    console.log(currentScores)
  }, [assignmentList])

  useEffect(() => {
    const authData: any = getCookie('Authdata')
    if (JSON.parse(authData).accountType === 'STUDENT') {
      setIsStudent(true)
      student({ variables: { studentId: JSON.parse(authData)._id } })
      getAssignments({ variables: { studentId: JSON.parse(authData)._id } })
    } else {
      user()
    }
  }, [])

  useEffect(() => {
    setCurrentScores(statsData.map((stat) => 0)) // Initialize currentScores based on statsData

    const incrementScores = () => {
      setCurrentScores((prevScores) =>
        prevScores.map((score, index) => {
          const targetScore = statsData[index].score
          let step = 5 // Increment step value
          const newScore = score + step
          return newScore >= targetScore ? targetScore : newScore
        }),
      )
    }

    const interval = setInterval(() => {
      incrementScores()
    }, 50)

    return () => clearInterval(interval)
  }, [statsData]) // Add statsData as a dependency

  const totalScore = currentScores.reduce((sum, score) => sum + score, 0)

  const circleWidth = 200
  const radius = 90
  const statArray = radius * Math.PI * 2
  const estimatedPercentage =
    statsData.length > 0 ? (totalScore / (statsData.length * 100)) * 100 : 0
  const statOffset = statArray - (statArray * estimatedPercentage) / 100

  const subjectRadius = 65
  const subjectStatArray = subjectRadius * Math.PI * 2
  const subjectOffsets = statsData.map((stat, index) => {
    const subjectStatOffset =
      subjectStatArray - (subjectStatArray * currentScores[index]) / 100
    return subjectStatOffset
  })

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="w-full justify-self-center rounded-md">
          <h1 className="mb-8 text-xl font-semibold text-gray-900">
            {fullName}
          </h1>
          <div className="mb-8 flex w-full items-center justify-between gap-x-3 bg-[#00AE9A] bg-opacity-20 p-2">
            <div className="flex w-full items-center justify-start gap-x-3">
              <BsBarChartFill />
              <h2 className="text-lg font-semibold leading-6 text-gray-700">
                Scores
              </h2>
            </div>
          </div>
          <section className="grid flex-wrap gap-x-8 font-bold md:flex">
            <section className="">
              <p className="my-2 text-lg">Overall score</p>
              <div className="flex flex-col items-center justify-center space-y-6 border p-8">
                <svg
                  width={circleWidth}
                  height={circleWidth}
                  viewBox={`0 0 ${circleWidth} ${circleWidth}`}
                >
                  <circle
                    cx={circleWidth / 2}
                    cy={circleWidth / 2}
                    strokeWidth="15px"
                    r={radius}
                    className="circle-background mb-10"
                  />
                  <circle
                    cx={circleWidth / 2}
                    cy={circleWidth / 2}
                    strokeWidth="15px"
                    r={radius}
                    className="circle-progress"
                    style={{
                      strokeDasharray: statArray,
                      strokeDashoffset: statOffset,
                    }}
                    stroke={
                      parseFloat(estimatedPercentage.toFixed(2)) <= 30
                        ? '#FF0000'
                        : parseFloat(estimatedPercentage.toFixed(2)) <= 60
                          ? '#0075BC'
                          : '#00AE9A'
                    }
                    transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
                  />
                  <text
                    x="50%"
                    y="50%"
                    dy="0.3em"
                    textAnchor="middle"
                    className="circle-text"
                  >
                    {estimatedPercentage.toFixed(2)}%
                  </text>
                </svg>

                <div className="">
                  <table>
                    <thead>
                      <tr>
                        <th className="flex w-full justify-center">
                          <p className="w-5/6 bg-yellow-500 p-2">
                            Activities completed
                          </p>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      <tr>
                        <td>{totalScore}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="">
              <p className="my-2 text-lg">Subject score</p>
              <div className="grid w-full grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] gap-x-0 border p-6 md:w-[50vw]">
                {statsData.map((stat, index) => (
                  <div key={index} className="grid w-full justify-center">
                    <div className="flex w-full justify-center">
                      <p className="w-5/6 bg-[#00AE9A] p-2 text-center text-white">
                        {stat.subject}
                      </p>
                    </div>
                    <svg
                      width={circleWidth}
                      height={circleWidth}
                      viewBox={`0 0 ${circleWidth} ${circleWidth}`}
                    >
                      <circle
                        cx={circleWidth / 2}
                        cy={circleWidth / 2}
                        strokeWidth="15px"
                        r={subjectRadius}
                        className="circle-background"
                      />
                      <circle
                        cx={circleWidth / 2}
                        cy={circleWidth / 2}
                        strokeWidth="15px"
                        r={subjectRadius}
                        className="circle-progress"
                        style={{
                          strokeDasharray: subjectStatArray,
                          strokeDashoffset: subjectOffsets[index],
                        }}
                        stroke={
                          currentScores[index] <= 30
                            ? '#FF0000'
                            : currentScores[index] <= 60
                              ? '#0075BC'
                              : '#00AE9A'
                        }
                        transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
                      />
                      <text
                        x="50%"
                        y="50%"
                        dy="0.3em"
                        textAnchor="middle"
                        className="circle-text"
                      >
                        {currentScores[index]}
                      </text>
                    </svg>
                    <div className="flex w-full justify-center">
                      <table>
                        <thead>
                          <tr>
                            <th className="flex w-full justify-center">
                              <p className="w-5/6 bg-[#00AE9A] p-2 text-white">
                                Activities completed
                              </p>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="mb-4 h-10 w-full border-b text-center">
                          <tr>
                            <td>{currentScores[index]}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>
          <section className="mt-16">
            <p className="my-2 mb-6 text-xl font-bold">
              Best performing topics
            </p>
            <table className="w-1/2 table-auto">
              <thead>
                <tr>
                  <td className="w-[65%] pb-4">Topics</td>
                  <td className="pb-4">Subject</td>
                  <td className="pb-4">Score</td>
                </tr>
              </thead>
              <tbody>
                {assignmentList &&
                assignmentList.some(
                  (assignment) => assignment.status === 'DONE',
                ) ? (
                  assignmentList
                    .filter((assignment) => assignment.status === 'DONE')
                    .map((assignment) => (
                      <tr key={assignment._id}>
                        <td className="pr-6 text-left">
                          {assignment.worksheetId &&
                            assignment.worksheetId.title}
                        </td>
                        <td className="pr-6 text-left">
                          <button className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                            {assignment.worksheetId.subjectId.name.substring(
                              0,
                              3,
                            )}
                          </button>
                        </td>
                        <td>
                          <button className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                            {assignment.score}
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      <div className="flex h-20 items-center justify-center">
                        <div>
                          <h1 className="text-lg font-semibold text-gray-500 sm:text-xl">
                            No assessment with good score
                          </h1>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
          <section className="mt-16">
            <p className="my-2 mb-6 text-xl font-bold">Topics to work on</p>
            <table className="w-1/2 table-auto">
              <thead>
                <tr>
                  <td className="w-[65%] pb-4">Topics</td>
                  <td className="pb-4">Subject</td>
                  <td className="pb-4">Score</td>
                </tr>
              </thead>
              <tbody>
                {assignmentList &&
                assignmentList.some(
                  (assignment) => assignment.status === 'FAILED',
                ) ? (
                  assignmentList
                    .filter((assignment) => assignment.status === 'FAILED')
                    .map((assignment) => (
                      <tr key={assignment._id}>
                        <td className="pr-6 text-left">
                          {assignment.worksheetId &&
                            assignment.worksheetId.title}
                        </td>
                        <td className="pr-6 text-left">
                          <button className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                            {assignment.worksheetId.subjectId.name.substring(
                              0,
                              3,
                            )}
                          </button>
                        </td>
                        <td>
                          <button className="inline-flex w-full justify-center rounded-md bg-[#FF0000] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto">
                            {assignment.score}
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      <div className="flex h-20 items-center justify-center">
                        <div>
                          <h1 className="text-lg font-semibold text-gray-500 sm:text-xl">
                            No failed assessment
                          </h1>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </AppLayout>
  )
}
