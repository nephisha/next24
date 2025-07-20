'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image 
                            src="/next24-logo.png" 
                            alt="Next 24 Logo" 
                            width={200} 
                            height={60}
                            className="h-12 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/flights"
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Flights
                        </Link>
                        <Link
                            href="/hotels"
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Hotels
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-primary-600"
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-3">
                            <Link
                                href="/flights"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Flights
                            </Link>
                            <Link
                                href="/hotels"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Hotels
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
