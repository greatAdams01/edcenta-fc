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
        { name: 'My Accounts', href: '#' },
        { name: 'My Details', href: '#' },
        { name: 'My Subscriptions', href: '#' },
        { name: 'Manage students', href: '#' },
        { name: 'Manage groups', href: '#' },
        { name: 'Notifications', href: '#' },
      ]
    }
  ];

  export const subNavigation = [
    { 
      name: 'Key Stage 1', 
      href: '/dashboard', 
      icon: CalendarIcon,
      children: [
        { name: 'Year 1 (5 - 6)', href: '#' },
        { name: 'Year 2 (6 - 7)', href: '#' },
      ]
    },
    { 
      name: 'Key Stage 2', 
      href: '#', 
      icon: ClipboardDocumentCheckIcon,
      children: [
        { name: 'Year 3 (7 - 8)', href: '#' },
        { name: 'Year 4 (8 - 9)', href: '#' },
        { name: 'Year 5 (9 - 10)', href: '#' },
        { name: 'Year 6 (10 - 11)', href: '#' },
      ]
    },
    { 
      name: 'Key Stage 3', 
      href: '#', 
      icon: UsersIcon, 
      current: false,
      children: [
        { name: 'Year 7 (11 - 12)', href: '#' },
        { name: 'Year 8 (12 - 13)', href: '#' },
        { name: 'Year 9 (13 - 14)', href: '#' },
      ]
    },
    { 
      name: 'Key Stage 4', 
      href: '#', 
      icon: UsersIcon, 
      current: false,
      children: [
        { name: 'GCSE', href: '#' },
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


