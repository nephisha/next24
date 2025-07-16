'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Hotel } from '@/types'
import { StarIcon, MapPinIcon, WifiIcon, CarIcon } from '@heroicons/react/24/solid'

interface HotelCardProps {
    hotel: Hotel
    onSelect?: (hotel: Hotel) => void
}

export default function HotelCard({ hotel, onSelect }: HotelCardProps) {
    const [imageError, setImageError] = useState(false)

    const handleBookNow = () => {
        window.open(hotel.deep_link, '_blank', 'noopener,noreferrer')
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <StarIcon
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
            />
        ))
    }

    const getAmenityIcon = (amenityName: string) => {
        const name = amenityName.toLowerCase()
        if (name.includes('wifi') || name.includes('internet')) {
            return <WifiIcon className="h-4 w-4" />
        }
        if (name.includes('parking')) {
            return <CarIcon className="h-4 w-4" />
        }
        return null
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex">
                {/* Hotel image */}
                <div className="w-48 h-48 relative flex-shrink-0">
                    {hotel.images.length > 0 && !imageError ? (
                        <Image
                            src={hotel.images[0].url}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="text-gray-400 text-center">
                                <div className="text-4xl mb-2">🏨</div>
                                <div className="text-sm">No image</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hotel info */}
                <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            {/* Hotel name and rating */}
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold text-gray-900 truncate pr-4">
                                    {hotel.name}
                                </h3>
                                {hotel.rating && (
                                    <div className="flex items-center">
                                        {renderStars(hotel.rating)}
                                        <span className="ml-1 text-sm text-gray-600">
                                            ({hotel.rating})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                <span>{hotel.location.address}</span>
                                {hotel.location.distance_to_center_km && (
                                    <span className="ml-2">
                                        • {hotel.location.distance_to_center_km}km from center
                                    </span>
                                )}
                            </div>

                            {/* Review score */}
                            {hotel.review_score && (
                                <div className="flex items-center text-sm mb-3">
                                    <div className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        {hotel.review_score.toFixed(1)}
                                    </div>
                                    <span className="ml-2 text-gray-600">
                                        {hotel.review_count && `${hotel.review_count} reviews`}
                                    </span>
                                </div>
                            )}

                            {/* Room info */}
                            <div className="text-sm text-gray-600 mb-3">
                                <span className="font-medium">{hotel.room_type.name}</span>
                                <span className="mx-2">•</span>
                                <span>Max {hotel.room_type.max_occupancy} guests</span>
                                {hotel.breakfast_included && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <span className="text-green-600">Breakfast included</span>
                                    </>
                                )}
                            </div>

                            {/* Amenities */}
                            {hotel.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
                                        >
                                            {getAmenityIcon(amenity.name)}
                                            <span className={getAmenityIcon(amenity.name) ? 'ml-1' : ''}>
                                                {amenity.name}
                                            </span>
                                        </div>
                                    ))}
                                    {hotel.amenities.length > 4 && (
                                        <div className="text-xs text-gray-500 px-2 py-1">
                                            +{hotel.amenities.length - 4} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Price and book button */}
                        <div className="text-right ml-6">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {formatPrice(hotel.price_per_night, hotel.currency)}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                                per night
                            </div>
                            <div className="text-lg font-semibold text-gray-700 mb-3">
                                {formatPrice(hotel.total_price, hotel.currency)} total
                            </div>
                            <button
                                onClick={handleBookNow}
                                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium w-full"
                            >
                                Book Now
                            </button>
                            <div className="text-xs text-gray-500 mt-2">
                                via {hotel.provider}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
