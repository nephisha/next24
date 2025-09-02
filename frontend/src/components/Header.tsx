'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, MapPin, BookOpen, Calendar, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navigation = [
    { name: 'Flights', href: '/', icon: Plane },
    { name: 'Destinations', href: '/destinations', icon: MapPin },
    { name: 'Guides', href: '/guides', icon: BookOpen },
    { name: 'Planner', href: '/planner', icon: Calendar },
    { name: 'Community', href: '/community', icon: Users },
];

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-2 rounded-lg">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                            Next24
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href ||
                                (item.href === '/destinations' && pathname.startsWith('/destinations')) ||
                                (item.href === '/guides' && pathname.startsWith('/guides')) ||
                                (item.href === '/planner' && pathname.startsWith('/planner')) ||
                                (item.href === '/community' && pathname.startsWith('/community'));

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="space-y-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href ||
                                    (item.href === '/destinations' && pathname.startsWith('/destinations')) ||
                                    (item.href === '/guides' && pathname.startsWith('/guides')) ||
                                    (item.href === '/planner' && pathname.startsWith('/planner'));

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}