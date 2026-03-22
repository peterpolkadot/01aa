'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-white text-xl font-bold">
            01aa
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-white/80 hover:text-white transition">
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}