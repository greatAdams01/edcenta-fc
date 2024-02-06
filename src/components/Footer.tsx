import { Container } from '@/components/Container'
import Image from 'next/image'
import { Facebook, Linkedin, Instagram, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full text-sm ">
      <Container className="flex justify-between my-8">
        <div>
          <Image src={'/Footerlogo.png'} alt='EdCenta' width={100} height={100} className='w-36'/>
        </div>
        <div>
          <p className='font-bold'>Who we help</p>
          <ul className='leading-loose'>
            <li>School</li>
            <li>Teachers</li>
            <li>Parents</li>
            <li>Students</li>
          </ul>
        </div>
        <div>
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
        <div>
        <p className='font-bold'>Socials</p>
          <ul className='leading-loose'>
            <li>Linkedin</li>
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Youtube</li>
            <li>X (Twitter)</li>
          </ul>
        </div>
        <div>
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
      <Container className="flex justify-center">
        <div className='w-4/5 '>
          <hr />
          <div className=' flex justify-between items-center my-2'>
            <div className='flex justify-between w-2/6'>
              <p>Terms & Conditions</p>
              <p>Privacy</p>
              <p>Help</p>
            </div>
            <div className='flex items-center justify-between w-2/6'>
              <p>Follow us</p>
              <div className='bg-[#0045BC] text-white  p-2 rounded-md cursor-pointer'>
              <Facebook />
              </div>
              <div className='bg-[#0045BC] text-white  p-2 rounded-md cursor-pointer'>
              <Linkedin />
              </div>
              <div className='bg-[#0045BC] text-white  p-2 rounded-md cursor-pointer'>
              <Instagram />
              </div>
              <div className='bg-[#0045BC] text-white  p-2 rounded-md cursor-pointer'>
              <Twitter />
              </div>
              <div className='bg-[#0045BC] text-white  p-2 rounded-md cursor-pointer'>
              <Youtube />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
