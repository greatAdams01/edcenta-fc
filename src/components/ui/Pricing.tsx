"use client"

import type React from "react"

import { useEffect, useId, useState } from "react"

import { motion, AnimatePresence } from "framer-motion"

import { Check, Sparkles } from "lucide-react"

import { Container } from "@/components/ux/Container"
import { Price } from "@/utils/Price"

function ImageClipPaths({ id, ...props }: React.ComponentPropsWithoutRef<"svg"> & { id: string }) {
  return (
    <svg aria-hidden="true" width={0} height={0} {...props}>
      <defs>
        <clipPath id={`${id}-0`} clipPathUnits="objectBoundingBox">
          <path d="M0,0 h0.729 v0.129 h0.121 l-0.016,0.032 C0.815,0.198,0.843,0.243,0.885,0.243 H1 v0.757 H0.271 v-0.086 l-0.121,0.057 v-0.214 c0,-0.032,-0.026,-0.057,-0.057,-0.057 H0 V0" />
        </clipPath>
        <clipPath id={`${id}-1`} clipPathUnits="objectBoundingBox">
          <path d="M1,1 H0.271 v-0.129 H0.15 l0.016,-0.032 C0.185,0.802,0.157,0.757,0.115,0.757 H0 V0 h0.729 v0.086 l0.121,-0.057 v0.214 c0,0.032,0.026,0.057,0.057,0.057 h0.093 v0.7" />
        </clipPath>
        <clipPath id={`${id}-2`} clipPathUnits="objectBoundingBox">
          <path d="M1,0 H0.271 v0.129 H0.15 l0.016,0.032 C0.185,0.198,0.157,0.243,0.115,0.243 H0 v0.757 h0.729 v-0.086 l0.121,0.057 v-0.214 c0,-0.032,0.026,-0.057,0.057,-0.057 h0.093 V0" />
        </clipPath>
      </defs>
    </svg>
  )
}

export function Pricing() {
  const id = useId()
  const [tabOrientation, setTabOrientation] = useState("horizontal")

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
    <section id="speakers" aria-labelledby="speakers-title" className="py-20 sm:py-32 bg-gray-900">
      <ImageClipPaths id={id} />
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 id="speakers-title" className="font-display text-4xl font-medium tracking-tighter text-white sm:text-5xl">
            Pricing
          </h2>
          <p className="mt-4 font-display text-2xl tracking-tight text-white/90">
            Whether you are an individual learner looking to enhance your skills or a group seeking comprehensive
            educational solutions, we have the best plan for you.
          </p>
        </div>
        <AnimatePresence mode="wait">
          <section className="my-10 grid md:grid-cols-3 gap-x-8 gap-y-4">
            {Price.map((price: any, index: any) => (
              <motion.div
                key={index}
                className="transition-all ease-in-out delay-500 duration-1000 border border-purple-500 hover:border-2 hover:shadow-lg hover:shadow-purple-500 rounded-md p-4 leading-loose bg-gray-800"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75 }}
                whileHover={{
                  scale: 1.02,
                }}
              >
                <div className="grid gap-y-4">
                  <div className="w-full flex justify-center">
                    {price.popular === true ? (
                      <p className="flex items-center bg-purple-500 px-2 rounded-full text-white font-bold">
                        <Sparkles className="mr-px w-4" />
                        Most Popular
                      </p>
                    ) : null}
                  </div>
                  <h2 className="font-bold text-2xl text-center text-white">{price.name}</h2>
                  <p className="text-center text-lg font-light text-white/70">{price.description}</p>
                  <div className="w-full flex justify-center">
                    <motion.button
                      type="button"
                      className="w-full transition-all ease-in-out delay-500 duration-1000 rounded-md bg-purple-600 hover:bg-purple-700 p-2 text-white font-bold"
                    >
                      Start Plan
                    </motion.button>
                  </div>
                  <div className="w-full h-px bg-purple-500 rounded-full" />
                </div>
                {price.points.map((point: any, index: any) => (
                  <div key={index} className="flex my-2 gap-x-4">
                    <div className="w-2 h-2 mt-1 mx-4">
                      <Check className="text-purple-400" />
                    </div>
                    <p className="text-white/90">{point.point}</p>
                  </div>
                ))}
              </motion.div>
            ))}
          </section>
        </AnimatePresence>
      </Container>
    </section>
  )
}

