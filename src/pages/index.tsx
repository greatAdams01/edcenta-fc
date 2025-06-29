import { Hero } from '@/components/hero/Hero'
import { Newsletter } from '@/components/ui/Newsletter'
import { Tuition } from '@/components/ui/Tuition'
import { Learn } from '@/components/ui/Learn'
import { Pricing } from '@/components/ui/Pricing'
import { Sponsors } from '@/components/ui/Sponsors'

export default function Home() {
  return (
    <>
      <Hero />
      <Learn />
      <Tuition />
      <Pricing />
      <Sponsors />
      <Newsletter />
    </>
  )
} 