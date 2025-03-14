"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/ux/Container"
import { GraduationCap, BookOpenCheck, ScrollText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Tuition() {
  // State to control visibility of elements
  const [isVisible, setIsVisible] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  // Cycle through animations
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % 3)
        setIsVisible(true)
      }, 800)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Animation variants for consistent animations
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: "easeOut",
      },
    }),
    exit: {
      opacity: 0,
      y: -30,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  }

  // Content for the three sections
  const services = [
    {
      icon: GraduationCap,
      title: "Subject-Specific Tutoring",
      description:
        "Our tutors are experts in their respective fields and tailor their teaching methods to suit each students individual needs and learning style.",
    },
    {
      icon: BookOpenCheck,
      title: "Test Preparation",
      description:
        "Our tutors provide strategies, practice materials, and personalized guidance to help students achieve their target scores.",
    },
    {
      icon: ScrollText,
      title: "Enrichment Programs",
      description:
        "Explore your interests and expand your knowledge with our enrichment programs. we offer a variety of engaging courses to spark curiosity and foster creativity.",
    },
  ]

  return (
    <motion.section
      className="py-20 sm:pt-32 bg-[#800080] text-white overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75 }}
    >
      <Container className="relative z-10">
        <div className="block mx-auto max-w-2xl lg:mx-0 lg:max-w-full">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                className="lg:max-w-2xl"
                variants={fadeInUpVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={0.2}
                key={`header-${activeIndex}`}
              >
                <h2 className="font-display text-4xl font-medium tracking-tighter sm:text-5xl">Tuition</h2>
                <p className="mt-4 font-display text-2xl tracking-tight">
                  At Edcenta, we are committed to providing high-quality education and personalized learning experiences
                  to help students excel academically.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="block lg:flex w-full justify-between pt-20 gap-8">
            <AnimatePresence mode="wait">
              {isVisible &&
                services.map((service, index) => {
                  const Icon = service.icon
                  const isActive = activeIndex === index

                  return (
                    <motion.div
                      key={`service-${index}-${activeIndex}`}
                      className={`icon-wrapper grid justify-items-center text-center lg:w-[20rem] mb-12 lg:mb-0 ${isActive ? "scale-105" : "scale-100"}`}
                      variants={fadeInUpVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={0.4 + index * 0.2}
                    >
                      <motion.div
                        className="relative"
                        initial={{ rotate: 0 }}
                        animate={
                          isActive
                            ? {
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                              }
                            : {}
                        }
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                          times: [0, 0.3, 0.6, 1],
                        }}
                      >
                        <Icon
                          className={`border-2 ${isActive ? "border-white" : "border-purple-500"} p-2 rounded-full mb-4 h-12 w-12 transition-colors duration-300`}
                        />
                        {isActive && (
                          <motion.div
                            className="absolute -inset-1 rounded-full bg-white/20 -z-10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.div>

                      <div className="">
                        <motion.h2
                          className={`font-bold text-xl mb-2 ${isActive ? "text-white" : "text-white/90"}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.2, duration: 0.4 }}
                        >
                          {service.title}
                        </motion.h2>
                        <motion.p
                          className={`${isActive ? "text-white" : "text-white/80"}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 + index * 0.2, duration: 0.4 }}
                        >
                          {service.description}
                        </motion.p>
                      </div>
                    </motion.div>
                  )
                })}
            </AnimatePresence>
          </div>
        </div>
      </Container>

      {/* Background animation elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence>
          {isVisible && (
            <>
              <motion.div
                className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-400/10 blur-3xl"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 0.6, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 1 }}
              />
              <motion.div
                className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-300/10 blur-3xl"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 0.5, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

