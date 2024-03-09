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
        { name: 'Preview assigned', href: '#' },
        { name: 'Review completed', href: '#' },
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
  
  export const teams = [
    { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
    { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
    { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
  ]
  
  export const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
  ]

//   export const classes = [
//     {
//         _id: '1',
//         stage: '1',
//         year: '3',
//         age: '13-16',
//         subjects: [
//             { 
//               id: 1, 
//               name: 'English' 
//             },
//             { 
//               id: 2, 
//               name: 'Mathematics' 
//             },
//             { 
//               id: 3, 
//               name: 'Biology' 
//             }
//         ]
//     },
//     {
//         _id: '2',
//         stage: '3',
//         year: '4',
//         age: '19-22',
//         subjects: [
//             { 
//               id: 1, 
//               name: 'Geography' 
//             },
//             { 
//               id: 2, 
//               name: 'Physics' 
//             }
//         ]
//     },
//     {
//         _id: '3',
//         stage: '4',
//         year: '5',
//         age: '22-25',
//         subjects: [
//             { 
//               id: 1, 
//               name: 'Geography' 
//             },
//             { 
//               id: 2, 
//               name: 'Physics' 
//             },
//             { 
//               id: 3, 
//               name: 'Maths' 
//             }
//         ]
//     }
// ];

export const classes = [
  {
    _id: '1',
    stage: '1',
    year: '1',
    ages: '5-6',
    subjects: [
      {
        _id: '11',
        name: 'Mathematics',
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9'
          }
        ],

      },
      {
        _id: '21',
        name: 'English',
        worksheet:[
          {
            number: '12',
            topics: '1',
          }
        ] ,
        assessment: [
          {
            number: '189',
            topics: '3'
          }
        ],

      },
      {
        _id: '31',
        name: 'Biology',
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9'
          }
        ],

      }
    ]
  },
  {
    _id: '2',
    stage: '1',
    year: '1',
    ages: '5-6',
    subjects: [
      {
        _id: '12',
        name: 'Mathematics',
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9'
          }
        ],

      },
      {
        _id: '22',
        name: 'English',
        worksheet:[
          {
            number: '12',
            topics: '1',
          }
        ] ,
        assessment: [
          {
            number: '189',
            topics: '3'
          }
        ],

      },
      {
        _id: '32',
        name: 'Biology',
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9'
          }
        ],

      }
    ]
  },
  {
    _id: '3',
    stage: '2',
    year: '1',
    ages: '5-6',
    subjects: [
      {
        _id: '13',
        name: 'Mathematics',
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9'
          }
        ],

      },
      {
        _id: '23',
        name: 'English',
        worksheet:[
          {
            number: '12',
            topics: '1',
          }
        ] ,
        assessment: [
          {
            number: '189',
            topics: '3'
          }
        ],

      },
      {
        _id: '33',
        name: 'Biology',
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9'
          }
        ],

      }
    ]
  },
  {
    _id: '44',
    stage: '3',
    year: '1',
    ages: '5-6',
    subjects: [
      {
        _id: '14',
        name: 'Mathematics',
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9'
          }
        ],

      },
      {
        _id: '24',
        name: 'English',
        worksheet:[
          {
            number: '12',
            topics: '1',
          }
        ] ,
        assessment: [
          {
            number: '189',
            topics: '3'
          }
        ],

      },
      {
        _id: '34',
        name: 'Biology',
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9'
          }
        ],

      }
    ]
  },  
]
