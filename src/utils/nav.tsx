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


export const classes = [
  {
    _id: '1',
    stage: '1',
    year: '1',
    ages: '5-6',
    subjects: [
      {
        _id: '11',
        year: '1',
        name: 'Mathematics',
        Topic: [
          {
          name: 'Addition',
          worksheet: '2',
          assessment: '1',
        },
        {
          name: 'Subtraction',
          worksheet: '1',
          assessment: '4',
        },
        {
          name: 'Multiplication',
          worksheet: '11',
          assessment: '5',
        }
      ],
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9',
          }
        ],

      },
      {
        _id: '21',
        year: '1',
        name: 'English',
        Topic: [
          {
          name: 'Parts of Speach',
          worksheet: '11',
          assessment: '1',
        },
        {
          name: 'Comprehension',
          worksheet: '4',
          assessment: '3',
        },
      ],
        worksheet:[
          {
            number: '12',
            topics: '1',
          }
        ] ,
        assessment: [
          {
            number: '189',
            topics: '3',
          }
        ],

      },
      {
        _id: '31',
        year: '1',
        name: 'Biology',
        Topic: [
          {
          name: 'Protozoa',
          worksheet: '2',
          assessment: '6',
        },
        {
          name: 'Parasites (Endo and Exo)',
          worksheet: '1',
          assessment: '3',
        },
        {
          name: 'The Human Skeleton',
          worksheet: '9',
          assessment: '6',
        },
      ],
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9',
          },
        ],

      }
    ]
  },
  {
    _id: '1',
    stage: '1',
    year: '1',
    ages: '5-6',
    subjects: [
      {
        _id: '11',
        year: '1',
        name: 'Mathematics',
        Topic: [
          {
          name: 'Addition',
          worksheet: '2',
          assessment: '1',
        },
        {
          name: 'Subtraction',
          worksheet: '1',
          assessment: '4',
        },
        {
          name: 'Multiplication',
          worksheet: '11',
          assessment: '5',
        }
      ],
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9',
          }
        ],

      },
      {
        _id: '21',
        year: '1',
        name: 'English',
        Topic: [
          {
          name: 'Parts of Speach',
          worksheet: '11',
          assessment: '1',
        },
        {
          name: 'Comprehension',
          worksheet: '4',
          assessment: '3',
        },
      ],
        worksheet:[
          {
            number: '12',
            topics: '1',
          }
        ] ,
        assessment: [
          {
            number: '189',
            topics: '3',
          }
        ],

      },
      {
        _id: '31',
        year: '1',
        name: 'Biology',
        Topic: [
          {
          name: 'Protozoa',
          worksheet: '2',
          assessment: '6',
        },
        {
          name: 'Parasites (Endo and Exo)',
          worksheet: '1',
          assessment: '3',
        },
        {
          name: 'The Human Skeleton',
          worksheet: '9',
          assessment: '6',
        },
      ],
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9',
          },
        ],

      }
    ]
  },
  {
    _id: '1',
    stage: '1',
    year: '1',
    ages: '5-6',
    subjects: [
      {
        _id: '11',
        year: '1',
        name: 'Mathematics',
        Topic: [
          {
          name: 'Addition',
          worksheet: '2',
          assessment: '1',
        },
        {
          name: 'Subtraction',
          worksheet: '1',
          assessment: '4',
        },
        {
          name: 'Multiplication',
          worksheet: '11',
          assessment: '5',
        }
      ],
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9',
          }
        ],

      },
      {
        _id: '21',
        year: '1',
        name: 'English',
        Topic: [
          {
          name: 'Parts of Speach',
          worksheet: '11',
          assessment: '1',
        },
        {
          name: 'Comprehension',
          worksheet: '4',
          assessment: '3',
        },
      ],
        worksheet:[
          {
            number: '12',
            topics: '1',
          }
        ] ,
        assessment: [
          {
            number: '189',
            topics: '3',
          }
        ],

      },
      {
        _id: '31',
        year: '1',
        name: 'Biology',
        Topic: [
          {
          name: 'Protozoa',
          worksheet: '2',
          assessment: '6',
        },
        {
          name: 'Parasites (Endo and Exo)',
          worksheet: '1',
          assessment: '3',
        },
        {
          name: 'The Human Skeleton',
          worksheet: '9',
          assessment: '6',
        },
      ],
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9',
          },
        ],

      }
    ]
  },
  {
    _id: '1',
    stage: '1',
    year: '1',
    ages: '5-6',
    subjects: [
      {
        _id: '11',
        year: '1',
        name: 'Mathematics',
        Topic: [
          {
          name: 'Addition',
          worksheet: '2',
          assessment: '1',
        },
        {
          name: 'Subtraction',
          worksheet: '1',
          assessment: '4',
        },
        {
          name: 'Multiplication',
          worksheet: '11',
          assessment: '5',
        }
      ],
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9',
          }
        ],

      },
      {
        _id: '21',
        year: '1',
        name: 'English',
        Topic: [
          {
          name: 'Parts of Speach',
          worksheet: '11',
          assessment: '1',
        },
        {
          name: 'Comprehension',
          worksheet: '4',
          assessment: '3',
        },
      ],
        worksheet:[
          {
            number: '12',
            topics: '1',
          }
        ] ,
        assessment: [
          {
            number: '189',
            topics: '3',
          }
        ],

      },
      {
        _id: '31',
        year: '1',
        name: 'Biology',
        Topic: [
          {
          name: 'Protozoa',
          worksheet: '2',
          assessment: '6',
        },
        {
          name: 'Parasites (Endo and Exo)',
          worksheet: '1',
          assessment: '3',
        },
        {
          name: 'The Human Skeleton',
          worksheet: '9',
          assessment: '6',
        },
      ],
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9',
          },
        ],

      }
    ]
  },
  {
    _id: '1',
    stage: '1',
    year: '1',
    ages: '5-6',
    subjects: [
      {
        _id: '11',
        year: '1',
        name: 'Mathematics',
        Topic: [
          {
          name: 'Addition',
          worksheet: '2',
          assessment: '1',
        },
        {
          name: 'Subtraction',
          worksheet: '1',
          assessment: '4',
        },
        {
          name: 'Multiplication',
          worksheet: '11',
          assessment: '5',
        }
      ],
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9',
          }
        ],

      },
      {
        _id: '21',
        year: '1',
        name: 'English',
        Topic: [
          {
          name: 'Parts of Speach',
          worksheet: '11',
          assessment: '1',
        },
        {
          name: 'Comprehension',
          worksheet: '4',
          assessment: '3',
        },
      ],
        worksheet:[
          {
            number: '12',
            topics: '1',
          }
        ] ,
        assessment: [
          {
            number: '189',
            topics: '3',
          }
        ],

      },
      {
        _id: '31',
        year: '1',
        name: 'Biology',
        Topic: [
          {
          name: 'Protozoa',
          worksheet: '2',
          assessment: '6',
        },
        {
          name: 'Parasites (Endo and Exo)',
          worksheet: '1',
          assessment: '3',
        },
        {
          name: 'The Human Skeleton',
          worksheet: '9',
          assessment: '6',
        },
      ],
        worksheet:[
          {
            number: '123',
            topics: '11',
          }
        ] ,
        assessment: [
          {
            number: '290',
            topics: '9',
          },
        ],

      }
    ]
  },
]
