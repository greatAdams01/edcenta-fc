"use client"
import Image from "next/image"

import { motion, AnimatePresence } from "framer-motion"

import { Container } from "@/components/ux/Container"
import logoLaravel from "@/images/logos/laravel.svg"
import logoMirage from "@/images/logos/mirage.svg"
import logoStatamic from "@/images/logos/statamic.svg"
import logoStaticKit from "@/images/logos/statickit.svg"
import logoTransistor from "@/images/logos/transistor.svg"
import logoTuple from "@/images/logos/tuple.svg"

const sponsors = [
  { name: "Transistor", logo: logoTransistor },
  { name: "Tuple", logo: logoTuple },
  { name: "StaticKit", logo: logoStaticKit },
  { name: "Mirage", logo: logoMirage },
  { name: "Laravel", logo: logoLaravel },
  { name: "Statamic", logo: logoStatamic },
]

export function Sponsors() {
  return (
    <motion.section
      id="sponsors"
      aria-label="Sponsors"
      className="py-20 sm:py-32 bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75 }}
    >
      <Container>
        <motion.h2
          className="mx-auto max-w-2xl text-center font-display text-4xl font-medium tracking-tighter text-white sm:text-5xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
        >
          Current sponsorships for our workshops and speakers.
        </motion.h2>
        <div className="mx-auto mt-20 grid max-w-max grid-cols-1 place-content-center gap-x-32 gap-y-12 sm:grid-cols-3 md:gap-x-16 lg:gap-x-32">
          <AnimatePresence>
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.name}
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="relative p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <motion.div
                    initial={{ filter: "brightness(0.8) invert(1)", opacity: 0.7 }}
                    whileInView={{ filter: "brightness(1) invert(1)", opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={sponsor.logo || "/placeholder.svg"}
                      alt={sponsor.name}
                      unoptimized
                      className="h-12 w-auto"
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </motion.section>
  )
}

