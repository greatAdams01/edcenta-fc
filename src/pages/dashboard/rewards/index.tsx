import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ASSIGNMENTS, STUDENTS } from '@/apollo/queries/dashboard'
import AppLayout from '@/layout/AppLayout'
import { BsBarChartFill } from 'react-icons/bs'
import { GiTrophy } from 'react-icons/gi'
import { USER_FULLNAME, STUDENT_NAME } from '@/apollo/queries/auth'
import { deleteCookie, getCookie } from 'cookies-next'

export default function Rward() {
  const { data } = useQuery(STUDENTS)
  const students = data?.students.data || []
  const [assignmentList, setAssignmentList] = useState<any[]>([])
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
      },
      onError: (error) => {
        console.log('Error:', error)
      },
    },
  )

  useEffect(() => {
    console.log('assignmentList', assignmentList)
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
  }, [getAssignments, student, user])

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="w-full justify-self-center rounded-md">
          <h1 className="mb-8 text-xl font-semibold text-gray-900">
            {fullName}
          </h1>
          <div className="mb-8 flex w-full items-center justify-between gap-x-3 bg-[#00AE9A] bg-opacity-20 p-2">
            <div className="flex w-full items-center justify-start gap-x-3">
              <GiTrophy />
              <h2 className="text-lg font-semibold leading-6 text-gray-700">
                Rewards
              </h2>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
