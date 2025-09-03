'use client'

import { useState, useEffect } from 'react'
import { Slider } from '@headlessui/react'
import type { Flight } from '@/types'

interface SearchFiltersProps {
    flights: Flight[]
    onFilterChange: (filters: any) => void
}

export default function SearchFilters({ flights, onFilterChange }: SearchFiltersProps) {
    const [maxPrice, setMaxPrice] = useState<number>(0)
    const [selectedStops, setSelectedStops] = useState<number | undefined>(undefined)
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])

    // Calculate filter options from flights
    const maxFlightPrice = Math.max(...flights.map(f => f.price))
    const uniqueStops = [...new Set(flights.map(f => f.stops))].sort()
    const uniqueAirlines = [...new Set(flights.map(f => f.segments[0].airline.code))]
        .map(code => {
            const flight = flights.find(f => f.segments[0].airline.code === code)
            return {
                code,
                name: flight?.segments[0].airline.name || code
            }
        })

    useEffect(() => {
        if (maxFlightPrice > 0 && maxPrice === 0) {
            setMaxPrice(maxFlightPrice)
        }
    }, [maxFlightPrice, maxPrice])

    useEffect(() => {
        onFilterChange({
            maxPrice: maxPrice > 0 ? maxPrice : undefined,
            stops: selectedStops,
            airlines: selectedAirlines.length > 0 ? selectedAirlines : undefined
        })
    }, [maxPrice, selectedStops, selectedAirlines, onFilterChange])

    const handleStopsChange = (stops: number | undefined) => {
        setSelectedStops(selectedStops === stops ? undefined : stops)
    }

    const handleAirlineChange = (airlineCode: string) => {
        setSelectedAirlines(prev =>
            prev.includes(airlineCode)
                ? prev.filter(code => code !== airlineCode)
                : [...prev, airlineCode]
        )
    }

    const clearFilters = () => {
        setMaxPrice(maxFlightPrice)
        setSelectedStops(undefined)
        setSelectedAirlines([])
    }

    return (
        <div className="space-y-6">
            {/* Price Range */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Max Price: ${maxPrice}
                </label>
                <input
                    type="range"
                    min="0"
                    max={maxFlightPrice}
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>${maxFlightPrice}</span>
                </div>
            </div>

            {/* Stops */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Stops
                </label>
                <div className="space-y-2">
                    {uniqueStops.map(stops => (
                        <label key={stops} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedStops === stops}
                                onChange={() => handleStopsChange(stops)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Airlines */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Airlines
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uniqueAirlines.map(airline => (
                        <label key={airline.code} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedAirlines.includes(airline.code)}
                                onChange={() => handleAirlineChange(airline.code)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {airline.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Clear All Filters
            </button>
        </div>
    )
}