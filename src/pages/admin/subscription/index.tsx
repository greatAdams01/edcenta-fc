import { GET_SUBSCRIPTION } from '@/apollo/queries/admin';
import AdminLayout from '@/layout/AdminLayout';
import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';

const Subscription = () => {
  const [subs, setSubs] = useState([])
  const [getSubscription, { loading, error, data }] = useLazyQuery(GET_SUBSCRIPTION, {
    onCompleted: (data) => {
      console.log(data)
      // setPlans(data.getPlans)
    },
  })

  useEffect(() => {
    getSubscription()
  }, [])

  return (
    <AdminLayout>
      <div>
        <p className='text-xl'>Subscription</p>

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
                    {/* <th
                      scope="col"
                      className="py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th> */}
                  </tr>
                </thead>
                {/* {data && ( */}
                <tbody className="bg-white">
                  {subs.map((plan: any, index) => (
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
                      {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-3">
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
                      </td> */}
                    </tr>
                  ))}
                </tbody>
                {/* )} */}
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Subscription;