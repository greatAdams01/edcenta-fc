"use client"

import { useEffect, useId, useState } from "react"
import Image from "next/image"
import { Tab } from "@headlessui/react"
import clsx from "clsx"

import { motion, AnimatePresence } from "framer-motion"

import { Container } from "@/components/ux/Container"
import { DiamondIcon } from "@/components/ux/DiamondIcon"

const days = [
  {
    step: "Step 1",
    date: "Create account",
    dateTime: "",
    speakers: [
      {
        name: "Create Your EdCenta Account",
        info: "Start your journey by creating a personalized EdCenta account. This will be your gateway to a world of knowledge",
        image: "/istockphoto-886934266-612x612.jpg",
      },
      {
        name: "Set Your Learning Preferences",
        info: "Tailor your learning experience by letting us know your interests. This step helps us recommend courses that align with your goals. ",
        image: "/istockphoto-510398013-612x612.jpg",
      },
      {
        name: "Receive Personalized Recommendations",
        info: `Enjoy a tailored learning experience with content recommendations suited to your preferences.`,
        image: "/istockphoto-1308840815-612x612.jpg",
      },
    ],
  },
  {
    step: "Step 2",
    date: "Start learning",
    dateTime: "",
    speakers: [
      {
        name: "Explore and Start Learning",
        info: `Now that your account is set up, it's time to dive into the world of learning resources.`,
        image: "/istockphoto-1166892018-612x612.jpg",
      },
      {
        name: "Engage in Interactive Learning",
        info: "Experience a dynamic and interactive learning environment. Immerse yourself in Live Workshops, Virtual Labs, Peer Collaborations",
        image: "/istockphoto-1413666057-612x612.jpg",
      },
      {
        name: "Stay Informed with Learning Insights",
        info: "Stay updated and informed with insights that enhance your learning journey.",
        image: "/istockphoto-506102084-612x612.jpg",
      },
    ],
  },
  {
    step: "Step 3",
    date: "Measure progress",
    dateTime: "",
    speakers: [
      {
        name: "Measure Your Progress",
        info: `As you progress through your learning journey, we'll help you keep track of your achievements.`,
        image: "/istockphoto-1470159933-612x612.jpg",
      },
      {
        name: "Stay Updated with Notifications",
        info: "Receive timely updates on new courses, events, and community activities.",
        image: "/istockphoto-950603300-612x612.jpg",
      },
      {
        name: "Badges and Certificates",
        info: " Earn badges for completing courses and certificates for mastering skills.",
        image: "/istockphoto-1284585970-612x612.jpg",
      },
    ],
  },
]

export function Learn() {
  const id = useId()
  const [tabOrientation, setTabOrientation] = useState("horizontal")
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const lgMediaQuery = window.matchMedia("(min-width: 1024px)")

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal")
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener("change", onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange)
    }
  }, [])

  return (
    <motion.section
      id="speakers"
      aria-labelledby="speakers-title"
      className="py-20 sm:py-32 bg-gray-900"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75 }}
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="speakers-title"
            className="font-display text-4xl font-medium tracking-tighter text-orange-500 sm:text-5xl"
          >
            Learn
          </h2>
          <p className="mt-4 font-display text-2xl tracking-tight text-orange-400">
            Learn from the experts from cutting-edge Institutions across the globe.
          </p>
        </div>
        <Tab.Group
          as="div"
          className="mt-14 grid grid-cols-1 items-start gap-x-8 gap-y-8 sm:mt-16 sm:gap-y-16 lg:mt-24 lg:grid-cols-4"
          vertical={tabOrientation === "vertical"}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
        >
          <div className="relative -mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:block sm:overflow-visible sm:pb-0">
            <div className="absolute bottom-0 left-0.5 top-2 hidden w-px bg-gray-700 lg:block" />
            <Tab.List className="grid auto-cols-auto grid-flow-col justify-start gap-x-8 gap-y-10 whitespace-nowrap px-4 sm:mx-auto sm:max-w-2xl sm:grid-cols-3 sm:px-0 sm:text-center lg:grid-flow-row lg:grid-cols-1 lg:text-left">
              {days.map((day, dayIndex) => (
                <div key={day.dateTime} className="relative lg:pl-8">
                  <DiamondIcon
                    className={clsx(
                      "absolute left-[-0.5px] top-[0.5625rem] hidden h-1.5 w-1.5 overflow-visible lg:block",
                      dayIndex === selectedIndex
                        ? "fill-orange-500 stroke-orange-500"
                        : "fill-transparent stroke-gray-500",
                    )}
                  />
                  <div className="relative">
                    <div
                      className={clsx(
                        "font-mono text-sm",
                        dayIndex === selectedIndex ? "text-orange-500" : "text-orange-400/70",
                      )}
                    >
                      <Tab className="ui-not-focus-visible:outline-none">
                        <span className="absolute inset-0" />
                        {day.step}
                      </Tab>
                    </div>
                    <time
                      dateTime={day.dateTime}
                      className={clsx(
                        "mt-1.5 block text-md lg:text-2xl font-semibold tracking-tight transition-colors duration-300",
                        dayIndex === selectedIndex ? "text-white" : "text-white/70",
                      )}
                    >
                      {day.date}
                    </time>
                  </div>
                </div>
              ))}
            </Tab.List>
          </div>
          <Tab.Panels className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {days.map(
                (day, dayIndex) =>
                  dayIndex === selectedIndex && (
                    <motion.div
                      key={day.dateTime}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-y-16 md:grid-cols-3"
                    >
                      {day.speakers.map((speaker, speakerIndex) => (
                        <motion.div
                          key={speakerIndex}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.5,
                              delay: speakerIndex * 0.1,
                            },
                          }}
                          exit={{
                            opacity: 0,
                            transition: {
                              duration: 0.3,
                              delay: speakerIndex * 0.05,
                            },
                          }}
                        >
                          <div className="group relative h-[17.5rem] transform overflow-hidden rounded-2xl">
                            {/* Card with glass effect and gradient border */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/30 via-transparent to-orange-800/20 p-[1px] shadow-xl transition-all duration-300 group-hover:shadow-orange-500/20">
                              <div className="absolute inset-0 rounded-2xl backdrop-blur-sm bg-gray-800/80" />
                            </div>

                            {/* Image container with hover effects */}
                            <div className="absolute inset-[1px] overflow-hidden rounded-2xl">
                              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 to-gray-900/60 opacity-70 transition-opacity duration-300 group-hover:opacity-50" />
                              <Image
                                className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                                src={speaker.image || "/placeholder.svg"}
                                width={500}
                                height={500}
                                alt={speaker.name}
                                priority
                                sizes="(min-width: 1280px) 17.5rem, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                              />

                              {/* Overlay with info that appears on hover */}
                              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <h3 className="font-display text-xl font-bold tracking-tight text-white">
                                  {speaker.name}
                                </h3>
                                <p className="mt-2 text-sm tracking-tight text-white/90 line-clamp-2">{speaker.info}</p>
                              </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-orange-500/20 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="absolute bottom-4 left-4 h-6 w-6 rounded-full bg-orange-500/30 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          </div>

                          {/* Card info below the image */}
                          <div className="mt-6 px-2">
                            <h3 className="font-display text-xl font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors duration-300">
                              {speaker.name}
                            </h3>
                            <p className="mt-2 text-base tracking-tight text-white/80">{speaker.info}</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </Tab.Panels>
        </Tab.Group>
      </Container>
    </motion.section>
  )
}

