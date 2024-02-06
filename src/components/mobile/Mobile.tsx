'use client'
import { useState, useEffect } from 'react';
import { Container } from '@/components/Container';
import Image from 'next/image';
import Button from '@/utils/button';
import { X, AlignLeft } from 'lucide-react';
import MobileNav from '../mobile/MobileNav';
export function Mobile() {
  const [bar, setBar] = useState<boolean>(false)
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
    <header className={`block lg:hidden items-center w-[100%] z-50  ${bar ? 'h-full bg-[#0075BC] bg-opacity-30 backdrop-blur-md' : null} ${scroll ? 'fixed bg-[#0075BC] bg-opacity-30 backdrop-blur-md -mt-4 pb-6' : 'absolute'}`}>
      <Container className="flex flex-wrap items-center sm:justify-between ">
        <div className='flex items-center mt-10 w-full'>
        <div className="flex items-center  w-full ml-14 sm:-mt-6">
          <Image src="/logo.png" alt="Logo" width={100} height={100} className='w-10 ' />
          <h1 className=' hidden text-yellow-500 text-xl font-bold m-2 sm:block sm:text-purple-500 '>EdCenta</h1>
        </div>
        {
          bar ?(
            <X className={`block`} onClick={() => setBar(!bar)}/>
          ) : (
            <AlignLeft className={`block`} onClick={() => setBar(!bar)}/>
            )
        }
        </div>
        <div className={`block  w-full flex flex-col justify-center -mt-[50rem] ${bar ? 'mt-0' : null}`}>
        <MobileNav />
        <div className='ml-10'>
        <Button />
        </div>
        </div>
        <div className={`hidden ${bar ? 'hover:text-white' : null}`}>
          <Button />
        </div>
      </Container>
    </header>
  );
}
