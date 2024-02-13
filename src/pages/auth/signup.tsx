'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { manrope } from '@/utils/font';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCookie } from 'cookies-next'
import { useMutation } from '@apollo/client'

import { SIGNUP } from '@/apollo/mutations/auth'

export default function Signup() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [bName, setBName] = useState('');
  const [bankName, setAccountName] = useState('')
  const [acctNumber, setAcctNumber] = useState('');
  const [bank, setBank] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [occupation, setOccupation] = useState('');
  const [accountType, setAccountType] = useState('');
  const [password, setPassword] = useState('');

  const path = useRouter();

  const [signup, { loading }] = useMutation(SIGNUP, {
    variables: {
      input:{
      firstName,
      lastName,
      email,
      phone,
      bName,
      bankName,
      acctNumber,
      bank,
      bankCode,
      occupation,
      accountType,
      password
      }
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Account created successfully')
      // setCookie('token', data.login.token);
      setTimeout(() =>{
        path.push('/auth/login')
      },5000)
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    if (firstName === ''){

      console.log('First name field cannot empty');
      toast.error('First name field cannot be empty');
      return;
    }
    if (lastName === ''){
      console.log('Last name field cannot be empty');
      toast.error('Last name field cannot be empty');
      return;
    }
    if (email === ''){
      console.log('Enter a valid email address');
      toast.error('Enter a valid email address');
      return;
    }
    if(phone === ''){
      console.log('Enter a valid phone number')
      toast.error('Enter a valid phone number')
    }
    if(bName === ''){
        console.log('Enter a business name')
        toast.error('Enter a business name')
    }
    if(bankName === ''){
      console.log('Enter your account name')
      toast.error('Enter your account name')
    }
    if(acctNumber === ''){
      console.log('Add your account number')
      toast.error('Add your account number')
    }
    if(bank === ''){
      console.log('Bank name field cannot be empty')
      toast.error('Bank name field cannot be empty')
    }
    if(bankCode === ''){
      console.log('Enter a valid bank code')
      toast.error('Enter a valid bank code')
    }
    if(occupation === ''){
      console.log('Occupation is required')
      toast.error('Occupation is required')
    }
    if (!accountType) {
      console.log('Please select an Account type');
      toast.error('Please select an Account type');
      return;
    }
    if (password !== conPassword) {
      console.log('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password)) {
      console.log('Password must be at least 8 characters long and contain at least one capital letter');
      toast.error('Password must be at least 8 characters long and contain at least one capital letter');
      return;
    }
    signup()
  };

  return (
    <>
      <div className={`${manrope.className} w-full flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8`}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href={'/'} className='cursor-pointer'>
            <Image
              className="mx-auto h-10 w-16"
              src="/logo.png"
              alt="EdCenta"
              width={100}
              height={100}
            />
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                  First name
                </label>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target?.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target?.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2 "
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target?.value)}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                  Phone number
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="phone"
                    value={phone}
                    onChange={(event) => setPhoneNumber(event.target?.value)}
                    autoComplete="phone"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bName" className="block text-sm font-medium leading-6 text-gray-900">
                  Business name
                </label>
                <div className="mt-2">
                  <input
                    id="bName"
                    name="bName"
                    type="bName"
                    value={bName}
                    onChange={(event) => setBName(event.target?.value)}
                    autoComplete="bName"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bankName" className="block text-sm font-medium leading-6 text-gray-900">
                  Account name
                </label>
                <div className="mt-2">
                  <input
                    id="bankName"
                    name="bankName"
                    type="bankName"
                    value={bankName}
                    placeholder='Mr. John Doe'
                    onChange={(event) => setAccountName(event.target?.value)}
                    autoComplete="bankName"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="acctName" className="block text-sm font-medium leading-6 text-gray-900">
                  Account Number
                </label>
                <div className="mt-2">
                  <input
                    id="acctNumber"
                    name="acctNumber"
                    type="acctNumber"
                    value={acctNumber}
                    onChange={(event) => setAcctNumber(event.target?.value)}
                    autoComplete="acctNumber"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bank" className="block text-sm font-medium leading-6 text-gray-900">
                  Bank Name
                </label>
                <div className="mt-2">
                  <input
                    id="bank"
                    name="bank"
                    type="bank"
                    value={bank}
                    onChange={(event) => setBank(event.target?.value)}
                    autoComplete="bank"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bankCode" className="block text-sm font-medium leading-6 text-gray-900">
                  Bank Code
                </label>
                <div className="mt-2">
                  <input
                    id="bankCode"
                    name="bankCode"
                    type="bankCode"
                    value={bankCode}
                    onChange={(event) => setBankCode(event.target?.value)}
                    autoComplete="bankCode"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="occupation" className="block text-sm font-medium leading-6 text-gray-900">
                  Occupation
                </label>
                <div className="mt-2">
                  <input
                    id="occupation"
                    name="occupation"
                    type="occupation"
                    value={occupation}
                    onChange={(event) => setOccupation(event.target?.value)}
                    autoComplete="occupation"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Sign up as
                </label>
                <div className='flex justify-between w-3/5'>
                  <div className='flex'>
                    <input type='radio' id='owner' name='accountType' value='OWNER' className='mr-2' onChange={(event) => setAccountType(event.target.value)} /> <p>Owner</p>
                  </div>
                  <div className='flex'>
                    <input type='radio' id='tutor' name='accountType' value='TUTOR' className='mr-2' onChange={(event) => setAccountType(event.target.value)} /> <p>Tutor</p>
                  </div>
                  <div className='flex'>
                    <input type='radio' id='parent' name='accountType' value='PARENT' className='mr-2' onChange={(event) => setAccountType(event.target.value)} /> <p>Parent</p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target?.value)}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="conPassword" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="conPassword"
                    name="conPassword"
                    type="password"
                    value={conPassword}
                    onChange={(event) => setConPassword(event.target?.value)}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                    Remember me
                  </label>
                </div>
              </div>

              <div>
              <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 p-2"
                >
                  Sign up
                </button>
              </div>
            </form>

            <div>
              <div className="relative mt-10">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6">Google</span>
                </a>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Have an account?{' '}
            <Link href={'/auth/login'} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-2">
              Login
            </Link>
          </p>
        </div>
          <ToastContainer />
      </div>
    </>
  );
}