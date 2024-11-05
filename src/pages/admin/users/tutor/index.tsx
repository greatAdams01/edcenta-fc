import { GET_TUTOR_STUDENTS } from '@/apollo/queries/admin';
import Pagination from '@/components/dashbord/Pagination';
import AdminLayout from '@/layout/AdminLayout';
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const Tutor = () => {
  const [page, setPage] = useState(1)
  const router = useRouter()
  const [students, setStudents] = useState([])
  console.log(router.query.page)

  const { data } = useQuery(GET_TUTOR_STUDENTS, {
    variables: { page, limit: 10, filter: router.query.page },
    onCompleted: (data) => {
      setStudents(data.students.data)
      console.log(data.students.data)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum)
  }


  return (
    <AdminLayout>
      <div>
        <div className='text-xl'>
          Students
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
                      Name
                    </th>
                    {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th> */}
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    {/* <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th> */}
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    {/* <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th> */}
                  </tr>
                </thead>
                {data && (
                  <tbody className="bg-white">
                    {students.map((person: any) => (
                      <tr key={person.email} className="even:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          {person.name}
                        </td>
                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td> */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.email}
                        </td>
                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.accountType}
                        </td> */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.isActive ? 'Active' : 'InActive'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
        <Pagination
          page={page}
          count={data?.users?.totalPage}
          handlePageChange={async (e) => handlePageChange(e)}
        />
      </div>
    </AdminLayout >
  );
};

export default Tutor;