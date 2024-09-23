import { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client'; // Use `useLazyQuery` to trigger queries conditionally
import Link from 'next/link';
import AppLayout from '../../../layout/AppLayout';
import { FETCH_ASSIGNED, TOPIC_QUERY } from '@/apollo/queries/dashboard';


export default function Preview() {
  const { data } = useQuery(FETCH_ASSIGNED, {
    variables: { status: 'ASSIGNED' },
  });
  console.log(data)

  const [topics, setTopics] = useState<{ [key: string]: string }>({});

  const [getTopic, { data: topicData }] = useLazyQuery(TOPIC_QUERY);

  useEffect(() => {
    if (data?.fetchAssigned?.data) {
      // Fetch topics only when data is available
      const topicIds = data.fetchAssigned.data.map((single: any) => single.worksheetId?.topicId);
      fetchTopics(topicIds);
    }
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
                {/* <th scope="col">Subject</th> */}
                <th scope="col">Topic</th>
                <th scope="col">Difficulty</th>
                {/* <th scope="col">Year</th> */}
              </tr>
            </thead>
            <tbody>
              {data?.fetchAssigned?.data?.map((single: any, index: any) => (
                <tr key={index} className="border-y">
                  <td className="pl-3 py-6 font-bold">{single.worksheetId?.title}</td>
                  {/* <td>Mathematics</td> */}
                  <td className="font-bold">{topics[single.worksheetId?.topicId] || '...'}</td>
                  <td>{single.worksheetId?.difficulty}</td>
                  {/* <td>4</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
