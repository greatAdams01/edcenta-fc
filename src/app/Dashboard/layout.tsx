import { type Metadata } from 'next'
import { Manrope, Dosis } from 'next/font/google'

import Animation from '@/utils/Animation'

import '@/styles/tailwind.css'

import Sidebar  from './components/sidebar/Desktop'
import Mobile from './components/sidebar/Mobile'
import Header from './components/header/page'

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
})

const dosis = Dosis({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dosis',
})

export const metadata: Metadata = {
  title: {
    template: 'EdCenta',
    default: '',
  },
  description:
    '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dosis.variable}`}
    >
      <head>
        <title>Edcenta</title>
      </head>
      <body className="flex min-h-full">
        <div className="lg:flex w-full">
          <div className=''>
          <Sidebar />
          <Mobile />
          </div>
          <div className='w-[100vw]'>
            <Header />
          {children}
          </div>
        </div>
      </body>
    </html>
  )
}
