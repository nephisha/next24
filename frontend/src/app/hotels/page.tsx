'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HotelSearchForm from '@/components/HotelSearchForm'
import SearchResults from '@/components/SearchResults'
import SearchFilters from '@/components/SearchFilters'
import { searchHotels } from '@/lib/api'
import type { HotelSearchParams, HotelSearchResponse } from '@/types'

export default function HotelsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<HotelSearchResponse | null>(null)
    const [searchError, setSearchError] = useState<string>('')

    const handleSearch = async (params: HotelSearchParams) => {
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

    const handleFiltersChange = (filters: any) => {
        console.log('Filters changed:', filters)
    }

    return (
        <>
            <Header />

            <main className="flex-1 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🏨 Hotel Search
                        </h1>
                        <p className="text-gray-600">
                            Discover amazing last-minute hotel deals for tonight and tomorrow
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Search Form & Filters */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Search Hotels</h2>
                                <HotelSearchForm onSearch={handleSearch} isLoading={isLoading} />
                            </div>

                            {searchResults && (
                                <SearchFilters type="hotels" onFiltersChange={handleFiltersChange} />
                            )}
                        </div>

                        {/* Results */}
                        <div className="lg:col-span-3">
                            <SearchResults
                                type="hotels"
                                results={searchResults ?? undefined}
                                isLoading={isLoading}
                                error={searchError}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}
