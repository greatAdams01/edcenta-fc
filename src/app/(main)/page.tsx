import { Hero } from '@/components/hero/Hero'
import { Newsletter } from '@/components/Newsletter'
import { Tuition } from '@/components/Tuition'
import { Learn } from '@/components/Learn'
import { Pricing } from '@/components/Pricing'
import { Sponsors } from '@/components/Sponsors'

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
