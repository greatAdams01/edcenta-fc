import { Container } from '@/components/Container'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="flex-none mt-4 py-4 bg-[#0045BC]">
      <Container className="flex flex-col items-center justify-between md:flex-row">
      <div className="flex items-center mt-10 lg:mt-0 lg:grow lg:basis-0">
          <Image src="/logo.png" alt="Logo" width={100} height={100} className='w-20' />
          <h1 className='text-yellow-500 text-xl font-bold m-2'>EdCenta</h1>
        </div>
        <p className="mt-6 text-base text-white md:mt-0">
          Copyright &copy; {new Date().getFullYear()} EdCenta, LLC. All
          rights reserved.
        </p>
      </Container>
    </footer>
  )
}
