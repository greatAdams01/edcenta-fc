import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { IoIosArrowBack } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '@/layout/AdminLayout';
import { CREATE_TOPIC } from '@/apollo/mutations/admin';
import { FETCH_SCHOOL_GRADES } from '@/apollo/queries/dashboard';
import { TopicType } from '../../../../../../types';

export default function Create() {
  const router = useRouter();

  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [topicSchoolGrade, setTopicSchoolGrade] = useState('');
  const [selectType, setSelectType] = useState(TopicType.NATIONAL);
  const [subjectId, setSubjectId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSubjectId(localStorage.getItem('subjectId'));
    }
  }, []);

  const { data } = useQuery(FETCH_SCHOOL_GRADES);

  console.log(data)

  const [createTopic, { loading }] = useMutation(CREATE_TOPIC, {
    variables: {
      name: topicName,
      description: topicDescription,
      schoolGrade: topicSchoolGrade,
      type: selectType,
      levelId: topicSchoolGrade,
      subjectId: subjectId,
    },
    onCompleted: () => {
      toast.success('Topic created successfully.');
      setTimeout(() => {
        if (subjectId) {
          router.push(`/admin/subjects/topics/${subjectId}`);
        }
      }, 5000);
    },
    onError: (error) => {
      toast.error('Error creating topic: ' + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!topicName || !topicDescription || !topicSchoolGrade) {
      toast.error('Please fill all required fields.');
      return;
    }

    createTopic();
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="grid justify-items-stretch">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1 text-left text-black"
        >
          <IoIosArrowBack /> <div>Back</div>
        </button>
        <div className="flex w-full justify-self-center rounded-md border-2 p-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-bold">Add Topic</h1>
                <button
                  type="submit"
                  className="rounded-md bg-blue-500 p-2 px-4 font-bold text-white"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-y-1">
                  <label htmlFor="topicName">
                    Topic name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="topicName"
                    type="text"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    className="my-2 h-12 w-full max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>

                <div className="flex flex-col gap-y-1">
                  <label htmlFor="topicDescription">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="topicDescription"
                    type="text"
                    value={topicDescription}
                    onChange={(e) => setTopicDescription(e.target.value)}
                    className="my-2 h-12 w-full max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  />
                </div>

                <div className="flex flex-col gap-y-1">
                  <label htmlFor="topicSchoolGrade">
                    School Grades <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="topicSchoolGrade"
                    value={topicSchoolGrade}
                    onChange={(e) => setTopicSchoolGrade(e.target.value)}
                    className="my-2 h-12 w-full max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  >
                    <option value="" hidden>Select grade</option>
                    {data?.schoolGrades.data.map((stage: any) => (
                      <option key={stage._id} value={stage._id}>
                        {stage.year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-y-1">
                  <label htmlFor="selectType">
                    Select type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="selectType"
                    value={selectType}
                    onChange={(e) => setSelectType(e.target.value as TopicType)}
                    className="my-2 h-12 w-full max-w-[400px] rounded-md border-2 px-4 lg:w-[100rem]"
                  >
                    <option value={TopicType.NATIONAL}>National Curriculum</option>
                    <option value={TopicType.PRIVATE}>Normal Curriculum</option>
                    <option value={TopicType.ASSESSMENT}>Assessment</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
