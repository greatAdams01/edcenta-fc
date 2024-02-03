'use client'
import {useState, useEffect} from 'react'
import {nav} from '@/utils/nav'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
const Nav = () => {
    // const Pathname = usePathname()
    const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 500; 
      setScroll(isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`w-full order-first -mx-4 flex flex-auto basis-full overflow-x-auto whitespace-nowrap border-b border-blue-600/10 py-4 font-mono  sm:-mx-6 lg:order-none lg:mx-0 lg:basis-auto lg:border-0 lg:py-0 font-bold text-[#00AE9A] cursor-pointer ${scroll ? 'text-white' : null}`}>
       <nav className='flex w-full'>
            <ul className='flex justify-between w-full'>
                {
                    nav.map((link, i) => {
                        // const active = Pathname === link.path;

                        return(
                            <li key={i}>
                                <Link href={link.path}>
                                    <span>{link.name}</span>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
          </nav>
    </div>
  )
}

export default Nav
