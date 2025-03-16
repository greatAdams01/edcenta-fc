import { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import Link from 'next/link';
import AppLayout from '../../../layout/AppLayout';
import { FETCH_ASSIGNED, TOPIC_QUERY } from '@/apollo/queries/dashboard';
import { convertTimestampToDate } from '@/utils/convertDate';

interface Grade {
  _id: string;
  stage: number;
  year: string;
  ages: string;
  subject: {
    _id: string;
    name: string;
    worksheet: {
      _id: string;
      title: string;
      levelId: string;
    }[];
    topics: {
      _id: string;
      name: string;
      levelId: string;
    }[];
  }[];
}

export default function Review() {
  const { data } = useQuery(FETCH_ASSIGNED, {
    variables: { status: "DONE" },
  })
  const [topics, setTopics] = useState<{ [key: string]: string }>({});

  const [getTopic, { data: topicData }] = useLazyQuery(TOPIC_QUERY);

  useEffect(() => {
    if (data?.fetchAssigned?.data) {
      // Fetch topics only when data is available
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
  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className='font-bold '>Completed Activities</h1>
        <div className='mt-4 -my-2 sm:-mx-6 lg:-mx-8'>
          <table className='min-w-full divide-y devide-gray-300 mt-4'>
            <thead className='font-bold'>
              <tr className=''>
                <th scope='col' className='py-8'>Activity</th>
                {/* <th scope='col'>Subject</th> */}
                <th scope='col'>Topic</th>
                {/* <th scope='col'>Level</th>
                <th scope='col'>Year</th> */}
                <th scope='col'>Date</th>
                <th scope='col'>Score</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {data?.fetchAssigned.data && data.fetchAssigned.data.length >= 1 ? data.fetchAssigned.data.map((single: any, index: number) => <tr key={index} className=' border-y'>
                <td className='pl-3 py-6 font-bold'>{single.worksheetId?.title}</td>
                {/* <td>Mathematics</td> */}
                <td className="font-bold">{topics[single.worksheetId?.topicId] || '...'}</td>
                {/* <td></td>
                <td></td> */}
                <td>{convertTimestampToDate(single.createdAt)}</td>
                <td>{single.score}</td>
              </tr>) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
