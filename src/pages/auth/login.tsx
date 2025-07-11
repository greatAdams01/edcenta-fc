'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSession, signIn, signOut } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCookie } from 'cookies-next';
import { getCookie } from 'cookies-next';
import { useMutation } from '@apollo/client';
import { Eye, EyeOff } from 'lucide-react';

import { LOGIN, STUDENT_LOGIN } from '@/apollo/mutations/auth';

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const authData: any = getCookie('Authdata');

  const [login, { loading }] = useMutation(LOGIN, {
    variables: {
      email,
      password,
    },
    onCompleted: (data) => {
      console.log(data);
      setCookie('token', data.login.token);
      setCookie('Authdata', JSON.stringify(data.login));
      // If accountType is ADMIN, SUPERADMIN and MODERATOR redirect to /admin
      if(data.login.accountType === 'ADMIN' || data.login.accountType === 'SUPERADMIN' || data.login.accountType === 'MODERATOR'){
        router.push('/admin/');
      } else {
        router.push('/dashboard/');
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  const [studentLogin] = useMutation(STUDENT_LOGIN, {
    variables: {
      username: email,
      password,
    },
    onCompleted: (data) => {
      console.log(data);
      setCookie('token', data.loginStudent.token);
      setCookie('Authdata', JSON.stringify(data.loginStudent));
      router.push('/dashboard/');
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (authData) {
      // Check if user is already logged in and redirect appropriately
      try {
        const parsedAuthData = JSON.parse(authData);
        
        // Validate that the auth data has required fields
        if (parsedAuthData && parsedAuthData.accountType && parsedAuthData._id) {
          if (parsedAuthData.accountType === 'ADMIN' || parsedAuthData.accountType === 'SUPERADMIN' || parsedAuthData.accountType === 'MODERATOR') {
            router.push('/admin/');
          } else {
            router.push('/dashboard/');
          }
        } else {
          // Invalid auth data, clear it and stay on login page
          console.log('Invalid auth data, clearing cookies');
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'Authdata=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
        // Clear corrupted auth data
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'Authdata=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      return;
    }

    if(session){
      router.push('/tutor/');
    }
  }, [isClient, authData, session, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email === '' || password === '') {
      toast.error('Invalid credentials');
      return;
    }
    setLoading(true);
    isStudent ? studentLogin() : login();

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  

  return (
    <>
      <div className={` w-full flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 `}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href={'/'} className="cursor-pointer">
            <Image
              className="mx-auto h-10 w-16"
              src="/logo.png"
              alt="EdCenta"
              width={100}
              height={100}
            />
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  {isStudent ? 'Student Username' : 'Email Address'}
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type={isStudent ? 'text' : 'email'}
                    value={email}
                    onChange={(event) => setEmail(event.target?.value)}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(event) => setPassword(event.target?.value)}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    onChange={() => setIsStudent(!isStudent)}
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                    Are you a Student?
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a href={'/auth/request_reset'} className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
              {Loading ? (
                <div className="flex w-full justify-center rounded-md border-2 border-indigo-600  px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm  cursor-progress">
                  <Image src="/loader.gif" alt="loader" className="w-6 rotating-loader" width={24} height={24} />

                </div>
                ) : (
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 p2"
                  >
                    Login
                  </button>
                )}
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
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                  <span onClick={() => signIn()} className="text-sm font-semibold leading-6">Google</span>
                </a>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{''}
            <Link href={'/auth/signup'} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-2">
              Create account
            </Link>
          </p>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
