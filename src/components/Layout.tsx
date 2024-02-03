import { Footer } from '@/components/Footer'
import { Header } from '@/components/hero/Header'
import { Mobile } from '@/components/mobile/Mobile'

export function Layout({
  children,
  showFooter = true,
}: {
  children: React.ReactNode
  showFooter?: boolean
}) {
  return (
    <>
      <Header />
      <Mobile />
      <main className="flex-auto">{children}</main>
      {showFooter && <Footer />}
    </>
  )
}
