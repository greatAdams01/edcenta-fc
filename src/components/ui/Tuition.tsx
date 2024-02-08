import { Container } from '@/components/ux/Container';
import { GraduationCap, BookOpenCheck, ScrollText } from 'lucide-react';

export function Tuition() {
  return (
    <section className="py-20 sm:pt-32 bg-[#0045BC] text-white ">
      <Container className="relative z-10">
        <div className="block mx-auto max-w-2xl lg:mx-0 lg:max-w-full">
          
          <div className='lg:max-w-2xl'>
            <h2 className="font-display text-4xl font-medium tracking-tighter sm:text-5xl ">
              Tuition
            </h2>
            <p className="mt-4 font-display text-2xl tracking-tight ">
              At Edcenta, we are committed to providing high-quality education and personalized learning experiences to help students excel academically.
            </p>
          </div>

          <div className='block lg:flex w-full justify-between pt-20'>

            <div className="icon-wrapper grid justify-items-center text-center lg:w-[20rem]">
              <GraduationCap className='border-2 border-purple-500 p-2 rounded-full mb-4' />
              <div className=''>
              <h2 className='font-bold '>Subject-Specific Tutoring</h2>
              <p>Our tutors are experts in their respective fields and tailor their teaching methods 
                to suit each students individual needs and learning style.</p>
                </div>
            </div>

            <div className="icon-wrapper grid justify-items-center text-center lg:w-[20rem]">
              <BookOpenCheck className='border-2 border-purple-500 p-2 rounded-full mb-4' />
              <div className=''>
              <h2 className='font-bold '>Test Preparation</h2>
              <p>Our tutors provide strategies, practice materials, 
                and personalized guidance to help students achieve their target scores.</p>
                </div>
            </div>

            <div className="icon-wrapper grid justify-items-center text-center lg:w-[20rem]">
            <ScrollText className='border-2 border-purple-500 p-2 rounded-full mb-4' />
              <div className=''>
              <h2 className='font-bold '>Enrichment Programs</h2>
              <p>Explore your interests and expand your knowledge with our enrichment programs. 
                we offer a variety of engaging courses to spark curiosity and foster creativity.</p>
                </div>
            </div>

          </div>
        </div>
      </Container>
      <div className="relative mt-14 sm:mt-24">
        <Container className="relative">
        </Container>
      </div>
    </section>
  );
}
