'use client'

import { useState, useEffect } from 'react';
import { apiClient, type Destination } from '@/lib/api';
import { getCachedDestinations, trackDestinationView } from '@/lib/railway-integration';
import OptimizedImage from '@/components/OptimizedImage';
import Link from 'next/link';
import { MapPin, Star, ArrowRight } from 'lucide-react';

interface DynamicDestinationsProps {
    limit?: number;
    showFeaturedOnly?: boolean;
    className?: string;
}

export default function DynamicDestinations({
    limit = 6,
    showFeaturedOnly = true,
    className = ""
}: DynamicDestinationsProps) {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDestinations() {
            try {
                setLoading(true);

                let result;
                if (showFeaturedOnly) {
                    // Use cached version for featured destinations
                    result = await getCachedDestinations(limit);
                } else {
                    // Use API client for all destinations
                    result = await apiClient.getAllDestinations(1, limit, 'popularity');
                }

                if (result.error) {
                    throw new Error(result.error);
                }

                const destinationsData = showFeaturedOnly
                    ? result.data?.destinations || []
                    : result.data?.destinations || [];

                setDestinations(destinationsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load destinations');
                console.error('Error fetching destinations:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchDestinations();
    }, [limit, showFeaturedOnly]);

    const handleDestinationClick = (destination: Destination) => {
        trackDestinationView(destination.id, destination.country, destination.name);
    };

    if (loading) {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
                {Array.from({ length: limit }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 rounded-xl h-64 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="text-red-500 mb-4">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg font-medium">Unable to load destinations</p>
                    <p className="text-sm text-gray-600">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (destinations.length === 0) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-600">No destinations available</p>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {destinations.map((destination, index) => (
                <Link
                    key={destination.id}
                    href={`/destinations/${destination.slug}`}
                    onClick={() => handleDestinationClick(destination)}
                    className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                    <div className="relative h-64 overflow-hidden">
                        <OptimizedImage
                            src={destination.image}
                            alt={destination.name}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            priority={index < 3} // Prioritize above-fold images
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{destination.rating}</span>
                        </div>
                        {destination.tags && destination.tags.length > 0 && (
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {destination.tags[0]}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {destination.name}
                                </h3>
                                <p className="text-gray-600 flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {destination.country}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-blue-600">{destination.avgFlightPrice}</p>
                                <p className="text-sm text-gray-500">avg. flight</p>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {destination.description}
                        </p>

                        {destination.highlights && destination.highlights.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {destination.highlights.slice(0, 3).map((highlight, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Best time: {destination.bestTime}
                            </div>
                            <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}