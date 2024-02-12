// import { Manrope, Dosis } from 'next/font/google'
import StaticBar from "./home/page"


import '@/styles/tailwind.css'

// const manrope = Manrope({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-manrope',
// })

// const dosis = Dosis({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-dosis',
// })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <div className="flex w-full flex-col">
          <StaticBar />
          {children}</div>
  )
}
