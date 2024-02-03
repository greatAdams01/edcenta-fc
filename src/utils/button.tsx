import React from 'react'
import Link from 'next/link'

const button = () => {
  return (
    <div>
      <Link href="#" className='bg-[#0045BC] font-bold rounded-md py-4 px-6 text-white hover:bg-transparent hover:ring-[#0045BC] ring-2 hover:text-[#0045BC] hover:font-black '>Create free account</Link>
    </div>
  )
}

export default button
