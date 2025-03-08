"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function Hero() {
  // State to control text and image visibility
  const [isContentVisible, setIsContentVisible] = useState(true)
  const [contentIndex, setContentIndex] = useState(0)

  // Cycle through content visibility
  useEffect(() => {
    const interval = setInterval(() => {
      setIsContentVisible(false)

      // Wait for exit animation to complete before showing content again
      setTimeout(() => {
        setContentIndex((prev) => (prev + 1) % headings.length)
        setIsContentVisible(true)
      }, 1000)
    }, 5000) // Change content every 5 seconds

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Multiple heading options to cycle through
  const headings = [
    "Online learning that helps your child get ahead",
    "Interactive lessons designed for student success",
    "Personalized education for the digital age",
  ]

  // Multiple image sets to cycle through
  const imageSets = [
    ["hero1.jpg", "hero2.jpg", "hero3.jpg", "hero4.jpg", "hero5.jpg"],
    ["hero5.jpg", "hero4.jpg", "hero3.jpg", "hero2.jpg", "hero1.jpg"],
    ["hero3.jpg", "hero1.jpg", "hero5.jpg", "hero2.jpg", "hero4.jpg"],
  ]

  // Animation variants for text elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  }

  // Animation variants for the button
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.3,
        type: "spring",
        stiffness: 400,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(147, 51, 234, 0.5)", // Purple shadow (was orange)
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 6,
      },
    },
  }

  // Animation variants for images
  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      scale: 0.9,
      y: -30,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeIn",
      },
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 25px rgba(147, 51, 234, 0.3)", // Purple shadow (was orange)
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 8,
      },
    },
  }

  // Function to colorize specific words in orange
  const colorizeText = (text: string, purpleWords: string[]) => {
    const words = text.split(" ")
    return words.map((word, index) => {
      const isPurple = purpleWords.includes(word.toLowerCase().replace(/[.,!?;:]/g, ""))
      return (
        <motion.span
          key={`word-${index}`}
          className={`inline-block mr-2 ${isPurple ? "text-purple-500 font-semibold" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: index * 0.03,
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          exit={{
            opacity: 0,
            y: -20,
            transition: {
              delay: index * 0.01,
              duration: 0.2,
              ease: "easeIn",
            },
          }}
        >
          {word}
        </motion.span>
      )
    })
  }

  return (
    <div className="bg-black">
      <main>
        <div className="relative isolate">
          <svg
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" />
          </svg>

          {/* Animated background gradient - purple tint */}
          <motion.div
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <div
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-purple-400 to-purple-600 opacity-30" // Changed to purple gradient
              style={{
                clipPath:
                  "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
              }}
            />
          </motion.div>

          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  {/* Heading with fade in/out animation */}
                  <div className="overflow-hidden">
                    <AnimatePresence mode="wait">
                      {isContentVisible && (
                        <motion.h1
                          key={`heading-${contentIndex}`}
                          className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {colorizeText(headings[contentIndex], [
                            "helps",
                            "your",
                            "child",
                            "interactive",
                            "designed",
                            "personalized",
                            "digital",
                          ])}
                        </motion.h1>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Paragraph with fade in/out animation */}
                  <AnimatePresence mode="wait">
                    {isContentVisible && (
                      <motion.p
                        key={`paragraph-${contentIndex}`}
                        className="mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        Cupidatat minim id magna ipsum sint{" "}
                        <span className="text-purple-500 font-semibold">dolor qui</span>. Sunt sit in quis cupidatat{" "}
                        <span className="text-purple-500 font-semibold">mollit aute velit</span>. Et labore commodo{" "}
                        <span className="text-purple-500 font-semibold">nulla aliqua</span> proident mollit ullamco
                        exercitation tempor. Sint aliqua anim nulla sunt mollit id pariatur in voluptate cillum.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="mt-10 flex items-center gap-x-6">
                    {/* Button with fade in/out animation */}
                    <AnimatePresence mode="wait">
                      {isContentVisible && (
                        <motion.div
                          key={`button-${contentIndex}`}
                          variants={buttonVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover="hover"
                        >
                          <Link
                            href={"/auth/login"}
                            className="font-dosis rounded-md bg-purple-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                          >
                            Get started
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Live demo link with fade in/out animation */}
                    <AnimatePresence mode="wait">
                      {isContentVisible && (
                        <motion.a
                          key={`demo-${contentIndex}`}
                          href="#"
                          className="text-sm font-semibold leading-6 text-gray-900 flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: 0.3, duration: 0.3 },
                          }}
                          exit={{
                            opacity: 0,
                            x: -10,
                            transition: { duration: 0.2 },
                          }}
                          whileHover={{
                            scale: 1.05,
                            color: "#9333ea", // Purple color on hover (was orange)
                            transition: { duration: 0.1 },
                          }}
                        >
                          Live demo
                          <motion.span
                            aria-hidden="true"
                            className="inline-block ml-1 text-purple-500" // Purple arrow (was orange)
                            initial={{ x: 0 }}
                            whileHover={{
                              x: 5,
                              transition: {
                                type: "spring",
                                stiffness: 800,
                                damping: 5,
                              },
                            }}
                          >
                            →
                          </motion.span>
                        </motion.a>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Image gallery with fade in/out animations */}
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <AnimatePresence mode="wait">
                      {isContentVisible && (
                        <motion.div
                          key={`img1-${contentIndex}`}
                          className="relative"
                          variants={imageVariants}
                          custom={0}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover="hover"
                        >
                          <img
                            src={imageSets[contentIndex][0] || "/placeholder.svg"}
                            alt=""
                            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <AnimatePresence mode="wait">
                      {isContentVisible && (
                        <motion.div
                          key={`img2-${contentIndex}`}
                          className="relative"
                          variants={imageVariants}
                          custom={1}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover="hover"
                        >
                          <img
                            src={imageSets[contentIndex][1] || "/placeholder.svg"}
                            alt=""
                            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {isContentVisible && (
                        <motion.div
                          key={`img3-${contentIndex}`}
                          className="relative"
                          variants={imageVariants}
                          custom={2}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover="hover"
                        >
                          <img
                            src={imageSets[contentIndex][2] || "/placeholder.svg"}
                            alt=""
                            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <AnimatePresence mode="wait">
                      {isContentVisible && (
                        <motion.div
                          key={`img4-${contentIndex}`}
                          className="relative"
                          variants={imageVariants}
                          custom={3}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover="hover"
                        >
                          <img
                            src={imageSets[contentIndex][3] || "/placeholder.svg"}
                            alt=""
                            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {isContentVisible && (
                        <motion.div
                          key={`img5-${contentIndex}`}
                          className="relative"
                          variants={imageVariants}
                          custom={4}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover="hover"
                        >
                          <img
                            src={imageSets[contentIndex][4] || "/placeholder.svg"}
                            alt=""
                            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

