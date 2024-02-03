import { Layout } from '@/components/Layout'

import Nav from '@/components/Nav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return(
    <Layout>
    {children}
    </Layout>
  ) 
}
