import React from 'react';
import { GetServerSideProps } from 'next';
import { classes } from '@/utils/nav';
import Link  from 'next/link';

interface ClassData {
  subjects: {
    _id: string;
    name: string;
    year: string;
    Topic: {
      name: string;
      worksheet: string;
      assessment: string;
    }[];
  }[];
}

interface RouteParams {
  _id: string;
}

const editAssign = ({ data }: { data: ClassData }) => {
  const { subjects } = data;

  const subjectNames = subjects.map(subject => subject.name);
  const subjectYear = subjects.map(subject => subject.year);

  return (
    <div className='p-4'>
      <form>
        <div className='flex w-full'>
          <div className='flex px-3 w-full py-3.5 bg-green-500 text-white font-bold'>
          {subjectNames.map((name, index) => (
              <h1 key={index} className='mr-2'>{name}</h1>
            ))} 
          {subjectYear.map((year, index) => (
              <h1 key={index}>Year {year} activities</h1>
            ))}
          </div>
          <div className="flex mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
              href={'/dashboard/assign'}
              type="button"
              className="flex items-center justify-center rounded-md bg-red-600 hover:bg-red-400 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mr-4"
            >
              Cancel
            </Link>
            <button
              type="button"
              className="block rounded-md bg-blue-600 hover:bg-blue-400 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Save
            </button>
        </div>
        </div>

        <div className=''>
        <table className="min-w-full divide-y divide-gray-300">
                <thead className='ml-4'>
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                        Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                      Worksheet
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                      Assessment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subjects.map(subject => (
                    <React.Fragment key={subject._id}>
                      {subject.Topic?.map(topic => (
                        <tr key={topic.name}>
                          <td className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"> <Link href={'#'} className='hover:text-green-500 hover:underline'>{topic.name}</Link></td>
                          <td className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{topic.worksheet}</td>
                          <td className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{topic.assessment}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>

              </table>
        </div>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params || {};

  if (id) {
    for (const classItem of classes) {
      const subject = classItem.subjects.find(subject => subject._id === id);
      if (subject) {
        return {
          props: {
            data: { subjects: [subject] }, 
          },
        };
      }
    }
  }
  
  return {
    notFound: true,
  };
};

export default editAssign
