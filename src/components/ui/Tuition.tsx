"use client"

import { Container } from '@/components/ux/Container';
import { GraduationCap, BookOpenCheck, ScrollText } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion'

export function Tuition() {
  return (
    <motion.section className="py-20 sm:pt-32 bg-[#0045BC] text-white "
    initial={{opacity:0}}
    whileInView={{opacity:1}}
    viewport={{once:true}}
    transition={{duration:0.75}}
    >
      <Container className="relative z-10">
        <div className="block mx-auto max-w-2xl lg:mx-0 lg:max-w-full">
          
          <motion.div className='lg:max-w-2xl'
          initial={{opacity:0, y: 100}}
          whileInView={{opacity:1, y:0}}
          viewport={{once: true}}
          transition={{duration:0.5, delay:0.5}}
          >
            <h2 className="font-display text-4xl font-medium tracking-tighter sm:text-5xl ">
              Tuition
            </h2>
            <p className="mt-4 font-display text-2xl tracking-tight ">
              At Edcenta, we are committed to providing high-quality education and personalized learning experiences to help students excel academically.
            </p>
          </motion.div>

          <div className='block lg:flex w-full justify-between pt-20'>

            <motion.div className="icon-wrapper grid justify-items-center text-center lg:w-[20rem]"
            initial={{opacity:0, y:100}}
            whileInView={{opacity:1, y:0}}
            viewport={{once: true}}
            transition={{duration:0.5, delay:1}}
            >
              <GraduationCap className='border-2 border-purple-500 p-2 rounded-full mb-4' />
              <div className=''>
              <h2 className='font-bold '>Subject-Specific Tutoring</h2>
              <p>Our tutors are experts in their respective fields and tailor their teaching methods 
                to suit each students individual needs and learning style.</p>
                </div>
            </motion.div>

            <motion.div className="icon-wrapper grid justify-items-center text-center lg:w-[20rem]"
            initial={{opacity:0, y:100}}
            whileInView={{opacity:1, y:0}}
            viewport={{once: true}}
            transition={{duration:0.5, delay:1.5}}
            >
              <BookOpenCheck className='border-2 border-purple-500 p-2 rounded-full mb-4' />
              <div className=''>
              <h2 className='font-bold '>Test Preparation</h2>
              <p>Our tutors provide strategies, practice materials, 
                and personalized guidance to help students achieve their target scores.</p>
                </div>
            </motion.div>

            <motion.div className="icon-wrapper grid justify-items-center text-center lg:w-[20rem]"
            initial={{opacity:0, y:100}}
            whileInView={{opacity:1, y:0}}
            viewport={{once: true}}
            transition={{duration:0.5, delay:2}}          
            >
            <ScrollText className='border-2 border-purple-500 p-2 rounded-full mb-4' />
              <div className=''>
              <h2 className='font-bold '>Enrichment Programs</h2>
              <p>Explore your interests and expand your knowledge with our enrichment programs. 
                we offer a variety of engaging courses to spark curiosity and foster creativity.</p>
                </div>
            </motion.div>

          </div>
        </div>
      </Container>
      <div className="relative mt-14 sm:mt-24">
        <Container className="relative">
        </Container>
      </div>
    </motion.section>
  );
}