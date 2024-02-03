// import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import Button from '@/utils/button'

export function Hero() {
  return (
    <div className="relative py-20 w-full h-[85vh] sm:pb-24 sm:pt-36 border-2 border-red border-solid" style={{ backgroundImage: "url('/istockphoto-1096013738-612x612.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="mx-48 max-w-2xl lg:max-w-4xl lg:px-12 w-full">
          <div className='w-[50%] mt-2'>
            <h1 className='text-[4rem] font-bold'>EdCenta</h1>
            <p className='mt-2 text-[2rem]'>Lorem ipsum dolor sit amet consectetur.</p>
            <p className='mt-2 text-[1rem]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint odio laboriosam, itaque perferendis fuga reprehenderit ipsum voluptate consequatur? Amet tenetur quo ratione quae numquam molestiae mollitia beatae vel fuga. Qui totam dolore explicabo pariatur nobis, odio assumenda quos dolorem consequatur, voluptatem ducimus architecto labore quia incidunt quasi ipsa officia ratione.</p>
            <div className='mt-6'>
              <Button />
            </div>
          </div>
          
        </div>
    </div>
  )
}
