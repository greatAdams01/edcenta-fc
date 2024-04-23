import {
    CalendarIcon,
    UserCircleIcon,
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
        { name: 'Score', href: '/dashboard/score' },
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
    { name: 'Your profile', href: '/dashboard/details' },
    { name: 'Sign out', href: '#' },
  ]

export const adminNav = [
    { 
      name: 'Users', 
      href: '/admin', 
      icon: UserCircleIcon,
      children: [
        { name: 'Users', href: '/admin/users' },
        { name: 'Students', href: '/admin/student' },
        { name: 'Schools', href: '/admin/preview' },
        // { name: 'Review completed', href: '/admin/review' },
      ]
    },
    { 
      name: 'PROGRESS', 
      href: '#', 
      icon: ClipboardDocumentCheckIcon,
      children: [
        { name: 'Score', href: '#' },
        { name: 'Reward', href: '/admin/reward' },
        { name: 'Badges', href: '#' },
      ]
    },
    { 
      name: 'ACCOUNTS', 
      href: '/admin/details', 
      icon: UsersIcon, 
      current: false,
      children: [
        { name: 'My Details', href: '/admin/details' },
        { name: 'My Subscriptions', href: '/admin/subscription' },
        { name: 'Manage students', href: '/admin/students' },
        { name: 'Manage groups', href: '/admin/group' },
        { name: 'Notifications', href: '/admin/notification' },
      ]
    }
]


  export const Notification = [
    { topic: 'Create Number Codes using Multiple Word Codes', by: 'Mary', averageScore: 60,  score: 40, attempt: 3 },
    { topic: 'Create Number Codes using Multiple Word Codes', by: 'John', averageScore: 60,  score: 70, attempt: 9 },
    { topic: 'Create Number Codes using Multiple Word Codes', by: 'Angella', averageScore: 60,  score: 83, attempt: 1 },
  ]
    
  export const statData = [
    {
      subject: 'Eng',
      score: 85,
    },
      {
        subject: 'Math',
        score: 60,
      },
      {
        subject: 'Bio',
        score: 42,
      },
  ]


  