'use client'
import { Container } from '@/components/Container'

export function Tuition() {
  return (
    <section id="schedule" aria-label="Schedule" className="py-20 sm:py-32 bg-[#0045BC] text-white ">
      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-4xl lg:pr-24">
          <h2 className="font-display text-4xl font-medium tracking-tighter sm:text-5xl">
           Tuition
          </h2>
          <p className="mt-4 font-display text-2xl tracking-tight ">
            The worst people in our industry giving the best talks you’ve ever
            seen. Nothing will be recorded and every attendee has to sign an NDA
            to watch the talks.
          </p>
        </div>
      </Container>
      <div className="relative mt-14 sm:mt-24">
        <Container className="relative">
        </Container>
      </div>
    </section>
  )
}
