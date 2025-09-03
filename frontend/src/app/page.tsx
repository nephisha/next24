'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowRight, Plane, Globe, Star, Calendar, Camera, Compass, Heart, Sparkles } from 'lucide-react'
import SearchTabs from '@/components/SearchTabs'
import FlightSearchForm from '@/components/FlightSearchForm'
import HotelSearchForm from '@/components/HotelSearchForm'
import SearchResults from '@/components/SearchResults'
import { searchFlights, searchHotels } from '@/lib/api'
import type { FlightSearchParams, HotelSearchParams, FlightSearchResponse, HotelSearchResponse } from '@/types'

export default function HomePage() {
    const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights')
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<FlightSearchResponse | HotelSearchResponse | null>(null)
    const [searchError, setSearchError] = useState<string>('')

    const handleFlightSearch = async (params: FlightSearchParams) => {
        setIsLoading(true)
        setSearchError('')
        setSearchResults(null)

        try {
            const results = await searchFlights(params)
            setSearchResults(results)
        } catch (error: any) {
            console.error('Flight search error:', error)
            setSearchError(error.response?.data?.detail || 'Failed to search flights. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleHotelSearch = async (params: HotelSearchParams) => {
        setIsLoading(true)
        setSearchError('')
        setSearchResults(null)

        try {
            const results = await searchHotels(params)
            setSearchResults(results)
        } catch (error: any) {
            console.error('Hotel search error:', error)
            setSearchError(error.response?.data?.detail || 'Failed to search hotels. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Hero Section - Search Form Left, Hero Content Right */}
            <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    {/* Floating Travel Elements */}
                    <div className="absolute top-20 left-20 animate-float">
                        <Plane className="w-8 h-8 text-white/20 rotate-45" />
                    </div>
                    <div className="absolute top-40 right-32 animate-float-delayed">
                        <Globe className="w-12 h-12 text-white/15" />
                    </div>
                    <div className="absolute bottom-32 left-16 animate-bounce">
                        <MapPin className="w-6 h-6 text-white/25" />
                    </div>
                    <div className="absolute bottom-20 right-20 animate-pulse">
                        <Camera className="w-10 h-10 text-white/20" />
                    </div>

                    {/* Gradient Orbs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
                        {/* Left Column - Search Form (appears first on mobile) */}
                        <div className="relative order-1 lg:order-1" id="search-section">
                            {/* Glassmorphism Search Card */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                                {/* Card Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl"></div>

                                <div className="relative z-10">
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-white mb-2">Start Your Journey</h3>
                                        <p className="text-blue-200">Find the perfect flight for your next adventure</p>
                                    </div>

                                    <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />

                                    <div className="mt-6">
                                        {activeTab === 'flights' ? (
                                            <FlightSearchForm
                                                onSearch={handleFlightSearch}
                                                isLoading={isLoading}
                                                redirectToResults={true}
                                            />
                                        ) : (
                                            <HotelSearchForm
                                                onSearch={handleHotelSearch}
                                                isLoading={isLoading}
                                                redirectToResults={true}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Decorative Elements */}
                            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-60 animate-bounce"></div>
                            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-40 animate-pulse"></div>
                        </div>

                        {/* Right Column - Hero Content (appears second on mobile) */}
                        <div className="space-y-8 text-center lg:text-left order-2 lg:order-2">
                            {/* Brand Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                <span className="text-white text-sm font-medium">Next24 Travel Platform</span>
                            </div>

                            {/* Main Headline */}
                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                                    Your Next
                                    <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        Adventure
                                    </span>
                                    <span className="block text-4xl md:text-5xl">Awaits</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                                    Discover amazing destinations, find the best flight deals, and plan unforgettable journeys with our AI-powered travel platform.
                                </p>
                            </div>

                            {/* Feature Highlights */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                                        <Plane className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">600+ Airlines</div>
                                        <div className="text-blue-200 text-sm">Best prices guaranteed</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">19+ Destinations</div>
                                        <div className="text-blue-200 text-sm">Expert travel guides</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">Smart Planner</div>
                                        <div className="text-blue-200 text-sm">AI-powered itineraries</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">Local Insights</div>
                                        <div className="text-blue-200 text-sm">Hidden gems & tips</div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-2xl"
                                >
                                    <Plane className="w-5 h-5" />
                                    Find Flights
                                </button>
                                <Link
                                    href="/destinations"
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
                                >
                                    <Compass className="w-5 h-5" />
                                    Explore Destinations
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>



            {/* Balanced Results Section */}
            {(searchResults || isLoading || searchError) && (
                <section className="bg-gray-50 py-8">
                    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
                        <SearchResults
                            type={activeTab}
                            results={searchResults ?? undefined}
                            isLoading={isLoading}
                            error={searchError}
                        />
                    </div>
                </section>
            )}

            {/* Trending Destinations Section */}
            {!searchResults && !isLoading && (
                <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Star className="w-4 h-4" />
                                Trending Now
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                                Popular Destinations
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Discover breathtaking destinations with comprehensive guides, local insights, and unbeatable flight deals
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {[
                                {
                                    name: 'Paris',
                                    country: 'France',
                                    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114',
                                    price: 'From $650',
                                    href: '/destinations/france/paris',
                                    rating: 4.8,
                                    highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine Cruises']
                                },
                                {
                                    name: 'Tokyo',
                                    country: 'Japan',
                                    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
                                    price: 'From $850',
                                    href: '/destinations/japan/tokyo',
                                    rating: 4.9,
                                    highlights: ['Shibuya Crossing', 'Temples', 'Street Food']
                                },
                                {
                                    name: 'New York',
                                    country: 'USA',
                                    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
                                    price: 'From $450',
                                    href: '/destinations/usa/new-york',
                                    rating: 4.7,
                                    highlights: ['Times Square', 'Central Park', 'Broadway']
                                },
                                {
                                    name: 'London',
                                    country: 'UK',
                                    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
                                    price: 'From $550',
                                    href: '/destinations/uk/london',
                                    rating: 4.6,
                                    highlights: ['Big Ben', 'Museums', 'Royal Palaces']
                                }
                            ].map((destination) => (
                                <Link
                                    key={destination.name}
                                    href={destination.href}
                                    className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white"
                                >
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <Image
                                            src={`${destination.image}?w=600&h=400&fit=crop&auto=format&q=80`}
                                            alt={`${destination.name}, ${destination.country}`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            onLoad={() => console.log(`✅ Image loaded: ${destination.name}`)}
                                            onError={() => console.error(`❌ Image failed: ${destination.name}`)}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20" />

                                        {/* Rating Badge */}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                            <span className="text-xs font-semibold text-gray-800">{destination.rating}</span>
                                        </div>

                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <div className="text-white">
                                                <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                                                <p className="text-blue-200 text-sm mb-3">{destination.country}</p>

                                                {/* Highlights */}
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {destination.highlights.map((highlight) => (
                                                        <span
                                                            key={highlight}
                                                            className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30"
                                                        >
                                                            {highlight}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                                        {destination.price}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-white/80 group-hover:text-white transition-colors">
                                                        <span className="text-sm">Explore</span>
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link
                                href="/destinations"
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-2xl"
                            >
                                <Globe className="w-6 h-6" />
                                Discover All 19+ Destinations
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Features & Benefits Section */}
            {!searchResults && !isLoading && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                                Why Choose Next24?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Your complete travel companion with everything you need for the perfect trip
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {[
                                {
                                    icon: <Plane className="w-8 h-8" />,
                                    title: 'Smart Flight Search',
                                    description: 'AI-powered search across 600+ airlines with real-time pricing and instant booking.',
                                    gradient: 'from-blue-500 to-cyan-500'
                                },
                                {
                                    icon: <Globe className="w-8 h-8" />,
                                    title: 'Expert Destination Guides',
                                    description: 'Comprehensive guides for 19+ destinations with local insights and hidden gems.',
                                    gradient: 'from-purple-500 to-pink-500'
                                },
                                {
                                    icon: <Calendar className="w-8 h-8" />,
                                    title: 'Intelligent Itinerary Planner',
                                    description: 'Create perfect trip plans with interactive timelines and collaborative features.',
                                    gradient: 'from-teal-500 to-green-500'
                                },
                                {
                                    icon: <Camera className="w-8 h-8" />,
                                    title: 'Visual Travel Inspiration',
                                    description: 'Stunning photo galleries and interactive maps to inspire your wanderlust.',
                                    gradient: 'from-orange-500 to-red-500'
                                },
                                {
                                    icon: <Heart className="w-8 h-8" />,
                                    title: 'Local Experiences',
                                    description: 'Discover authentic local culture, food, and experiences like a true insider.',
                                    gradient: 'from-pink-500 to-rose-500'
                                },
                                {
                                    icon: <Sparkles className="w-8 h-8" />,
                                    title: 'Personalized Recommendations',
                                    description: 'Get tailored suggestions based on your preferences and travel style.',
                                    gradient: 'from-indigo-500 to-purple-500'
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Stats Row */}
                        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                                    <div className="group">
                                        <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">600+</div>
                                        <div className="text-lg font-semibold mb-1">Airlines</div>
                                        <div className="text-blue-200 text-sm">Global carriers</div>
                                    </div>
                                    <div className="group">
                                        <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">19+</div>
                                        <div className="text-lg font-semibold mb-1">Destinations</div>
                                        <div className="text-blue-200 text-sm">Expert guides</div>
                                    </div>
                                    <div className="group">
                                        <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">50+</div>
                                        <div className="text-lg font-semibold mb-1">Currencies</div>
                                        <div className="text-blue-200 text-sm">Local pricing</div>
                                    </div>
                                    <div className="group">
                                        <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">200+</div>
                                        <div className="text-lg font-semibold mb-1">Countries</div>
                                        <div className="text-blue-200 text-sm">Worldwide</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <Footer />
        </>
    )
}