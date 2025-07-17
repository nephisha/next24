'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            ⚡ Last-Minute Travel Deals
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Find unbeatable same-day and next-day flight & hotel deals.
                            Compare prices across multiple providers instantly.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                ✈️ Kiwi.com & Skyscanner
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                🏨 Booking.com & More
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                ⚡ Instant Results
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search Section */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />

                            <div className="mt-8">
                                {activeTab === 'flights' ? (
                                    <FlightSearchForm onSearch={handleFlightSearch} isLoading={isLoading} />
                                ) : (
                                    <HotelSearchForm onSearch={handleHotelSearch} isLoading={isLoading} />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                {(searchResults || isLoading || searchError) && (
                    <section className="pb-16">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <SearchResults
                                type={activeTab}
                                results={searchResults ?? undefined}
                                isLoading={isLoading}
                                error={searchError}
                            />
                        </div>
                    </section>
                )}

                {/* Features Section */}
                {!searchResults && !isLoading && (
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Why Choose LastMinute Travel?
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    We specialize in finding the best last-minute deals when you need to travel today or tomorrow
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center p-6">
                                    <div className="text-4xl mb-4">⚡</div>
                                    <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                                    <p className="text-gray-600">
                                        Search multiple providers simultaneously and get results in seconds, not minutes
                                    </p>
                                </div>

                                <div className="text-center p-6">
                                    <div className="text-4xl mb-4">💰</div>
                                    <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                                    <p className="text-gray-600">
                                        Compare prices across Kiwi.com, Skyscanner, Booking.com and more to find the lowest fares
                                    </p>
                                </div>

                                <div className="text-center p-6">
                                    <div className="text-4xl mb-4">📱</div>
                                    <h3 className="text-xl font-semibold mb-2">Mobile Optimized</h3>
                                    <p className="text-gray-600">
                                        Book on the go with our mobile-friendly interface designed for quick searches
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </>
    )
}