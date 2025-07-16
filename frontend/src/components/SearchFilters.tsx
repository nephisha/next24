'use client'

import { useState } from 'react'
import { FunnelIcon } from '@heroicons/react/24/outline'

interface SearchFiltersProps {
    type: 'flights' | 'hotels'
    onFiltersChange: (filters: any) => void
}

export default function SearchFilters({ type, onFiltersChange }: SearchFiltersProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState({
        maxPrice: '',
        stops: 'any',
        airlines: [],
        departure_time: 'any',
        rating: '',
        amenities: []
    })

    const updateFilter = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFiltersChange(newFilters)
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <div className="flex items-center">
                    <FunnelIcon className="h-5 w-5 mr-2 text-gray-600" />
                    <span className="font-medium">Filters</span>
                </div>
                <span className="text-gray-400">
                    {isOpen ? '−' : '+'}
                </span>
            </button>

            {isOpen && (
                <div className="border-t border-gray-100 p-4 space-y-4">
                    {/* Price filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Price
                        </label>
                        <input
                            type="number"
                            placeholder="No limit"
                            value={filters.maxPrice}
                            onChange={(e) => updateFilter('maxPrice', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {type === 'flights' && (
                        <>
                            {/* Stops filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stops
                                </label>
                                <select
                                    value={filters.stops}
                                    onChange={(e) => updateFilter('stops', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="any">Any number of stops</option>
                                    <option value="0">Direct flights only</option>
                                    <option value="1">1 stop or less</option>
                                </select>
                            </div>

                            {/* Departure time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Departure Time
                                </label>
                                <select
                                    value={filters.departure_time}
                                    onChange={(e) => updateFilter('departure_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="any">Any time</option>
                                    <option value="morning">Morning (6AM - 12PM)</option>
                                    <option value="afternoon">Afternoon (12PM - 6PM)</option>
                                    <option value="evening">Evening (6PM - 12AM)</option>
                                </select>
                            </div>
                        </>
                    )}

                    {type === 'hotels' && (
                        <>
                            {/* Rating filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Rating
                                </label>
                                <select
                                    value={filters.rating}
                                    onChange={(e) => updateFilter('rating', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">Any rating</option>
                                    <option value="3">3+ stars</option>
                                    <option value="4">4+ stars</option>
                                    <option value="5">5 stars</option>
                                </select>
                            </div>

                            {/* Amenities */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amenities
                                </label>
                                <div className="space-y-2">
                                    {['Free Wi-Fi', 'Parking', 'Pool', 'Gym', 'Spa'].map((amenity) => (
                                        <label key={amenity} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="mr-2 text-primary-600"
                                                onChange={(e) => {
                                                    const current = filters.amenities
                                                    if (e.target.checked) {
                                                        updateFilter('amenities', [...current, amenity])
                                                    } else {
                                                        updateFilter('amenities', current.filter(a => a !== amenity))
                                                    }
                                                }}
                                            />
                                            <span className="text-sm">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Clear filters */}
                    <button
                        onClick={() => {
                            const emptyFilters = {
                                maxPrice: '',
                                stops: 'any',
                                airlines: [],
                                departure_time: 'any',
                                rating: '',
                                amenities: []
                            }
                            setFilters(emptyFilters)
                            onFiltersChange(emptyFilters)
                        }}
                        className="w-full text-sm text-primary-600 hover:text-primary-700 py-2"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    )
}