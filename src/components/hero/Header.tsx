'use client'
import { useState, useEffect } from 'react';
import { Container } from '@/components/Container';
import Image from 'next/image';
import Button from '@/utils/button';
import Nav from '@/components/Nav';

export function Header() {
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
    <header className={`hidden lg:block fixed items-center w-[100%] z-50 lg:pt-5 lg:pb-5 ${scroll ? 'bg-[#0075BC] bg-opacity-30 backdrop-blur-md' : null}`}>
      <Container className="flex flex-wrap items-center justify-center sm:justify-between lg:flex-nowrap">
        <div className="flex items-center mt-10 lg:mt-0 lg:grow lg:basis-0">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className='text-purple-500 text-xl font-bold m-2'>EdCenta</h1>
        </div>
        <div className='flex w-[60%]'>
          <Nav />
        </div>
        <div className="hidden sm:mt-10 sm:flex lg:mt-0 lg:grow lg:basis-0 lg:justify-end">
          <Button />
        </div>
      </Container>
    </header>
  );
}
