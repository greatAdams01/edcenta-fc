// import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import Button from '@/utils/button'

export function Hero() {
  return (
    <div className="relative py-20 w-full h-[85vh] sm:pb-24 sm:pt-36 border-2 border-red border-solid" style={{ backgroundImage: "url('/istockphoto-1096013738-612x612.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* <Container className="relative"> */}
        <div className="mx-48 max-w-2xl lg:max-w-4xl lg:px-12 w-full">
          <div className='w-[50%] mt-8'>
            <h1 className='text-xl text-[5em] font-bold'>EdCenta</h1>
            <p className='mt-4 text-[2rem]'>Lorem ipsum dolor sit amet consectetur.</p>
            <p className='mt-4 text-[1rem]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint odio laboriosam, itaque perferendis fuga reprehenderit ipsum voluptate consequatur? Amet tenetur quo ratione quae numquam molestiae mollitia beatae vel fuga. Qui totam dolore explicabo pariatur nobis, odio assumenda quos dolorem consequatur, voluptatem ducimus architecto labore quia incidunt quasi ipsa officia ratione.</p>
            <div className='mt-6'>
              <Button />
            </div>
          </div>
          {/* <h1 className="font-display text-5xl font-bold tracking-tighter text-blue-600 sm:text-7xl">
            <span className="">EdCenta - </span>A design conference
            for the dark side.
          </h1>
          <div className="mt-6 space-y-6 font-display text-2xl tracking-tight text-blue-900">
            <p>
              The next generation of web users are tech-savvy and suspicious.
              They know how to use dev tools, they can detect a phishing scam
              from a mile away, and they certainly aren’t accepting any checks
              from Western Union.
            </p>
            <p>
              At DeceptiConf you’ll learn about the latest dark patterns being
              developed to trick even the smartest visitors, and you’ll learn
              how to deploy them without ever being detected.
            </p>
          </div>
          <Button href="#" className="mt-10 w-full sm:hidden">
            Get your tickets
          </Button>
          <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 sm:mt-16 sm:gap-x-16 sm:gap-y-10 sm:text-center lg:auto-cols-auto lg:grid-flow-col lg:grid-cols-none lg:justify-start lg:text-left">
            {[
              ['Speakers', '18'],
              ['People Attending', '2,091'],
              ['Venue', 'Staples Center'],
              ['Location', 'Los Angeles'],
            ].map(([name, value]) => (
              <div key={name}>
                <dt className="font-mono text-sm text-blue-600">{name}</dt>
                <dd className="mt-0.5 text-2xl font-semibold tracking-tight text-blue-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl> */}
        </div>
      {/* </Container> */}
    </div>
  )
}
