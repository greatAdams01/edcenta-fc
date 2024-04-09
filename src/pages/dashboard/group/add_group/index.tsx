import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from '@/layout/AppLayout';

import { USER } from '@/apollo/queries/dashboard'

import { CREATE_STUDENT } from '@/apollo/mutations/dashboard';

export default function Create() {

    const { data } = useQuery(USER)
    const User = data?.USER || []

    const path = useRouter();

    const [name, setName] = useState('');
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [grade, setGrade] = useState('');
    const [creatorId, setCreatorId] = useState('');

    useEffect(() => {
      if (data && data.user) {
        setCreatorId(data.user._id || '')
      }
    },[data])

    const [createStudent, { loading }] = useMutation(CREATE_STUDENT, {
        variables: {
          input: {
            name,
            username,
            email,
            password,
            age: parseInt(age),
            grade,
            creatorId,
          },
        },
        onCompleted: (data) => {
            console.log(data)
            toast.success('Student created successfully.');
            setTimeout(() =>{
              path.push('/dashboard/group')
            },5000)
          },
          onError: (error) => {
            toast.error('Error creating student: ' + error);
          }
        })
  
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (name === ''){
        console.log('Student name field cannot empty');
        toast.error('Student name field cannot empty');
        return;
      }
      if (username.trim() === ''){
        console.log('UserName field cannot be empty');
        toast.error('UserName field cannot be empty');
        return;
      }
      if (username.includes(' ')) {
        console.log('Username cannot contain spaces');
        toast.error('Username cannot contain spaces');
        return;
      }
      if (email === ''){
        console.log('Enter a valid email address');
        toast.error('Enter a valid email address');
        return;
      }
      if(password === ''){
        console.log('Password field cannot be empty')
        toast.error('Password field cannot be empty')
        return;
      }
     
      if (age === '') {
        console.log('Identify an Age');
        toast.error('Identify an Age')
        return;
      }

      if (!grade) {
        console.log('Please add grade');
        toast.error('Please add grade');
        return;
      }
      createStudent()
    };


  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="w-full flex px-4 sm:px-6 lg:px-8 border-2 p-8 rounded-md justify-self-center">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full ">
              <div className="w-full flex justify-between items-center">
                <h1 className="font-bold text-lg">Add Group</h1>
                <button
                  type="submit"
                  className={`bg-blue-500 rounded-md p-2 px-4 text-white font-bold`}
                >
                  Create
                </button>
              </div>
            <div className='w-full md:w-4/6 mt-6 md:grid gap-6 items-center'>
                
                <div className='flex my-2'>
                <label htmlFor='status' className='w-full flex'>Status <span className='text-red-500'>*</span></label>
                <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                </label>
                </div>

                <div className='w-full flex justofy-between my-2'>  
                <label htmlFor='name' className='w-full md:w-[10rem] flex'>Name <span className='text-red-500'>*</span></label>
                <input type='text' value={username} onChange={(e) => setUserName(e.target?.value)} className='border-2 w-full h-12 rounded-md px-4 my-2 mx-4'/>
                </div>
                <div className='w-full  flex justofy-between my-2'>
                <label htmlFor='description' className='w-full md:w-[10rem] flex'>Desciption</label>
                <textarea value={email} onChange={(e) => setEmail(e.target?.value)} className='border-2 w-full h-40 rounded-md px-4 my-2 mx-4'/>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </AppLayout>
  )
}
