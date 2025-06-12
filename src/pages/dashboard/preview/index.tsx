import { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import Link from 'next/link';
import AppLayout from '../../../layout/AppLayout';
import { FETCH_ASSIGNED, TOPIC_QUERY } from '@/apollo/queries/dashboard';
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function Preview() {
  const { data } = useQuery(FETCH_ASSIGNED, {
    variables: { status: 'ASSIGNED' },
    fetchPolicy: "network-only",
  });

  const [topics, setTopics] = useState<{ [key: string]: string }>({});

  const [getTopic, { data: topicData }] = useLazyQuery(TOPIC_QUERY);

  useEffect(() => {
    if (data?.fetchAssigned?.data) {
      const topicIds = data.fetchAssigned.data.map((single: any) => single.worksheetId?.topicId);
      fetchTopics(topicIds);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const fetchTopics = async (topicIds: string[]) => {
    const topicPromises = topicIds.map((id) =>
      getTopic({ variables: { topicId: id } }).then((res) => ({
        id,
        name: res.data?.topic?.name,
      }))
    );

    const topicsData = await Promise.all(topicPromises);
    const topicMap = topicsData.reduce((acc, topic) => {
      if (topic.name) {
        acc[topic.id] = topic.name;
      }
      return acc;
    }, {} as { [key: string]: string });

    setTopics(topicMap);
  };

  if (!data) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#010B1ACC] dark:bg-[#00000099]">
        <div className="z-10 m-auto w-[500px] rounded-md bg-white p-6 py-12 dark:bg-gray-800 transition-colors duration-200">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                You have no subscription
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Subcribe to one of our plans</p>
              </div>
            </div>
          </div>
          <div className="mt-5 gap-x-3 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Link
              href={`/dashboard`}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600 transition-colors duration-200 sm:mt-0 sm:w-auto"
            >
              Go Back
            </Link>{" "}
            <Link
              href={`/dashboard/subscription`}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200 sm:mt-0 sm:w-auto"
            >
              View plans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <h1 className="font-bold my-auto">Assigned Activities</h1>
          <select className="border p-2 rounded-md">
            <option value="all">All</option>
            <option value="Worksheets">Worksheets</option>
            <option value="Assesment">Assesment</option>
          </select>
        </div>
        <div className="mt-4 -my-2 sm:-mx-6 lg:-mx-8">
          <table className="min-w-full divide-y divide-gray-300 mt-4">
            <thead className="font-bold">
              <tr className="text-left">
                <th scope="col" className="py-8 pl-3">Activity</th>
                <th scope="col">Topic</th>
                <th scope="col">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {data?.fetchAssigned?.data?.map((single: any, index: any) => (
                <tr key={index} className="border-y">
                  <td className="pl-3 py-6 font-bold">{single.worksheetId?.title}</td>
                  <td className="font-bold">{topics[single.worksheetId?.topicId] || '...'}</td>
                  <td>{single.worksheetId?.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
