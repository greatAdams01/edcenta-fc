import { DELETE_PLAN } from '@/apollo/mutations/admin';
import { GET_PLANS } from '@/apollo/queries/admin';
import ModalAuth from '@/components/ModalComp';
import AdminLayout from '@/layout/AdminLayout';
import { showToast } from '@/utils/toast'
import { useLazyQuery, useMutation } from '@apollo/client';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import router from 'next/router';
import React, { useEffect, useState } from 'react';

const Plans = () => {
  const [plans, setPlans] = useState([])
  const [open, setOpen] = useState(false)
  const [itemId, setItemId] = useState('')

  const [getPlans, { loading, error, data }] = useLazyQuery(GET_PLANS, {
    onCompleted: (data) => {
      // console.log(data.getPlans)
      setPlans(data.getPlans)
      // setSubjects(data.subjects.data)
    },
  })

  const [deletePlan, deleteStatus] = useMutation(DELETE_PLAN, {
    variables: {
      id: itemId,
    },
    onCompleted: (data) => {
      console.log(data)
      showToast('success', 'Plan deleted')
      // reload the page
      window.location.reload()
    },
    onError: (error) => {
      showToast('error', error.message)
      // setLoading(false);
    },
  })
  useEffect(() => {
    getPlans()
  }, [])
  return (
    <AdminLayout>
      <div>
        <div className='flex justify-between'>
          <div>
            <p className='text-xl'>Plans</p>
            <p>A list of all the plans available in the platform.</p>
          </div>
          <Link href={'/admin/plans/add_plan'}>
            <button className='p-2 bg-indigo-500 rounded-md text-white px-6'>New Plan</button>
          </Link>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      S/N
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Code
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Course Count
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                {/* {data && ( */}
                <tbody className="bg-white">
                  {plans.map((plan: any, index) => (
                    <tr key={plan._id} className="even:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {plan.title}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {plan.planPrice}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {plan.planCode}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {plan.allowedCourseList.length}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-3">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => { }}
                        >
                          Edit
                        </a>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-3">
                        <a
                          href="#"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => { setItemId(plan._id), setOpen(true) }}
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* )} */}
              </table>
            </div>
          </div>
        </div>
        <ModalAuth
          isOpen={open}
          XIcon={true}
          onClose={() => (setOpen(false))}
          styling={'w-[500px] m-auto'}
        >
          <>
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Delete Plan
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this Plan?
                     All
                    of {`it's`} data will be permanently removed from our
                    servers forever. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={deleteStatus.loading}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={() => deletePlan()}
              >
                Delete
              </button>
              <button
                type="button"
                disabled={deleteStatus.loading}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </>

        </ModalAuth>
      </div>
    </AdminLayout>
  );
};

export default Plans;