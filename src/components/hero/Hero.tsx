import { Container } from '@/components/Container';
import Button from '@/utils/button';

export function Hero() {
  return (
    <div className="relative py-20 w-full h-[85vh] sm:pb-24 sm:pt-36 border-2 border-red border-solid overflow-hidden" style={{ backgroundImage: "url('/istockphoto-1096013738-612x612.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-3/5 h-[50rem] mt-[-9rem] ml-[-13rem] bg-yellow-500 opacity-20 absolute z-0 origin-center rotate-[30deg] rounded-lg" />
      <div className="w-3/5 h-[50rem] mt-[-9rem] ml-[-13rem] bg-blue-500 opacity-40 absolute z-0 origin-center rotate-[53deg] rounded-lg" />
      <div className="w-3/5 h-[50rem] mt-[-9rem] ml-[-13rem] bg-purple-500 opacity-50 backdrop-blur-sm absolute z-0 origin-center rotate-[50deg] rounded-lg" />
      <div className="mx-48 max-w-2xl lg:max-w-4xl lg:px-12 w-full relative z-auto">
        <div className='w-[50%] mt-2'>
          <h1 className='text-[4rem] font-bold relative' style={{ backgroundImage: "url('/background.jpg')", WebkitBackgroundClip: 'text', color: 'transparent' }}>
            EdCenta
          </h1>
          <p className='mt-2 text-[2rem]'>Lorem ipsum dolor sit amet consectetur.</p>
          <p className='mt-2 text-[1rem]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint odio laboriosam, itaque perferendis fuga reprehenderit ipsum voluptate consequatur? Amet tenetur quo ratione quae numquam molestiae mollitia beatae vel fuga. Qui totam dolore explicabo pariatur nobis, odio assumenda quos dolorem consequatur, voluptatem ducimus architecto labore quia incidunt quasi ipsa officia ratione.</p>
          <div className='mt-6'>
            <Button />
          </div>
        </div>
      </div>
    </div>
  );
}
