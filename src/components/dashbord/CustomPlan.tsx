import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { showToast } from '@/utils/toast'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Select from 'react-select'
import { CUSTOM_PLAN } from '@/apollo/mutations/dashboard'
import { SUBJECTS } from '@/apollo/queries/admin'
import { GET_PRICE } from '@/apollo/queries/dashboard'

const CustomPlan = () => {
  const [students, setStudents] = useState(0)
  const [courses, setCourses] = useState<any | []>([])
  const [subjects, setSubjects] = useState([])
  const [totalCost, setTotalCost] = useState(0)
  const { data: priceData } = useQuery(GET_PRICE)

  useEffect(() => {
    if (priceData) {
      console.log('Price per student:', priceData.getPricePerStudent)
    }
  }, [priceData])

  const [customPlan, { loading }] = useMutation(CUSTOM_PLAN, {
    variables: {
      allowedCourseList: courses.map((course: any) => course.value),
      numberOfStudents: students,
    },
    onCompleted: (data) => {
      console.log(data)
      if (
        data.subscribeToCustomPlan &&
        data.subscribeToCustomPlan.authorization_url
      ) {
        window.location.href = data.subscribeToCustomPlan.authorization_url
      }
    },
    onError: (error) => {
      showToast('error', error.message)
      console.log(error)
      // setLoading(false);
    },
  })
  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (courses.length === 0) {
      console.log('Courses cannot be empty')
      toast.error('Courses cannot be empty')
      return
    }
    if (students === 0) {
      console.log('Number of Students must be given')
      toast.error('Number of Students must be given')
      return
    }

    customPlan()
  }
  const [getSubjects] = useLazyQuery(SUBJECTS, {
    variables: { page: 1, limit: 10, filter: '' },
    onCompleted: (data) => {
      console.log(data.subjects.data)
      setSubjects(data.subjects.data)
    },
  })
  const formattedOptions = subjects.map((option: any) => ({
    value: option._id,
    label: option.name,
  }))
  useEffect(() => {
    getSubjects()
  }, [])
  useEffect(() => {
    const studentCost = students * 4
    setTotalCost(studentCost)
  }, [students, courses])
  return (
    <div>
      <h2 className="mt-8">Edit Subject</h2>
      <form className="w-[800px]">
        <div className="flex space-x-5">
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label htmlFor="type" className="w-full">
              Courses <span className="text-red-500">*</span>
            </label>
            <Select
              id="type"
              isMulti
              onChange={(e) => {
                setCourses(e)
              }}
              isClearable={true}
              value={courses}
              isSearchable={true}
              className="w-full"
              options={formattedOptions}
            />
          </div>
        </div>
        <div className="mt-5 flex space-x-5">
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label
              htmlFor="students"
              className="text-md block font-medium leading-6 text-gray-900"
            >
              Number of students
            </label>
            <div className="mt-2">
              <input
                id="students"
                type="number"
                value={students}
                onChange={(e) => setStudents(parseInt(e.target?.value))}
                className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-lg">Estimated Fee: ₦{totalCost}</p>
        </div>
        <button
          type="button"
          className="mt-5 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto"
          onClick={(e) => handleSave(e)}
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}

export default CustomPlan
