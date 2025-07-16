'use client'

import { useState } from 'react'
import FlightCard from './FlightCard'
import HotelCard from './HotelCard'
import LoadingSpinner from './LoadingSpinner'
import type { FlightSearchResponse, HotelSearchResponse } from '@/types'

interface SearchResultsProps {
    type: 'flights' | 'hotels'
    results?: FlightSearchResponse | HotelSearchResponse
    isLoading: boolean
    error?: string
}

export default function SearchResults({ type, results, isLoading, error }: SearchResultsProps) {
    const [sortBy, setSortBy] = useState<string>('price')

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8">
                <LoadingSpinner />
                <p className="text-center text-gray-600 mt-4">
                    Searching for the best {type} deals...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-red-600 text-lg mb-2">❌ Search Error</div>
                <p className="text-gray-600">{error}</p>
            </div>
        )
    }

    if (!results || (type === 'flights' && (results as FlightSearchResponse).flights.length === 0) ||
        (type === 'hotels' && (results as HotelSearchResponse).hotels.length === 0)) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">
                    {type === 'flights' ? '✈️' : '🏨'}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {type} found
                </h3>
                <p className="text-gray-600">
                    Try adjusting your search criteria or dates
                </p>
            </div>
        )
    }

    const items = type === 'flights'
        ? (results as FlightSearchResponse).flights
        : (results as HotelSearchResponse).hotels

    return (
        <div className="space-y-6">
            {/* Results header */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {results.total_results} {type} found
                        </h2>
                        <p className="text-sm text-gray-600">
                            Search completed in {results.search_time_ms}ms
                            {results.cache_hit && ' (cached)'}
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="text-sm text-gray-600">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="price">Price (Low to High)</option>
                            <option value="duration">
                                {type === 'flights' ? 'Duration' : 'Rating'}
                            </option>
                            {type === 'hotels' && <option value="distance">Distance</option>}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results list */}
            <div className="space-y-4">
                {items.map((item: any, index: number) => (
                    type === 'flights' ? (
                        <FlightCard key={item.id || index} flight={item} />
                    ) : (
                        <HotelCard key={item.id || index} hotel={item} />
                    )
                ))}
            </div>

            {/* Load more button (if needed) */}
            {items.length >= 20 && (
                <div className="text-center">
                    <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors">
                        Load More Results
                    </button>
                </div>
            )}
        </div>
    )
}