'use client'
import { useRef, useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { Eye, EyeOff } from 'lucide-react';

import { RESET } from '@/apollo/mutations/auth';
import Sucess from '@/components/ui/resetSucess'

const Reset = () => {
  const route = useRouter();
  const [password, setNewPassword] = useState('');
  const [conPassword, setConNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [conShowPassword, setConShowPassword] = useState(false); 
  const [showSucess, setShowSucess] = useState(false); 
  const [inputs, setInputs] = useState<Array<string>>(['', '', '', '']);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleInputChange = (index: number, value: string) => {
    if (!isNaN(Number(value))) {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);

      if (value !== '' && index < inputs.length - 1) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const [newPassword, { loading }] = useMutation(RESET, {
    variables: {
      inputs,
      password
    },
    onCompleted: (data) => {
      if (data) {
        toast.success('Password reset successfully');
        setShowSucess(true); 
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8 || !/[A-Z]/.test(password)) {
        console.log('Password must be at least 8 characters long and contain at least one capital letter');
        toast.error('Password must be at least 8 characters long and contain at least one capital letter');
        return;
      }

    if(password !== conPassword){
        toast.error('Passwords do not match')
        return;
    }
    newPassword();
  };

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setConShowPassword(!conShowPassword);
  };

  return (
    <div className={` w-full flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 `}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a new password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <form className="space-y-2" onSubmit={handleSubmit}>

        <div className="mt-2 flex items-center space-x-2">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 mr-4">
              Input OTP
            </label>
            {inputs.map((input, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={input}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-10 h-10 text-center border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            ))}
          </div>
          <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  New password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(event) => setNewPassword(event.target?.value)}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm new password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="conPassword"
                    type={conShowPassword ? 'text' : 'password'} 
                    value={conPassword}
                    onChange={(event) => setConNewPassword(event.target?.value)}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={togglePasswordVisibility2}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>
              </div>

          <button
            type="submit"
            className="mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 p2"
          >Create new password</button>
        </form>
      </div>  
      </div>
      </div>
      <ToastContainer />
      {showSucess && <Sucess />}
    </div>
  );
}

export default Reset;
