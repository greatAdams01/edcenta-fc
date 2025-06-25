import { CREATE_PLAN, UPDATE_PLAN } from '@/apollo/mutations/admin';
import { GET_PLANS, SUBJECTS } from '@/apollo/queries/admin';
import AdminLayout from '@/layout/AdminLayout';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io'
import Select from 'react-select'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddPlan = () => {
  const path = useRouter()
  const [title, setTitle] = useState("")
  const [type, setType] = useState("")
  const [priceCourse, setPriceCourse] = useState(0)
  const [numOfStudents, setNumOfStudents] = useState(0)
  const [costPerStudent, setCostPerStudent] = useState(0.0)
  const [subTitle, setSubTitle] = useState("")
  const [subjects, setSubjects] = useState([])
  const [courses, setCourses] = useState<any | []>([])
  const page = useSearchParams()?.get("edit")
  const id = useSearchParams()?.get("id")

  const [createPlan, { loading }] = useMutation(CREATE_PLAN, {
    variables: {
      title,
      pricePerCourse: priceCourse,
      subTitle,
      planPrice: ( costPerStudent * numOfStudents) + (courses.length * priceCourse),
      type,
      allowedCourseList: courses.map((course: any) => course.value),
      pricePerStudent: costPerStudent,
      numberStudents: numOfStudents
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Plan created successfully.')
      setTimeout(() => {
        path.push(`/admin/plans`)
      }, 5000)
    },
    onError: (error) => {
      toast.error('Error creating Plan: ' + error)
    },
  })

  const [getPlans, { data }] = useLazyQuery(GET_PLANS, {
    onCompleted: (data) => {
      console.log(data.getPlans)
      if (id) {
        setTitle(data.getPlans[id].title)
        setType(data.getPlans[id].type)
        setCourses(data.getPlans[id].allowedCourseList)
        setPriceCourse(data.getPlans[id].pricePerCourse)
        setSubTitle(data.getPlans[id].subTitle)
      }
    },
  })

  useEffect(() => {
    getPlans()
  }, [getPlans])

  const [updatePlan] = useMutation(UPDATE_PLAN, {
    variables: {
      updatePlanId: page,
      title,
      pricePerCourse: priceCourse,
      subTitle,
      planPrice: ( costPerStudent * numOfStudents) + (courses.length * priceCourse),
      type,
      allowedCourseList: courses.map((course: any) => course.value),
      pricePerStudent: costPerStudent,
      numberStudents: numOfStudents
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Plan updated successfully.')
      setTimeout(() => {
        path.push(`/admin/plans`)
      }, 5000)
    },
    onError: (error) => {
      console.log(error)
      toast.error('Error updating Plan: ' + error)
    },
  })

  const [getSubjects] = useLazyQuery(SUBJECTS, {
    variables: { page: 1, limit: 10, filter: "" },
    onCompleted: (data) => {
      console.log(data.subjects.data)
      setSubjects(data.subjects.data)
    },
  })

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (title === '') {
      console.log('Title field cannot be empty')
      toast.error('Title field cannot be empty')
      return
    }
    if (type === '') {
      console.log('Type field cannot be empty')
      toast.error('Type field cannot be empty')
      return
    }

    if (subTitle === '') {
      console.log('Sub Title field cannot be empty')
      toast.error('Sub Title field cannot be empty')
      return
    }
    if (subjects.length < 1) {
      console.log('Subjects field cannot be empty')
      toast.error('Subjects field cannot be empty')
      return
    }
    // Check if any body item is empty

    if (page !== null) {
      updatePlan()
      return
    }
    createPlan()
  }

  const formattedOptions = subjects.map((option: any) => ({ value: option._id, label: option.name }));


  useEffect(() => {
    getSubjects()
  }, [getSubjects])

  return (
    <AdminLayout>
      <div>
        <div className='flex justify-between'>
          <button
            onClick={() => path.back()}
            className="mb-6 flex items-center gap-1 text-left text-black"
          >
            <IoIosArrowBack /> <div>Back</div>
          </button>
          <button onClick={(e) => handleSubmit(e)} className='p-3 bg-indigo-500 px-6 text-white rounded-md'>{loading ? 'loading' : page !== null ? 'Update' : 'Create'}</button>
        </div>
        <div className="mb-2 mt-6 items-start justify-between md:grid md:grid-cols-2 md:gap-6">
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label htmlFor="title" className="w-full">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target?.value)}
              className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
            />
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label htmlFor="sub" className="w-full">
              Sub Title <span className="text-red-500">*</span>
            </label>
            <input
              id="sub"
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target?.value)}
              className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
            />
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label htmlFor="course" className="w-full">
              Price Per Course <span className="text-red-500">*</span>
            </label>
            <input
              id="course"
              type="number"
              value={priceCourse}
              onChange={(e) => setPriceCourse(parseInt(e.target?.value))}
              className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
            />
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label htmlFor="perStudent" className="w-full">
              Price Per Student <span className="text-red-500">*</span>
            </label>
            <input
              id="perStudent"
              type="number"
              value={costPerStudent}
              onChange={(e) => setCostPerStudent(parseFloat(e.target?.value))}
              className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
            />
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label htmlFor="numStudnet" className="w-full">
              Number of Student <span className="text-red-500">*</span>
            </label>
            <input
              id="numStudnet"
              type="number"
              value={numOfStudents}
              onChange={(e) => setNumOfStudents(parseFloat(e.target?.value))}
              className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
            />
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label htmlFor="type" className="w-full">
              Type <span className="text-red-500">*</span>
            </label>
            <select onChange={(e) => setType(e.target.value)} id="type" value={type} className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"            >
              <option className='hidden' value="">Select type</option>
              <option value="PARENT">Parent</option>
              <option value="TUTOR">Tutor</option>
              <option value="SCHOOL">School</option>
            </select>
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label htmlFor="type" className="w-full">
              Courses <span className="text-red-500">*</span>
            </label>
            <Select isMulti onChange={e => { setCourses(e) }}
              isClearable={true}
              value={courses}
              isSearchable={true}
              className='w-full' options={formattedOptions} />
          </div>
        </div>
        <div className='pt-5'>
          <p className='font-bold'>Plan cost: NGN { ( costPerStudent * numOfStudents) + (courses.length * priceCourse) } </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddPlan;