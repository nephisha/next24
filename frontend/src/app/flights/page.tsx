'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FlightSearchForm from '@/components/FlightSearchForm'
import SearchResults from '@/components/SearchResults'
import SearchFilters from '@/components/SearchFilters'
import { searchFlights } from '@/lib/api'
import type { FlightSearchParams, FlightSearchResponse } from '@/types'

export default function FlightsPage() {
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<FlightSearchResponse | null>(null)
    const [searchError, setSearchError] = useState<string>('')

    const handleSearch = async (params: FlightSearchParams) => {
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

    const handleFiltersChange = (filters: any) => {
        // Apply filters to current results
        // This would typically re-filter the existing results or trigger a new search
        console.log('Filters changed:', filters)
    }

    return (
        <>
            <Header />

            <main className="flex-1 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ✈️ Flight Search
                        </h1>
                        <p className="text-gray-600">
                            Find the best last-minute flight deals for today and tomorrow
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Search Form & Filters */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Search Flights</h2>
                                <FlightSearchForm onSearch={handleSearch} isLoading={isLoading} />
                            </div>

                            {searchResults && (
                                <SearchFilters type="flights" onFiltersChange={handleFiltersChange} />
                            )}
                        </div>

                        {/* Results */}
                        <div className="lg:col-span-3">
                            <SearchResults
                                type="flights"
                                results={searchResults}
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
