"use client"

import { useState, useEffect } from "react"
import { useQuery, useLazyQuery } from "@apollo/client"
import { ASSIGNMENTS, STUDENTS } from "@/apollo/queries/dashboard"
import AppLayout from "@/layout/AppLayout"
import { BsBarChartFill } from "react-icons/bs"
import { USER_FULLNAME } from "@/apollo/queries/auth"
import { getCookie } from "cookies-next"
import { ToastContainer, toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


// Create a wrapper component that uses useTheme
function ScoreContent() {
  const { data } = useQuery(STUDENTS)
  const students = data?.students.data || []
  const [assignmentList, setAssignmentList] = useState<any[]>([])
  const [statsData, setStatsData] = useState<any[]>([])
  const [currentScores, setCurrentScores] = useState<number[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [isStudent, setIsStudent] = useState(false)
  const [page, setPage] = useState(1)

  const [user, { loading }] = useLazyQuery(USER_FULLNAME, {
    onCompleted: (data) => {
      setFullName(`${data.user.firstName} ${data.user.lastName}`)
    },
  })

  const authData: any = getCookie("Authdata")
  let authDataId: string | null = null

  if (authData) {
    try {
      authDataId = JSON.parse(authData)._id
    } catch (error) {
      console.error("Error parsing authData:", error)
    }
  }

  const [getAssignments, { error: assignmentError, data: assignments }] = useLazyQuery(ASSIGNMENTS, {
    variables: {
      studentId: selectedStudentId,
      worksheetId: "",
    },
    onCompleted: (data) => {
      console.log("Raw data:", data) // Log the raw data object
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
        console.log("Transformed Data:", transformedData) // Log the transformed data
        setStatsData(transformedData)
      } else {
        console.warn("Assignments data is not an array or is empty:", assignmentsData)
      }

      toast.success("Fetched students score successfully.")
    },
    onError: (error) => {
      console.log("Error:", error)
      toast.error("An error occurred while fetching students score")
    },
  })

  const handleStudentChange = (event: { target: { value: any } }) => {
    const studentId = event.target.value
    setSelectedStudentId(studentId)
    getAssignments({ variables: { studentId } })
  }

  useEffect(() => {
    if (loading) return

    console.log("assignmentList", assignmentList)
    console.log(statsData)
    console.log(currentScores)
  }, [loading, assignmentList, statsData, currentScores])

  useEffect(() => {
    if (statsData.length > 0) {
      setCurrentScores(statsData.map((stat) => 0)) // Initialize currentScores based on statsData
    }
  }, [statsData])

  useEffect(() => {
    if (statsData.length === 0) return

    const incrementScores = () => {
      setCurrentScores((prevScores) =>
        prevScores.map((score, index) => {
          const targetScore = statsData[index].score
          const step = 5 // Increment step value
          const newScore = score + step
          return newScore >= targetScore ? targetScore : newScore
        }),
      )
    }

    const interval = setInterval(() => {
      incrementScores()
    }, 50)

    return () => clearInterval(interval)
  }, [statsData])

  const totalScore = currentScores.reduce((sum, score) => sum + score, 0)

  const circleWidth = 200
  const radius = 90
  const statArray = radius * Math.PI * 2
  const estimatedPercentage = statsData.length > 0 ? (totalScore / (statsData.length * 100)) * 100 : 0
  const statOffset = statArray - (statArray * estimatedPercentage) / 100

  const subjectRadius = 65
  const subjectStatArray = subjectRadius * Math.PI * 2
  const subjectOffsets = statsData.map((stat, index) => {
    const subjectStatOffset = subjectStatArray - (subjectStatArray * currentScores[index]) / 100
    return subjectStatOffset
  })

  // Rest of your component code...

  // Return your JSX with theme-aware styling
  return (
    <>
      <div className="grid justify-items-stretch transition-colors duration-200">
        <div className="w-full justify-self-center rounded-md">
          <h1 className="text-xl font-semibold text-gray-900 transition-colors duration-200">
            Select a student to view his scores
          </h1>
          {students.length === 0 ? (
            <p className="my-4 mb-8 text-lg font-medium text-gray-900 transition-colors duration-200">
              You have no registered students
            </p>
          ) : (
            <section className="my-4 mb-8 flex w-full justify-between">
              <select
                className="w-60 rounded-md border border-gray-300 bg-white px-2 py-4 text-gray-900 transition-colors duration-200"
                onChange={handleStudentChange}
                defaultValue=""
              >
                <option value="" disabled>
                  Select a student
                </option>
                {students.map((student: any) => (
                  <option key={student._id} value={student._id} className="font-bold">
                    {student.name}
                  </option>
                ))}
              </select>
            </section>
          )}
          <div className="mb-8 flex w-full items-center justify-between gap-x-3 bg-purple-100 p-2 transition-colors duration-200">
            <div className="flex w-full items-center justify-start gap-x-3">
              <BsBarChartFill className="text-purple-600" />
              <h2 className="text-lg font-semibold leading-6 text-gray-700 transition-colors duration-200">Scores</h2>
            </div>
          </div>
          <section className="grid flex-wrap gap-x-8 font-bold md:flex">
            <section className="">
              <p className="my-2 text-lg text-gray-900 transition-colors duration-200">Overall score</p>
              <div className="flex flex-col items-center justify-center space-y-6 border border-gray-200 p-8 bg-white rounded-lg shadow-sm transition-colors duration-200">
                <svg width={circleWidth} height={circleWidth} viewBox={`0 0 ${circleWidth} ${circleWidth}`}>
                  <circle
                    cx={circleWidth / 2}
                    cy={circleWidth / 2}
                    strokeWidth="15px"
                    r={radius}
                    className="fill-none stroke-gray-200 transition-colors duration-200"
                  />
                  <circle
                    cx={circleWidth / 2}
                    cy={circleWidth / 2}
                    strokeWidth="15px"
                    r={radius}
                    className="fill-none"
                    style={{
                      strokeDasharray: statArray,
                      strokeDashoffset: statOffset,
                    }}
                    stroke={
                      Number.parseFloat(estimatedPercentage.toFixed(2)) <= 30
                        ? "#FF0000"
                        : Number.parseFloat(estimatedPercentage.toFixed(2)) <= 60
                          ? "#0075BC"
                          : "#00AE9A"
                    }
                    transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
                  />
                  <text
                    x="50%"
                    y="50%"
                    dy="0.3em"
                    textAnchor="middle"
                    className="fill-gray-900 text-2xl font-bold transition-colors duration-200"
                  >
                    {estimatedPercentage.toFixed(2)}%
                  </text>
                </svg>

                <div className="">
                  <table>
                    <thead>
                      <tr>
                        <th className="flex w-full justify-center">
                          <p className="w-5/6 bg-purple-500 p-2 text-white rounded-t-md transition-colors duration-200">
                            Activities completed
                          </p>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      <tr>
                        <td className="border border-gray-200 p-2 text-gray-900 bg-white transition-colors duration-200">
                          {totalScore}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="">
              <p className="my-2 text-lg text-gray-900 transition-colors duration-200">Subject score</p>
              <div className="grid w-full grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] gap-x-0 border border-gray-200 p-6 md:w-[50vw] bg-white rounded-lg shadow-sm transition-colors duration-200">
                {statsData.length === 0 ? (
                  <p className="text-lg font-medium text-gray-900 transition-colors duration-200">
                    This student has no assignments
                  </p>
                ) : (
                  statsData.map((stat, index) => (
                    <div key={index} className="grid w-full justify-center">
                      <div className="flex w-full justify-center">
                        <p className="w-5/6 bg-purple-500 p-2 text-center text-white rounded-t-md transition-colors duration-200">
                          {stat.subject}
                        </p>
                      </div>
                      <svg width={circleWidth} height={circleWidth} viewBox={`0 0 ${circleWidth} ${circleWidth}`}>
                        <circle
                          cx={circleWidth / 2}
                          cy={circleWidth / 2}
                          strokeWidth="15px"
                          r={subjectRadius}
                          className="fill-none stroke-gray-200 transition-colors duration-200"
                        />
                        <circle
                          cx={circleWidth / 2}
                          cy={circleWidth / 2}
                          strokeWidth="15px"
                          r={subjectRadius}
                          className="fill-none"
                          style={{
                            strokeDasharray: subjectStatArray,
                            strokeDashoffset: subjectOffsets[index],
                          }}
                          stroke={
                            currentScores[index] <= 30 ? "#FF0000" : currentScores[index] <= 60 ? "#0075BC" : "#00AE9A"
                          }
                          transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
                        />
                        <text
                          x="50%"
                          y="50%"
                          dy="0.3em"
                          textAnchor="middle"
                          className="fill-gray-900 text-2xl font-bold transition-colors duration-200"
                        >
                          {currentScores[index]}
                        </text>
                      </svg>
                      <div className="flex w-full justify-center">
                        <table>
                          <thead>
                            <tr>
                              <th className="flex w-full justify-center">
                                <p className="w-5/6 bg-purple-500 p-2 text-white rounded-t-md transition-colors duration-200">
                                  Activities completed
                                </p>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="mb-4 h-10 w-full border-b border-gray-200 text-center">
                            <tr>
                              <td className="p-2 text-gray-900 bg-white transition-colors duration-200">
                                {currentScores[index]}
                              </td>
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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </>
  )
}

// Main component that wraps the content with ThemeProvider
export default function Score() {
  return (
    <AppLayout>
      <ScoreContent />
    </AppLayout>
  )
}

