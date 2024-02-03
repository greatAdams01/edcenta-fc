import { Hero } from '@/components/hero/Hero'
import { Newsletter } from '@/components/Newsletter'
import { Schedule } from '@/components/Schedule'
import { Learn } from '@/components/Learn'
import { Sponsors } from '@/components/Sponsors'

export default function Home() {
  return (
    <>
      <Hero />
      <Learn />
      <Schedule />
      <Sponsors />
      <Newsletter />
    </>
  )
}
