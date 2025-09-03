'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FlightSearchForm from '@/components/FlightSearchForm'
import SearchResults from '@/components/SearchResults'
import SearchFilters from '@/components/SearchFilters'
import { searchFlights } from '@/lib/api'
import type { FlightSearchParams, FlightSearchResponse } from '@/types'
import { ArrowLeft, Plane, Filter } from 'lucide-react'
import Link from 'next/link'

export default function FlightsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<FlightSearchResponse | null>(null)
    const [searchError, setSearchError] = useState<string>('')
    const [showFilters, setShowFilters] = useState(false)
    const [currentSearchParams, setCurrentSearchParams] = useState<FlightSearchParams | null>(null)

    // Check if we have search params from URL (from homepage redirect)
    useEffect(() => {
        const origin = searchParams.get('origin')
        const destination = searchParams.get('destination')
        const departure_date = searchParams.get('departure_date')

        if (origin && destination && departure_date) {
            const params: FlightSearchParams = {
                origin,
                destination,
                departure_date,
                return_date: searchParams.get('return_date') || undefined,
                adults: parseInt(searchParams.get('adults') || '1'),
                children: parseInt(searchParams.get('children') || '0'),
                infants: parseInt(searchParams.get('infants') || '0'),
                cabin_class: searchParams.get('cabin_class') as any || 'economy',
                direct_flights_only: searchParams.get('direct_flights_only') === 'true'
            }

            setCurrentSearchParams(params)
            handleFlightSearch(params)
        }
    }, [searchParams])

    const handleFlightSearch = async (params: FlightSearchParams) => {
        setIsLoading(true)
        setSearchError('')
        setSearchResults(null)
        setCurrentSearchParams(params)

        // Update URL with search parameters
        const urlParams = new URLSearchParams({
            origin: params.origin,
            destination: params.destination,
            departure_date: params.departure_date,
            adults: params.adults.toString(),
            children: params.children.toString(),
            infants: params.infants.toString(),
            cabin_class: params.cabin_class,
            direct_flights_only: params.direct_flights_only?.toString() || 'false'
        })

        if (params.return_date) {
            urlParams.set('return_date', params.return_date)
        }

        router.push(`/flights?${urlParams.toString()}`, { scroll: false })

        try {
            const results = await searchFlights(params)

            // Filter out flights with invalid prices (0 or negative)
            const validFlights = results.flights.filter(flight =>
                flight.price > 0 &&
                flight.currency &&
                flight.currency !== '' &&
                flight.segments.length > 0
            )

            const filteredResults = {
                ...results,
                flights: validFlights,
                total_results: validFlights.length
            }

            setSearchResults(filteredResults)
        } catch (error: any) {
            console.error('Flight search error:', error)
            setSearchError(error.response?.data?.detail || 'Failed to search flights. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleFilterChange = (filters: any) => {
        if (!searchResults) return

        // Apply filters to current results
        let filteredFlights = [...searchResults.flights]

        if (filters.maxPrice) {
            filteredFlights = filteredFlights.filter(flight => flight.price <= filters.maxPrice)
        }

        if (filters.stops !== undefined) {
            filteredFlights = filteredFlights.filter(flight => flight.stops === filters.stops)
        }

        if (filters.airlines && filters.airlines.length > 0) {
            filteredFlights = filteredFlights.filter(flight =>
                filters.airlines.includes(flight.segments[0].airline.code)
            )
        }

        setSearchResults({
            ...searchResults,
            flights: filteredFlights,
            total_results: filteredFlights.length
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Home
                            </Link>
                            <div className="h-6 w-px bg-gray-300" />
                            <div className="flex items-center gap-2">
                                <Plane className="w-5 h-5 text-blue-600" />
                                <h1 className="text-xl font-semibold text-gray-900">Flight Search</h1>
                            </div>
                        </div>

                        {searchResults && (
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - Search Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Search Flights</h2>
                                <p className="text-sm text-gray-600">Find the best deals for your trip</p>
                            </div>

                            <FlightSearchForm
                                onSearch={handleFlightSearch}
                                isLoading={isLoading}
                                initialValues={currentSearchParams}
                            />
                        </div>

                        {/* Filters Panel */}
                        {showFilters && searchResults && (
                            <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                                <SearchFilters
                                    flights={searchResults.flights}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Content - Results */}
                    <div className="lg:col-span-3">
                        {isLoading && (
                            <div className="bg-white rounded-xl shadow-sm border p-8">
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                        <Plane className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                                        Searching for flights...
                                    </h3>
                                    <p className="text-gray-600 text-center max-w-md">
                                        We're scanning hundreds of airlines to find you the best deals. This may take a few moments.
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                        <span>Checking prices from multiple sources...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isLoading && !searchResults && !searchError && (
                            <div className="bg-white rounded-xl shadow-sm border p-8">
                                <div className="text-center py-12">
                                    <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Ready to find your perfect flight?
                                    </h3>
                                    <p className="text-gray-600">
                                        Enter your travel details in the search form to get started.
                                    </p>
                                </div>
                            </div>
                        )}

                        {searchError && (
                            <div className="bg-white rounded-xl shadow-sm border p-8">
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">❌</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Search Error
                                    </h3>
                                    <p className="text-gray-600 mb-4">{searchError}</p>
                                    <button
                                        onClick={() => currentSearchParams && handleFlightSearch(currentSearchParams)}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {searchResults && !isLoading && (
                            <SearchResults
                                type="flights"
                                results={searchResults}
                                isLoading={false}
                                error=""
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}