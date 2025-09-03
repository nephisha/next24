'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import HotelSearchForm from '@/components/HotelSearchForm'
import SearchResults from '@/components/SearchResults'
import { searchHotels } from '@/lib/api'
import type { HotelSearchParams, HotelSearchResponse } from '@/types'
import { ArrowLeft, Building2, Filter } from 'lucide-react'
import Link from 'next/link'

export default function HotelsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<HotelSearchResponse | null>(null)
    const [searchError, setSearchError] = useState<string>('')
    const [showFilters, setShowFilters] = useState(false)
    const [currentSearchParams, setCurrentSearchParams] = useState<HotelSearchParams | null>(null)

    // Check if we have search params from URL (from homepage redirect)
    useEffect(() => {
        const destination = searchParams.get('destination')
        const check_in = searchParams.get('check_in')
        const check_out = searchParams.get('check_out')

        if (destination && check_in && check_out) {
            const params: HotelSearchParams = {
                destination,
                check_in,
                check_out,
                adults: parseInt(searchParams.get('adults') || '2'),
                children: parseInt(searchParams.get('children') || '0'),
                rooms: parseInt(searchParams.get('rooms') || '1'),
            }

            setCurrentSearchParams(params)
            handleHotelSearch(params)
        }
    }, [searchParams])

    const handleHotelSearch = async (params: HotelSearchParams) => {
        setIsLoading(true)
        setSearchError('')
        setSearchResults(null)
        setCurrentSearchParams(params)

        // Update URL with search parameters
        const urlParams = new URLSearchParams({
            destination: params.destination,
            check_in: params.check_in,
            check_out: params.check_out,
            adults: params.adults.toString(),
            children: params.children.toString(),
            rooms: params.rooms.toString(),
        })

        router.push(`/hotels?${urlParams.toString()}`, { scroll: false })

        try {
            const results = await searchHotels(params)

            // Filter out hotels with invalid prices (0 or negative)
            const validHotels = results.hotels.filter(hotel =>
                hotel.price_per_night > 0 &&
                hotel.currency &&
                hotel.currency !== ''
            )

            const filteredResults = {
                ...results,
                hotels: validHotels,
                total_results: validHotels.length
            }

            setSearchResults(filteredResults)
        } catch (error: any) {
            console.error('Hotel search error:', error)
            setSearchError(error.response?.data?.detail || 'Failed to search hotels. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleFilterChange = (filters: any) => {
        if (!searchResults) return

        // Apply filters to current results
        let filteredHotels = [...searchResults.hotels]

        if (filters.maxPrice) {
            filteredHotels = filteredHotels.filter(hotel => hotel.price_per_night <= filters.maxPrice)
        }

        if (filters.rating) {
            filteredHotels = filteredHotels.filter(hotel => hotel.rating && hotel.rating >= filters.rating)
        }

        if (filters.amenities && filters.amenities.length > 0) {
            filteredHotels = filteredHotels.filter(hotel =>
                filters.amenities.some((amenity: string) =>
                    hotel.amenities?.some(hotelAmenity => hotelAmenity.name === amenity)
                )
            )
        }

        setSearchResults({
            ...searchResults,
            hotels: filteredHotels,
            total_results: filteredHotels.length
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
                                <Building2 className="w-5 h-5 text-blue-600" />
                                <h1 className="text-xl font-semibold text-gray-900">Hotel Search</h1>
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
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Search Hotels</h2>
                                <p className="text-sm text-gray-600">Find the perfect accommodation</p>
                            </div>

                            <HotelSearchForm
                                onSearch={handleHotelSearch}
                                isLoading={isLoading}
                                initialValues={currentSearchParams}
                            />
                        </div>

                        {/* Filters Panel */}
                        {showFilters && searchResults && (
                            <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                                {/* Hotel filters would go here */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price Range
                                        </label>
                                        <input
                                            type="range"
                                            className="w-full"
                                            min="0"
                                            max="1000"
                                            onChange={(e) => handleFilterChange({ maxPrice: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Minimum Rating
                                        </label>
                                        <select
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            onChange={(e) => handleFilterChange({ rating: parseFloat(e.target.value) })}
                                        >
                                            <option value="0">Any Rating</option>
                                            <option value="3">3+ Stars</option>
                                            <option value="4">4+ Stars</option>
                                            <option value="4.5">4.5+ Stars</option>
                                        </select>
                                    </div>
                                </div>
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
                                        <Building2 className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                                        Searching for hotels...
                                    </h3>
                                    <p className="text-gray-600 text-center max-w-md">
                                        We're checking thousands of hotels to find you the best deals and availability.
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                        <span>Comparing prices from multiple sources...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isLoading && !searchResults && !searchError && (
                            <div className="bg-white rounded-xl shadow-sm border p-8">
                                <div className="text-center py-12">
                                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Ready to find your perfect hotel?
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
                                        onClick={() => currentSearchParams && handleHotelSearch(currentSearchParams)}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {searchResults && !isLoading && (
                            <SearchResults
                                type="hotels"
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