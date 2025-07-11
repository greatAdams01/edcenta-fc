import { Hero } from '@/components/hero/Hero'
import { Newsletter } from '@/components/ui/Newsletter'
import { Tuition } from '@/components/ui/Tuition'
import { Learn } from '@/components/ui/Learn'
import { Pricing } from '@/components/ui/Pricing'
import { Sponsors } from '@/components/ui/Sponsors'
import { Layout } from '@/components/Layout'
import TutorStats from '@/components/TutorStats'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <TutorStats />
      <Learn />
      <Tuition />
      <Pricing />
      <Sponsors />
      <Newsletter />
    </Layout>
  )
} 