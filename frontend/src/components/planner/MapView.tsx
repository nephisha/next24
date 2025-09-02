'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Clock, Route } from 'lucide-react';
import type { Activity } from '@/app/planner/page';

interface MapViewProps {
    activities: Activity[];
    allActivities: Activity[];
    destination: string;
    onActivitySelect: (activity: Activity) => void;
}

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

export default function MapView({ activities, allActivities, destination, onActivitySelect }: MapViewProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const directionsServiceRef = useRef<any>(null);
    const directionsRendererRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showRoute, setShowRoute] = useState(false);
    const [routeInfo, setRouteInfo] = useState<{
        distance: string;
        duration: string;
    } | null>(null);

    // Load Google Maps API
    useEffect(() => {
        // Check if API key is available
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey || apiKey === 'your_google_maps_api_key_here' || apiKey === 'demo_key') {
            console.warn('Google Maps API key not configured. Map functionality will be limited.');
            return;
        }

        if (window.google) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;

        window.initMap = () => {
            setIsLoaded(true);
        };

        script.onload = () => {
            if (window.google) {
                setIsLoaded(true);
            }
        };

        script.onerror = () => {
            console.error('Failed to load Google Maps API');
        };

        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    // Initialize map
    useEffect(() => {
        if (!isLoaded || !mapRef.current || !window.google) return;

        const map = new window.google.maps.Map(mapRef.current, {
            zoom: 13,
            center: { lat: 48.8566, lng: 2.3522 }, // Default to Paris
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'on' }]
                }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true
        });

        mapInstanceRef.current = map;
        directionsServiceRef.current = new window.google.maps.DirectionsService();
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#3B82F6',
                strokeWeight: 4,
                strokeOpacity: 0.8
            }
        });
        directionsRendererRef.current.setMap(map);

        // Geocode destination to center map
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: destination }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
                map.setCenter(results[0].geometry.location);
            }
        });
    }, [isLoaded, destination]);

    // Update markers when activities change
    useEffect(() => {
        if (!mapInstanceRef.current || !window.google) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add markers for current day activities
        activities.forEach((activity, index) => {
            const marker = new window.google.maps.Marker({
                position: { lat: activity.location.lat, lng: activity.location.lng },
                map: mapInstanceRef.current,
                title: activity.name,
                label: {
                    text: (index + 1).toString(),
                    color: 'white',
                    fontWeight: 'bold'
                },
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: '#3B82F6',
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2,
                    scale: 12
                }
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-gray-900 mb-1">${activity.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${activity.description}</p>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>⏱️ ${Math.floor(activity.duration / 60)}h ${activity.duration % 60}m</span>
              ${activity.rating ? `<span>⭐ ${activity.rating}</span>` : ''}
              ${activity.price ? `<span class="text-green-600 font-medium">${activity.price}</span>` : ''}
            </div>
          </div>
        `
            });

            marker.addListener('click', () => {
                infoWindow.open(mapInstanceRef.current, marker);
                onActivitySelect(activity);
            });

            markersRef.current.push(marker);
        });

        // Fit map to show all markers
        if (activities.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            activities.forEach(activity => {
                bounds.extend({ lat: activity.location.lat, lng: activity.location.lng });
            });
            mapInstanceRef.current.fitBounds(bounds);

            // Don't zoom in too much for single markers
            if (activities.length === 1) {
                mapInstanceRef.current.setZoom(15);
            }
        }
    }, [activities, onActivitySelect]);

    // Calculate and display route
    const calculateRoute = async () => {
        if (!directionsServiceRef.current || activities.length < 2) return;

        const waypoints = activities.slice(1, -1).map(activity => ({
            location: { lat: activity.location.lat, lng: activity.location.lng },
            stopover: true
        }));

        const request = {
            origin: { lat: activities[0].location.lat, lng: activities[0].location.lng },
            destination: { lat: activities[activities.length - 1].location.lat, lng: activities[activities.length - 1].location.lng },
            waypoints: waypoints,
            optimizeWaypoints: true,
            travelMode: window.google.maps.TravelMode.WALKING
        };

        try {
            const result = await new Promise((resolve, reject) => {
                directionsServiceRef.current.route(request, (result: any, status: any) => {
                    if (status === 'OK') {
                        resolve(result);
                    } else {
                        reject(status);
                    }
                });
            });

            directionsRendererRef.current.setDirections(result);

            // Calculate total distance and duration
            const route = (result as any).routes[0];
            let totalDistance = 0;
            let totalDuration = 0;

            route.legs.forEach((leg: any) => {
                totalDistance += leg.distance.value;
                totalDuration += leg.duration.value;
            });

            setRouteInfo({
                distance: (totalDistance / 1000).toFixed(1) + ' km',
                duration: Math.round(totalDuration / 60) + ' min'
            });

            setShowRoute(true);
        } catch (error) {
            console.error('Error calculating route:', error);
        }
    };

    const clearRoute = () => {
        directionsRendererRef.current.setDirections({ routes: [] });
        setShowRoute(false);
        setRouteInfo(null);
    };

    const findNearbyPlaces = (type: string) => {
        if (!mapInstanceRef.current || activities.length === 0) return;

        const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
        const center = activities.length > 0
            ? { lat: activities[0].location.lat, lng: activities[0].location.lng }
            : mapInstanceRef.current.getCenter();

        service.nearbySearch({
            location: center,
            radius: 1000,
            type: type
        }, (results: any, status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // Handle nearby places results
                console.log('Nearby places:', results);
            }
        });
    };

    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const isApiKeyConfigured = apiKey && apiKey !== 'your_google_maps_api_key_here' && apiKey !== 'demo_key';

    if (!isApiKeyConfigured) {
        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Map View</h3>
                    <p className="text-sm text-gray-600">Configure Google Maps API to enable map features</p>
                </div>
                <div className="h-[500px] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-6">
                        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Google Maps Not Configured</h4>
                        <p className="text-gray-600 mb-4">
                            To enable interactive maps, route planning, and nearby suggestions, please configure your Google Maps API key.
                        </p>
                        <div className="bg-white rounded-lg p-4 text-left">
                            <h5 className="font-medium text-gray-900 mb-2">Setup Instructions:</h5>
                            <ol className="text-sm text-gray-600 space-y-1">
                                <li>1. Get API key from Google Cloud Console</li>
                                <li>2. Enable Maps, Places, Directions APIs</li>
                                <li>3. Add key to .env.local file</li>
                                <li>4. Restart development server</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Activity List */}
                {activities.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3">Today's Activities</h4>
                        <div className="space-y-2">
                            {activities.map((activity, index) => (
                                <div key={activity.id} className="flex items-center gap-3 text-sm p-2 bg-gray-50 rounded-lg">
                                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{activity.name}</p>
                                        <p className="text-gray-500 truncate">{activity.location.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="bg-white rounded-xl shadow-lg h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Map Controls */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Map View</h3>
                    <div className="flex items-center gap-2">
                        {activities.length >= 2 && (
                            <button
                                onClick={showRoute ? clearRoute : calculateRoute}
                                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${showRoute
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                            >
                                <Route className="w-4 h-4" />
                                {showRoute ? 'Hide Route' : 'Show Route'}
                            </button>
                        )}
                    </div>
                </div>

                {routeInfo && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                        <div className="flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            <span>{routeInfo.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{routeInfo.duration} walking</span>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => findNearbyPlaces('restaurant')}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200 transition-colors"
                    >
                        🍽️ Restaurants
                    </button>
                    <button
                        onClick={() => findNearbyPlaces('tourist_attraction')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                        🏛️ Attractions
                    </button>
                    <button
                        onClick={() => findNearbyPlaces('lodging')}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                    >
                        🏨 Hotels
                    </button>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative">
                <div ref={mapRef} className="h-[500px] w-full" />

                {activities.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">Add activities to see them on the map</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Activity List */}
            {activities.length > 0 && (
                <div className="p-4 border-t border-gray-200 max-h-40 overflow-y-auto">
                    <h4 className="font-medium text-gray-900 mb-2">Today's Activities</h4>
                    <div className="space-y-2">
                        {activities.map((activity, index) => (
                            <div key={activity.id} className="flex items-center gap-3 text-sm">
                                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{activity.name}</p>
                                    <p className="text-gray-500 truncate">{activity.location.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}