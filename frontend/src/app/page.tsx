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
                {/* Modern Two-Column Search Section */}
                <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden">
                    {/* Modern Background Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse animation-delay-2000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse animation-delay-4000"></div>
                    </div>

                    <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Left Column - Modern Marketing Copy */}
                            <div className="space-y-8">
                                <div className="space-y-8">
                                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                                        Find Your Perfect
                                        <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
                                            Flight Deal
                                        </span>
                                    </h1>

                                    <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                        Compare flights from <span className="font-bold text-cyan-600">600+ airlines</span> worldwide with
                                        <span className="font-bold text-blue-600"> real-time prices</span> in your local currency.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="group flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-white text-lg">✈️</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">600+ Airlines</h3>
                                            <p className="text-gray-600 font-medium">Compare all major carriers instantly</p>
                                        </div>
                                    </div>

                                    <div className="group flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-white text-lg">💎</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Best Prices</h3>
                                            <p className="text-gray-600 font-medium">AI-powered price optimization</p>
                                        </div>
                                    </div>

                                    <div className="group flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-white text-lg">🌍</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Global Coverage</h3>
                                            <p className="text-gray-600 font-medium">200+ countries, 50+ currencies</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Modern Search Form */}
                            <div className="relative">
                                {/* Glassmorphism Card */}
                                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                                    {/* Card Background Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-white/70 rounded-3xl"></div>

                                    <div className="relative z-10">
                                        <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />

                                        <div className="mt-6">
                                            {activeTab === 'flights' ? (
                                                <FlightSearchForm onSearch={handleFlightSearch} isLoading={isLoading} />
                                            ) : (
                                                <HotelSearchForm onSearch={handleHotelSearch} isLoading={isLoading} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-60 animate-bounce"></div>
                                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-40 animate-pulse"></div>
                            </div>
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

                {/* Modern Stats Section */}
                {!searchResults && !isLoading && (
                    <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="w-full h-full" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                            }}></div>
                        </div>

                        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div className="group p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                    <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">600+</div>
                                    <div className="text-white font-semibold text-lg">Airlines</div>
                                    <div className="text-gray-300 text-sm mt-1">Global carriers</div>
                                </div>
                                <div className="group p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                    <div className="text-4xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">50+</div>
                                    <div className="text-white font-semibold text-lg">Currencies</div>
                                    <div className="text-gray-300 text-sm mt-1">Local pricing</div>
                                </div>
                                <div className="group p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                    <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">200+</div>
                                    <div className="text-white font-semibold text-lg">Countries</div>
                                    <div className="text-gray-300 text-sm mt-1">Worldwide coverage</div>
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