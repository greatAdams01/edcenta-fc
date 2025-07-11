import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  TrophyIcon,
  ChartBarIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const router = useRouter();
  const authData: any = getCookie('Authdata');
  const [student, setStudent] = React.useState<any>(null);

  React.useEffect(() => {
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setStudent(parsed);
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
  }, [authData]);

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'Authdata=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/auth/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
    { name: 'My Courses', href: '/student/courses', icon: BookOpenIcon },
    { name: 'Assignments', href: '/student/assignments', icon: AcademicCapIcon },
    { name: 'Progress', href: '/student/progress', icon: ChartBarIcon },
    { name: 'Achievements', href: '/student/achievements', icon: TrophyIcon },
    { name: 'Study Timer', href: '/student/timer', icon: ClockIcon },
    { name: 'Profile', href: '/student/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="EdCenta"
                  width={40}
                  height={40}
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">EdCenta</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {student && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {student.name?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {student.name || 'Student'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 px-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <h3 className="text-sm font-medium mb-2">Today&apos;s Goal</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">85%</span>
                <StarIcon className="h-6 w-6" />
              </div>
              <p className="text-xs opacity-90 mt-1">Keep going!</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
} 