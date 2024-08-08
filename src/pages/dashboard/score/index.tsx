import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ASSIGNMENTS, STUDENTS } from '@/apollo/queries/dashboard'
import AppLayout from '@/layout/AppLayout'
import { statData } from '@/utils/nav'
import { BsBarChartFill } from 'react-icons/bs'
import { USER_FULLNAME, STUDENT_NAME } from '@/apollo/queries/auth'
import { deleteCookie, getCookie } from 'cookies-next'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Score() {
  const { data } = useQuery(STUDENTS)
  const students = data?.students.data || []
  const [assignmentList, setAssignmentList] = useState<any[]>([])
  const [statsData, setStatsData] = useState<any[]>([])
  const [currentScores, setCurrentScores] = useState(statsData.map((stat) => 0))
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [fullName, setFullName] = useState('')
  const [isStudent, setIsStudent] = useState(false)
  const [page, setPage] = useState(1)

  const [user, { loading }] = useLazyQuery(USER_FULLNAME, {
    onCompleted: (data) => {
      setFullName(`${data.user.firstName} ${data.user.lastName}`)
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

  const [getAssignments, { error: assignmentError, data: assignments }] =
    useLazyQuery(ASSIGNMENTS, {
      variables: {
        studentId: selectedStudentId,
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

        toast.success('Fetched students score successfully.')
      },
      onError: (error) => {
        console.log('Error:', error)
        toast.error('An error occured while fetching students score')
      },
    })

  const handleStudentChange = (event: { target: { value: any } }) => {
    const studentId = event.target.value
    setSelectedStudentId(studentId)
    getAssignments({ variables: { studentId } })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  useEffect(() => {
    console.log('assignmentList', assignmentList)

    console.log(statsData)
    console.log(currentScores)
  }, [assignmentList])

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
          <h1 className="text-xl font-semibold text-gray-900">
            Select a student to view his scores
          </h1>
          {students.length === 0 ? (
            <p className="my-4 mb-8 text-lg font-medium text-gray-900">
              You have no registered students
            </p>
          ) : (
            <section className="my-4 mb-8 flex w-full justify-between">
              <select
                className="w-60 rounded-md border border-black px-2 py-4"
                onChange={handleStudentChange}
                defaultValue=""
              >
                <option value="" disabled>
                  Select a student
                </option>
                {students.map((student: any) => (
                  <option
                    key={student._id}
                    value={student._id}
                    className="font-bold"
                  >
                    {student.name}
                  </option>
                ))}
              </select>
            </section>
          )}
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
                {statsData.length === 0 ? (
                  <p className="text-lg font-medium text-gray-900">
                    This student has no assignments
                  </p>
                ) : (
                  statsData.map((stat, index) => (
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
                  ))
                )}
              </div>
            </section>
          </section>
        </div>
      </div>
    </AppLayout>
  )
}
