import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { STUDENTS } from '@/apollo/queries/dashboard'
import AppLayout from '@/layout/AppLayout'
import { statData } from '@/utils/nav'

export default function Score() {
  const { data } = useQuery(STUDENTS)
  const students = data?.students.data || []
  const [currentScores, setCurrentScores] = useState(statData.map((stat) => 0))

  useEffect(() => {
    const incrementScores = () => {
      const newScores = currentScores.map((score, index) => {
        const targetScore = statData[index].score
        let step = 0
        step++
        const newScore = score + step
        return newScore >= targetScore ? targetScore : newScore
      })

      setCurrentScores(newScores)
      if (newScores.some((score, index) => score < statData[index].score)) {
        requestAnimationFrame(incrementScores)
      }
    }

    incrementScores()
  }, [currentScores])

  const totalScore = currentScores.reduce((sum, score) => sum + score, 0)

  const circleWidth = 200
  const radius = 90
  const statArray = radius * Math.PI * 2
  const estimatedPercentage = (totalScore / (statData.length * 100)) * 100
  const statOffset = statArray - (statArray * estimatedPercentage) / 100

  const subjectRadius = 65
  const subjectStatArray = subjectRadius * Math.PI * 2
  const subjectOffsets = statData.map((stat, index) => {
    const subjectStatOffset =
      subjectStatArray - (subjectStatArray * currentScores[index]) / 100
    return subjectStatOffset
  })

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="w-full justify-self-center rounded-md border-2 p-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-bold">Scores</h1>
          <section className="my-4 flex w-full justify-between">
            <select className="w-60 rounded-md border border-black px-2 py-4">
              {students.map((student: any) => (
                <option
                  key={student}
                  value={student.name}
                  className="font-bold"
                >
                  {student.name}
                </option>
              ))}
            </select>
          </section>

          <section className="grid gap-x-32 font-bold md:flex">
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
              <div className="grid w-full grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] gap-x-10 border p-6 md:w-[50vw]">
                {statData.map((stat, index) => (
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
        </div>
      </div>
    </AppLayout>
  )
}
