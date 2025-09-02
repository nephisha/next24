'use client';

import { useState, useEffect } from 'react';
import { MapPin, Utensils, Bed, Camera, ShoppingBag, Coffee, Star } from 'lucide-react';

interface MapPoint {
    id: string;
    name: string;
    type: 'attraction' | 'restaurant' | 'hotel' | 'shopping' | 'cafe';
    lat: number;
    lng: number;
    rating: number;
    description: string;
    priceLevel?: number;
    image?: string;
}

interface InteractiveMapProps {
    destination: string;
    center: { lat: number; lng: number };
    points?: MapPoint[];
}

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

export default function InteractiveMap({ destination, center, points }: InteractiveMapProps) {
    const [map, setMap] = useState<any>(null);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Sample points if none provided
    const defaultPoints: MapPoint[] = [
        {
            id: '1',
            name: 'Historic City Center',
            type: 'attraction',
            lat: center.lat + 0.001,
            lng: center.lng + 0.001,
            rating: 4.8,
            description: 'The heart of the city with stunning architecture and rich history.',
            image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop'
        },
        {
            id: '2',
            name: 'Local Favorite Restaurant',
            type: 'restaurant',
            lat: center.lat - 0.002,
            lng: center.lng + 0.003,
            rating: 4.6,
            description: 'Authentic local cuisine in a cozy atmosphere.',
            priceLevel: 2,
            image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=200&fit=crop'
        },
        {
            id: '3',
            name: 'Boutique Hotel',
            type: 'hotel',
            lat: center.lat + 0.003,
            lng: center.lng - 0.001,
            rating: 4.7,
            description: 'Charming hotel with modern amenities and local character.',
            priceLevel: 3,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop'
        },
        {
            id: '4',
            name: 'Artisan Market',
            type: 'shopping',
            lat: center.lat - 0.001,
            lng: center.lng - 0.002,
            rating: 4.4,
            description: 'Local crafts, souvenirs, and unique handmade items.',
            priceLevel: 2,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
        },
        {
            id: '5',
            name: 'Rooftop Café',
            type: 'cafe',
            lat: center.lat + 0.002,
            lng: center.lng + 0.002,
            rating: 4.5,
            description: 'Great coffee with panoramic city views.',
            priceLevel: 2,
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop'
        }
    ];

    const mapPoints = points || defaultPoints;

    const pointTypes = [
        { id: 'all', name: 'All Places', icon: <MapPin className="w-4 h-4" />, color: 'gray' },
        { id: 'attraction', name: 'Attractions', icon: <Camera className="w-4 h-4" />, color: 'blue' },
        { id: 'restaurant', name: 'Restaurants', icon: <Utensils className="w-4 h-4" />, color: 'red' },
        { id: 'hotel', name: 'Hotels', icon: <Bed className="w-4 h-4" />, color: 'green' },
        { id: 'shopping', name: 'Shopping', icon: <ShoppingBag className="w-4 h-4" />, color: 'purple' },
        { id: 'cafe', name: 'Cafés', icon: <Coffee className="w-4 h-4" />, color: 'yellow' }
    ];

    const getTypeColor = (type: string) => {
        const colors = {
            attraction: '#3B82F6',
            restaurant: '#EF4444',
            hotel: '#10B981',
            shopping: '#8B5CF6',
            cafe: '#F59E0B'
        };
        return colors[type as keyof typeof colors] || '#6B7280';
    };

    const filteredPoints = selectedType === 'all'
        ? mapPoints
        : mapPoints.filter(point => point.type === selectedType);

    useEffect(() => {
        const initializeMap = () => {
            if (window.google && window.google.maps) {
                const mapInstance = new window.google.maps.Map(
                    document.getElementById('interactive-map'),
                    {
                        center: center,
                        zoom: 14,
                        styles: [
                            {
                                featureType: 'poi',
                                elementType: 'labels',
                                stylers: [{ visibility: 'off' }]
                            }
                        ]
                    }
                );

                setMap(mapInstance);
                setIsLoaded(true);

                // Add markers for all points
                mapPoints.forEach(point => {
                    const marker = new window.google.maps.Marker({
                        position: { lat: point.lat, lng: point.lng },
                        map: mapInstance,
                        title: point.name,
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: getTypeColor(point.type),
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 2
                        }
                    });

                    marker.addListener('click', () => {
                        setSelectedPoint(point);
                    });
                });
            }
        };

        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
            initializeMap();
        } else {
            // Load Google Maps API
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.head.appendChild(script);
        }
    }, [center]);

    const handleTypeFilter = (type: string) => {
        setSelectedType(type);
        setSelectedPoint(null);
    };

    const handlePointClick = (point: MapPoint) => {
        setSelectedPoint(point);
        if (map) {
            map.panTo({ lat: point.lat, lng: point.lng });
            map.setZoom(16);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : i < rating
                            ? 'text-yellow-400 fill-current opacity-50'
                            : 'text-gray-300'
                    }`}
            />
        ));
    };

    const renderPriceLevel = (level?: number) => {
        if (!level) return null;
        return Array.from({ length: 4 }, (_, i) => (
            <span
                key={i}
                className={`text-sm ${i < level ? 'text-green-600' : 'text-gray-300'}`}
            >
                $
            </span>
        ));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Explore {destination}</h3>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {pointTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => handleTypeFilter(type.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${selectedType === type.id
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {type.icon}
                        <span className="font-medium">{type.name}</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                            {type.id === 'all' ? mapPoints.length : mapPoints.filter(p => p.type === type.id).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map */}
                <div className="lg:col-span-2">
                    <div className="relative">
                        <div
                            id="interactive-map"
                            className="w-full h-96 rounded-lg bg-gray-200"
                        />
                        {!isLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                <div className="text-center">
                                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600">Loading interactive map...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Points List */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                        {selectedType === 'all' ? 'All Places' : pointTypes.find(t => t.id === selectedType)?.name}
                        <span className="text-sm text-gray-500 ml-2">({filteredPoints.length})</span>
                    </h4>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredPoints.map((point) => (
                            <div
                                key={point.id}
                                onClick={() => handlePointClick(point)}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedPoint?.id === point.id
                                        ? 'border-blue-300 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                                        style={{ backgroundColor: getTypeColor(point.type) }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-medium text-gray-900 truncate">{point.name}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center">
                                                {renderStars(point.rating)}
                                            </div>
                                            <span className="text-sm text-gray-600">{point.rating}</span>
                                            {point.priceLevel && (
                                                <div className="flex items-center">
                                                    {renderPriceLevel(point.priceLevel)}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{point.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Selected Point Details */}
            {selectedPoint && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-4">
                        {selectedPoint.image && (
                            <img
                                src={selectedPoint.image}
                                alt={selectedPoint.name}
                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                            />
                        )}
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{selectedPoint.name}</h4>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center">
                                    {renderStars(selectedPoint.rating)}
                                </div>
                                <span className="text-sm text-gray-600">{selectedPoint.rating} rating</span>
                                {selectedPoint.priceLevel && (
                                    <div className="flex items-center">
                                        {renderPriceLevel(selectedPoint.priceLevel)}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-700">{selectedPoint.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}