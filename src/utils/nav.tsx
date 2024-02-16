import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
  } from '@heroicons/react/24/outline'
  import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

  export const navigation = [
    { 
      name: 'ACTIVITIES', 
      href: '#', 
      icon: HomeIcon,
      children: [
        { name: 'Brouse and Assign', href: '#' },
        { name: 'Preview assigned', href: '#' },
        { name: 'Review completed', href: '#' },
      ]
    },
    { 
      name: 'PROGRESS', 
      href: '#', 
      icon: UsersIcon,
      children: [
        { name: 'Score', href: '#' },
        { name: 'Reward', href: '#' },
        { name: 'Badges', href: '#' },
      ]
    },
    { 
      name: 'ACCOUNTS', 
      href: '#', 
      icon: FolderIcon, 
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
  
  export const teams = [
    { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
    { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
    { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
  ]
  export const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
  ]

