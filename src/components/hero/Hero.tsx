import { Container } from '@/components/Container';
import Button from '@/utils/button';
import { AlignLeft } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative py-20 w-full h-[85vh] sm:pb-24 sm:pt-36 border-2 border-red border-solid overflow-hidden" style={{ backgroundImage: "url('/istockphoto-1096013738-612x612.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* <div className='w-full'> */}
      <div className='hidden lg:block'>
      <div className="w-3/5 h-[50rem] mt-[-9rem] ml-[-13rem] bg-yellow-500 opacity-20 backdrop-blur-sm absolute z-0 origin-center rotate-[30deg] rounded-lg" />
      <div className="w-3/5 h-[50rem] mt-[-9rem] ml-[-13rem] bg-blue-500 opacity-40 backdrop-blur-md absolute z-0 origin-center rotate-[53deg] rounded-lg" />
      <div className="w-3/5 h-[50rem] mt-[-9rem] ml-[-13rem] bg-purple-500 opacity-50 backdrop-blur-xl absolute z-0 origin-center rotate-[50deg] rounded-lg" />
      </div>
      <div className="block lg:hidden">
      <div className="w-full h-full mt-[-5rem] bg-black opacity-70 backdrop-blur-md absolute rounded-lg" />
      </div>
      <div className="mx-auto lg:mx-48 max-w-2xl lg:max-w-4xl lg:px-12 w-full relative z-auto">
      <div className='w-[70%] mx-auto lg:mx-0 lg:w-[50%] mt-2'>
          <h1 className='text-[4rem] font-bold relative' style={{ backgroundImage: "url('/background.jpg')", WebkitBackgroundClip: 'text', color: 'transparent' }}>
            EdCenta
          </h1>
          <p className='mt-2 text-[2rem] text-[#E9DCC9] lg:text-black'>Lorem ipsum dolor sit amet consectetur.</p>
          <p className='mt-2 text-[1rem] text-[#E9DCC9] lg:text-black'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint odio laboriosam, itaque perferendis fuga reprehenderit ipsum voluptate consequatur? Amet tenetur quo ratione quae numquam molestiae mollitia beatae vel fuga. Qui totam dolore explicabo pariatur nobis, odio assumenda quos dolorem consequatur, voluptatem ducimus architecto labore quia incidunt quasi ipsa officia ratione.</p>
          <div className='mt-6'>
            <Button />
          </div>
        </div>
      </div>
      {/* </div>
      <div className='-mt-10 z-50 text-white sm:mt-[-7rem] sm:text-black mr-6 lg:hidden'>
        <AlignLeft />        
      </div> */}
    </div>
  );
}
