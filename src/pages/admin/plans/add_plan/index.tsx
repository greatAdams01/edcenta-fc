import { CREATE_PLAN } from '@/apollo/mutations/admin';
import { SUBJECTS } from '@/apollo/queries/admin';
import AdminLayout from '@/layout/AdminLayout';
import { useLazyQuery, useMutation } from '@apollo/client';
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
  const [price, setPrice] = useState(0.0)
  const [freePrice, setFreePrice] = useState(0.0)
  const [subTitle, setSubTitle] = useState("")
  const [subjects, setSubjects] = useState([])
  const [courses, setCourses] = useState<any | []>([])

  const [createPlan, { loading }] = useMutation(CREATE_PLAN, {
    variables: {
      title,
      pricePerCourse: priceCourse,
      priceOfFreeTrial: freePrice,
      subTitle,
      planPrice: freePrice,
      type,
      allowedCourseList: courses.map((course: any) => course.value)
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


    createPlan()
  }

  const formattedOptions = subjects.map((option: any) => ({ value: option._id, label: option.name }));


  useEffect(() => {
    getSubjects()
  }, [])

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
          <button onClick={(e) => handleSubmit(e)} className='p-3 bg-indigo-500 px-6 text-white rounded-md'>{loading ? 'loading' : 'Create'}</button>
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
            <label htmlFor="free" className="w-full">
              Price of Free Trial <span className="text-red-500">*</span>
            </label>
            <input
              id="free"
              type="number"
              value={freePrice}
              onChange={(e) => setFreePrice(parseFloat(e.target?.value))}
              className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
            />
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label htmlFor="price" className="w-full">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target?.value))}
              className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
            />
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-y-1">
            <label htmlFor="type" className="w-full">
              Type <span className="text-red-500">*</span>
            </label>
            <select onChange={(e) => setType(e.target.value)} id="type" className="my-2 h-12 w-[100%] max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"            >
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
              isSearchable={true}
              className='w-full' options={formattedOptions} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddPlan;