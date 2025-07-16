'use client'

import { useState } from 'react'
import { formatPrice, formatDuration, formatDateTime, getStopsText } from '@/lib/utils'
import type { Flight } from '@/types'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface FlightCardProps {
    flight: Flight
    onSelect?: (flight: Flight) => void
}

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
    const [showDetails, setShowDetails] = useState(false)

    const firstSegment = flight.segments[0]
    const lastSegment = flight.segments[flight.segments.length - 1]

    const handleBookNow = () => {
        window.open(flight.deep_link, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {/* Main flight info */}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    {/* Route and time */}
                    <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                            <div className="text-center">
                                <div className="text-lg font-semibold">
                                    {formatDateTime(firstSegment.departure_time).split(', ')[1]}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {firstSegment.origin.code}
                                </div>
                            </div>

                            <div className="flex-1 text-center">
                                <div className="text-sm text-gray-600 mb-1">
                                    {formatDuration(flight.total_duration_minutes)}
                                </div>
                                <div className="relative">
                                    <div className="border-t border-gray-300"></div>
                                    <div className="absolute inset-0 flex justify-center">
                                        <span className="bg-white px-2 text-xs text-gray-500">
                                            {getStopsText(flight.stops)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-lg font-semibold">
                                    {formatDateTime(lastSegment.arrival_time).split(', ')[1]}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {lastSegment.destination.code}
                                </div>
                            </div>
                        </div>

                        {/* Airline info */}
                        <div className="flex items-center text-sm text-gray-600">
                            <span>{firstSegment.airline.name}</span>
                            <span className="mx-2">•</span>
                            <span>{flight.segments.length > 1 ? 'Multiple airlines' : firstSegment.flight_number}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{firstSegment.cabin_class.replace('_', ' ')}</span>
                        </div>
                    </div>

                    {/* Price and book button */}
                    <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {formatPrice(flight.price, flight.currency)}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                            per person
                        </div>
                        <button
                            onClick={handleBookNow}
                            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
                        >
                            Book Now
                        </button>
                    </div>
                </div>

                {/* Provider and details toggle */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                        via {flight.provider}
                    </div>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                        Flight details
                        {showDetails ? (
                            <ChevronUpIcon className="ml-1 h-4 w-4" />
                        ) : (
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded details */}
            {showDetails && (
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                    <div className="space-y-4">
                        {flight.segments.map((segment, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <div className="w-16 text-center">
                                    <div className="text-sm font-medium">
                                        {formatDateTime(segment.departure_time).split(', ')[1]}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {segment.origin.code}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">
                                            {segment.airline.name} {segment.flight_number}
                                        </span>
                                        <span className="text-xs text-gray-600">
                                            {formatDuration(segment.duration_minutes)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {segment.aircraft_type && `${segment.aircraft_type} • `}
                                        {segment.cabin_class.replace('_', ' ')}
                                    </div>
                                </div>

                                <div className="w-16 text-center">
                                    <div className="text-sm font-medium">
                                        {formatDateTime(segment.arrival_time).split(', ')[1]}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {segment.destination.code}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
