'use client'
import {nav} from '@/utils/nav'
import Link from 'next/link'
const MobileNav = () => {

  return (
    <div className={`w-full pl-16 h-full mt-6 rounded-md -mx-4 flex flex-auto basis-full overflow-x-auto whitespace-nowrap  py-4 text-[1.5rem] font-mono  sm:-mx-6 font-bold text cursor-pointer`}>
       <nav className=' w-full'>
            <ul className='block justify-between w-full'>
                {
                    nav.map((link, i) => {

                        return(
                            <li key={i} className='mb-4'>
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

export default MobileNav
