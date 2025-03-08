"use client"
import { Fragment, useState, useEffect } from "react"
import type React from "react"

import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react"
import {
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon, RectangleGroupIcon } from "@heroicons/react/20/solid"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding where your traffic is coming from",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers with our engagement tool",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers' data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Your customers' data will be safe and secure",
    href: "#",
    icon: SquaresPlusIcon,
  },
]

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
  { name: "View all products", href: "#", icon: RectangleGroupIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  return (
    <header
      className={classNames(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/95 backdrop-blur-md shadow-md" : "bg-black",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 overflow-hidden">
            <span className="sr-only">Your Company</span>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Image src="/logo.png" alt="" width={100} height={100} className="h-14 w-auto" />
            </motion.div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-full p-2.5 text-white hover:bg-purple-800/50 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <Popover.Group className="hidden lg:flex lg:gap-x-8">
          <Popover>
            {({ open }) => (
              <>
                <Popover.Button
                  className={classNames(
                    "flex items-center gap-x-1 text-md font-semibold leading-6 transition-all duration-200",
                    open ? "text-white" : "text-white hover:text-purple-400",
                  )}
                >
                  Learn
                  <ChevronDownIcon
                    className={classNames(
                      "h-5 w-5 flex-none transition-transform duration-200",
                      open ? "rotate-180 text-white" : "text-white",
                    )}
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <Popover.Panel className="absolute inset-x-0 top-full -z-10 mt-4 bg-white shadow-lg ring-1 ring-gray-900/5 rounded-2xl overflow-hidden">
                    <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-8 lg:px-8 xl:gap-x-8">
                      {products.map((item) => (
                        <div
                          key={item.name}
                          className="group relative rounded-xl p-6 text-md leading-6 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors duration-200">
                            <item.icon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                          </div>
                          <a
                            href={item.href}
                            className="mt-4 block font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </a>
                          <p className="mt-1 text-gray-600">{item.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50">
                      <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-3 divide-x divide-gray-900/5 border-x border-gray-900/5">
                          {callsToAction.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="flex items-center justify-center gap-x-2.5 p-4 text-md font-semibold leading-6 text-gray-900 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                            >
                              <item.icon className="h-5 w-5 flex-none text-purple-500" aria-hidden="true" />
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>

          <NavLink href="/about_us">About Us</NavLink>
          <NavLink href="/faqs">FAQs</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </Popover.Group>

        {/* Login button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="/auth/login"
            className="group relative inline-flex items-center overflow-hidden rounded-full bg-purple-600 px-6 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
          >
            <span className="absolute -end-full transition-all group-hover:end-4">
              <svg
                className="h-5 w-5 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>

            <span className="text-sm font-medium transition-all group-hover:me-4">Log in</span>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" aria-hidden="true" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Your Company</span>
              <Image className="h-10 w-auto" src="/logo.png" width={100} height={100} alt="" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-full p-2.5 text-white hover:bg-purple-800/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-white hover:bg-purple-800/50 transition-colors">
                        Learn
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180 text-purple-400" : "",
                            "h-5 w-5 flex-none transition-transform duration-200",
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...products, ...callsToAction].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-md font-semibold leading-7 text-white hover:bg-purple-800/50 hover:text-purple-400 transition-colors"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <MobileNavLink href="/about_us" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </MobileNavLink>
                <MobileNavLink href="/faqs" onClick={() => setMobileMenuOpen(false)}>
                  FAQs
                </MobileNavLink>
                <MobileNavLink href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </MobileNavLink>
              </div>
              <div className="py-6">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-base font-semibold text-white hover:bg-purple-700 transition-colors"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

// Reusable NavLink component with hover effect - Updated to white text
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative text-md font-semibold leading-6 text-white transition-colors hover:text-purple-400"
    >
      {children}
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-400 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
    </Link>
  )
}

// Mobile NavLink component - Updated to white text
function MobileNavLink({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-purple-800/50 hover:text-purple-400 transition-colors"
    >
      {children}
    </Link>
  )
}

