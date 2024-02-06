import { Container } from '@/components/Container'
import Image from 'next/image'
import { Facebook, Linkedin, Instagram, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full text-sm ">
      
      <Container className="grid grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))]  justify-between my-8  items-start md:items-end" >
        <div className='mb-2'>
        <div >
          <Image src={'/Footerlogo.png'} alt='EdCenta' width={100} height={100} className='w-36 my-4'/>
        </div>
          <p className='font-bold'>Who we help</p>
          <ul className='leading-loose'>
            <li>School</li>
            <li>Teachers</li>
            <li>Parents</li>
            <li>Students</li>
          </ul>
        </div>
        <div className='mb-2'>
          <p className='font-bold'>Company</p>
          <ul className='leading-loose'>
            <li>About EdCenta</li>
            <li>Blog</li>
            <li>Careers</li>
            <li>Awards</li>
            <li>Investors</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className='mb-2'>
        <p className='font-bold'>Socials</p>
          <ul className='leading-loose'>
            <li>Linkedin</li>
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Youtube</li>
            <li>X (Twitter)</li>
          </ul>
        </div>
        <div className='mb-2'>
        <p className='font-bold'>Support</p>
          <ul className='leading-loose'>
            <li>Webinars</li>
            <li>Classroom resources</li>
            <li>Curicullum alignment</li>
            <li>Partner support</li>
            <li>Technical support</li>
            <li>Blog</li>
            <li>FAQs</li>
          </ul>
        </div>
      </Container>
      <Container className="lg:flex justify-center">
        <div className='w-4/5 leading-loose'>
          <hr />
          <div className='block sm:flex justify-between items-center my-2'>
            <div className='order-last w-full flex items-center justify-between mt-4 sm:mt-0 sm:w-2/6'>
              <p>Follow us</p>
              <div className='bg-[#0045BC] text-white p-1 lg:p-2 rounded-md cursor-pointer'>
                <Facebook />
              </div>
              <div className='bg-[#0045BC] text-white p-1 lg:p-2 rounded-md cursor-pointer'>
                <Linkedin />
              </div>
              <div className='bg-[#0045BC] text-white p-1 lg:p-2 rounded-md cursor-pointer'>
                <Instagram />
              </div>
              <div className='bg-[#0045BC] text-white p-1 lg:-2 rounded-md cursor-pointer'>
                <Twitter />
              </div>
              <div className='bg-[#0045BC] text-white p-1 lg:p-2 rounded-md cursor-pointer'>
                <Youtube />
              </div>
            </div>
            
            <div className='order-first w-full flex justify-between sm:w-2/6'>
              <p>Terms & Conditions</p>
              <p>Privacy</p>
              <p>Help</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
