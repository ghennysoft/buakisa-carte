import { Home } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='fixed bottom-0 left-0 right-0 p-3 bg-orange-200'>
        <Link href={"/home"} className='flex justify-center items-center gap-2 text-gray-500 h-full w-full'>
            <Home />
            <span className='text-lg pt-1'>Retour à l&apos;accueil</span>
        </Link>
    </footer>
  )
}

export default Footer
