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
        { name: 'Reward', href: '#' },
        { name: 'Badges', href: '#' },
      ]
    },
    { 
      name: 'ACCOUNTS', 
      href: '#', 
      icon: UsersIcon, 
      current: false,
      children: [
        { name: 'My Accounts', href: '/dashboard/account' },
        { name: 'My Details', href: '#' },
        { name: 'My Subscriptions', href: '#' },
        { name: 'Manage students', href: '#' },
        { name: 'Manage groups', href: '#' },
        { name: 'Notifications', href: '#' },
      ]
    }
  ];

  
  
  export const teams = [
    { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
    { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
    { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
  ]
  
  export const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
  ]


