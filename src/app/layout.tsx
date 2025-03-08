import { type Metadata } from 'next'
import { Manrope, Dosis } from 'next/font/google'

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
      className={`h-full bg-black antialiased ${manrope.variable} ${dosis.variable}`}
    >
      <head>
        <title>Edcenta</title>
      </head>
      <body className="flex min-h-full">
        <div className="flex w-full flex-col">{children}</div>
      </body>
    </html>
  )
}
