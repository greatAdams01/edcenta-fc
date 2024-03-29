import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from '../../../layout/AppLayout';

import { USER } from '@/apollo/queries/dashboard';
import { MUTATE_USER } from '@/apollo/mutations/dashboard';
import Password from "@/components/ui/password"

function Index() {
  const { data } = useQuery(USER);
  const [updateUserInfo] = useMutation(MUTATE_USER);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [accountType, setAccountType] = useState('');
  const [bName, setBName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [change, isClicked] = useState<boolean>(false)


  useEffect(() => {
    if (data && data.user) {
      setFirstName(data.user.firstName || '');
      setLastName(data.user.lastName || '');
      setEmail(data.user.email || '');
      setPhone(data.user.phone || '');
      setAddress(data.user.address || '');
      setCity(data.user.city || '');
      setAccountType(data.user.accountType || '');
      setBName(data.user.bName || '');
      setBankName(data.user.bankName || '');
      setAccountNumber(data.user.acctNumber || '');
      setOccupation(data.user.occupation || '');
    }
  }, [data]);

  const ifClicked = () => {
    isClicked(!change)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateUserInfo({
        variables: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          accountType,
          bName,
          bankName,
          accountNumber,
          occupation,
        },
      });
      toast.success('Data updated successfully.');
      setTimeout(() =>{
        window.location.reload(); 
      }, 3000)
      
    } catch (error) {
      toast.error('Error updating data:' + error);
    }
  };

  return (
    <AppLayout>
      <div className="grid justify-items-stretch">
        <div className="w-full flex px-4 sm:px-6 lg:px-8 border-2 p-8 rounded-md justify-self-center">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full ">
              <div className="w-full flex justify-between items-center">
                <h1 className="font-bold text-lg">My Details</h1>
                <button
                  type="submit"
                  className={`bg-blue-500 rounded-md p-2 px-4 text-white font-bold`}
                >
                  Save
                </button>
              </div>

            <div className='mt-6 md:grid md:grid-cols-2 md:gap-6 justify-between'>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='First name' className='w-full'>First name <span className='text-red-500'>*</span></label>
                <input type='text' value={firstName} onChange={(event) => setFirstName(event.target?.value)} className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2'/>
              </div>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='Last name' className='w-full'>Last name <span className='text-red-500'>*</span></label>
                <input type='text' value={lastName} onChange={(event) => setLastName(event.target?.value)} className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2'/>
              </div>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='Last name' className='w-full'>Email <span className='text-red-500'>*</span></label>
                <input type='text' value={email} onChange={(event) => setEmail(event.target?.value)} className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2'/>
              </div>
              <div className='w-full flex'>
                <label htmlFor='Last name' className='w-full'>Password <span className='text-red-500'>*</span></label>
                  <a href='#' onClick={ifClicked} className='underline text-blue-500 hover:text-blue-900 w-full'>Change Password</a> 
              </div>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='Last name' className='w-full'> Contact <span className='text-red-500'>*</span></label>
                <input type='text' value={phone} onChange={(event) => setPhone(event.target?.value)} className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2'/>
              </div>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='Last name' className='w-full'>Address <span className='text-red-500'>*</span></label>
                <input type='text' value={address} onChange={(event) => setAddress(event.target?.value)} className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2'/>
              </div>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='Last name' className='w-full'>City <span className='text-red-500'>*</span></label>
                <input type='text' value={city} onChange={(event) => setCity(event.target?.value)} className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2'/>
              </div>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='Last name' className='w-full'>Account Type <span className='text-red-500'>*</span></label>
                <input type='text' value={accountType } title='Click to change account type' className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2 cursor-pointer text-gray-400'/>
              </div>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='Last name' className='w-full'>Account Name <span className='text-red-500'>*</span></label>
                <input type='text' value={bName} onChange={(event) => setBName(event.target?.value)} className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2'/>
              </div>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='Last name' className='w-full'>Bank Name <span className='text-red-500'>*</span></label>
                <input type='text' value={bankName} onChange={(event) => setBankName(event.target?.value)} className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2'/>
              </div>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='Last name' className='w-full'>Account Number <span className='text-red-500'>*</span></label>
                <input type='text' value={accountNumber} onChange={(event) => setAccountNumber(event.target?.value)} className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2'/>
              </div>
              <div className='w-full flex justify-between items-center'>
                <label htmlFor='Last name' className='w-full'>Occupation <span className='text-red-500'>*</span></label>
                <input type='text' value={ocacupation} onChange={(event) => setOccupation(event.target?.value)} className='border-2 w-[100%] lg:w-[100rem] h-12 rounded-md px-4 my-2'/>
              </div>
              </div>

               {change && <Password />}

            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </AppLayout>
  );
}

export default Index;


