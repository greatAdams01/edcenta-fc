'use client'
import { useState } from 'react';
import { Container } from '@/components/Container';
import Image from 'next/image';
import Button from '@/utils/button';
import MobileNav from '@/components/mobile/MobileNav';
import { X, AlignLeft  } from 'lucide-react';

export function Mobile() {
  const [bar, setBar] = useState<boolean>(false)

  return (
    <header className={` block fixed w-[100%] h-[100svh] z-50 lg:hidden ${bar ? 'bg-[#0075BC] bg-opacity-30 backdrop-blur-md' : null }`}>
      <Container className={`justify-center sm:justify-between ml-[-40rem] ${bar ? 'ml-6' : null}`}>
        <div className='flex'>
        <div className="flex items-center mt-10 w-full">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className='text-purple-500 text-xl font-bold m-2'>EdCenta</h1>
        </div>
        <div className={`flex w-full justify-end mt-8 `}>
        {bar ? (
              <X className={`cursor-pointer block`} onClick={() => setBar(!bar)} />
            ) : (
              <AlignLeft className={`cursor-pointer block`} onClick={() => setBar(!bar)} />
            )}
      </div>
        </div>
        <div className='flex ml-4 w-[60%]'>
          <MobileNav />
        </div>
        <div className="sm:mt-10 sm:flex">
          <Button />
        </div>
      </Container>
    </header>
  );
}
