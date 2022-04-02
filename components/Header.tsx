import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header className="mx-auto flex max-w-7xl justify-between p-5">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-44 cursor-pointer object-contain"
            src="https://links.papareact.com/yvf"
            alt="Blog Logo"
          />
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full border-2 border-green-600 px-4 py-1 hover:bg-green-600 hover:text-white">
            Follow
          </h3>
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <h3>Sign In</h3>
        <h3 className="rounded-full border-2 border-green-600 px-4 py-1 hover:bg-green-600 hover:text-white">
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
