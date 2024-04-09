import {
    CalendarIcon,
    UsersIcon,
    ClipboardDocumentCheckIcon
  } from '@heroicons/react/24/outline'

  export const navigation = [
    { 
      name: 'ACTIVITIES', 
      href: '/dashboard', 
      icon: CalendarIcon,
      children: [
        { name: 'My Dashboard', href: '/dashboard' },
        { name: 'Browse and Assign', href: '/dashboard/assign' },
        { name: 'Preview assigned', href: '/dashboard/preview' },
        { name: 'Review completed', href: '/dashboard/review' },
      ]
    },
    { 
      name: 'PROGRESS', 
      href: '#', 
      icon: ClipboardDocumentCheckIcon,
      children: [
        { name: 'Score', href: '#' },
        { name: 'Reward', href: '/dashboard/reward' },
        { name: 'Badges', href: '#' },
      ]
    },
    { 
      name: 'ACCOUNTS', 
      href: '/dashboard/details', 
      icon: UsersIcon, 
      current: false,
      children: [
        { name: 'My Details', href: '/dashboard/details' },
        { name: 'My Subscriptions', href: '/dashboard/subscription' },
        { name: 'Manage students', href: '/dashboard/students' },
        { name: 'Manage groups', href: '/dashboard/group' },
        { name: 'Notifications', href: '/dashboard/notification' },
      ]
    }
  ];

  export const studentNav = [
    { 
      name: 'ACTIVITIES', 
      href: '/dashboard', 
      icon: CalendarIcon,
      children: [
        { name: 'Todo', href: '/dashboard/todo' },
        { name: 'Completed', href: '/dashboard/completed' },
      ]
    },
    { 
      name: 'PROGRESS', 
      href: '#', 
      icon: ClipboardDocumentCheckIcon,
      children: [
        { name: 'Score', href: '#' },
        { name: 'Reward', href: '#' },
        { name: 'Badges', href: '#' },
      ]
    },
  ]

  
  
  export const teams = [
    { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
    { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
    { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
  ]
  
  export const userNavigation = [
    { name: 'Your profile', href: 'dashboard/details' },
    { name: 'Sign out', href: '#' },
  ]


  export const Notification = [
    { topic: 'Create Number Codes using Multiple Word Codes', by: 'Mary', averageScore: 60,  score: 40, attempt: 3 },
    { topic: 'Create Number Codes using Multiple Word Codes', by: 'John', averageScore: 60,  score: 70, attempt: 9 },
    { topic: 'Create Number Codes using Multiple Word Codes', by: 'Angella', averageScore: 60,  score: 83, attempt: 1 },
  ]