import { type Metadata } from 'next'
import { Manrope, Dosis } from 'next/font/google'

import Animation from '@/utils/Animation'

import '@/styles/tailwind.css'

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
      className={`h-full bg-white antialiased ${manrope.variable} ${dosis.variable}`}
    >
      <head>
        <title>Edcenta</title>
      </head>
      <body className="">
        {/* <Animation> */}
        <div className="">{children}</div>
         {/* </Animation> */}
      </body>
    </html>
  )
}
