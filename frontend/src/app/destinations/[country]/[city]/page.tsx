import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Thermometer, DollarSign, Users, Camera, Plane } from 'lucide-react';
import { getDestinationData } from '@/lib/destinations';
import SeasonalRecommendations from '@/components/destinations/SeasonalRecommendations';
import BudgetBreakdown from '@/components/destinations/BudgetBreakdown';
import LocalInsights from '@/components/destinations/LocalInsights';
import PhotoGallery from '@/components/destinations/PhotoGallery';
import InteractiveMap from '@/components/destinations/InteractiveMap';

interface DestinationPageProps {
    params: {
        country: string;
        city: string;
    };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
    const destination = await getDestinationData(params.country, params.city);

    if (!destination) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/destinations"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Destinations
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative h-96 md:h-[500px]">
                <img
                    src={destination.heroImage}
                    alt={`${destination.name}, ${destination.country}`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
                        <div className="text-white">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                {destination.name}
                            </h1>
                            <p className="text-xl md:text-2xl mb-6 max-w-2xl">
                                {destination.tagline}
                            </p>
                            <div className="flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{destination.country}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Best time: {destination.bestTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span>From {destination.avgFlightPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">About {destination.name}</h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-600 leading-relaxed">
                                    {destination.description}
                                </p>
                            </div>
                        </section>

                        {/* Top Attractions */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Top Attractions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {destination.attractions.map((attraction, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <img
                                            src={attraction.image}
                                            alt={attraction.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2">{attraction.name}</h3>
                                            <p className="text-gray-600 text-sm">{attraction.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Sample Itineraries */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Sample Itineraries</h2>
                            <div className="space-y-6">
                                {destination.itineraries.map((itinerary, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                                {itinerary.duration}
                                            </div>
                                            <h3 className="text-xl font-semibold">{itinerary.title}</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {itinerary.days.map((day, dayIndex) => (
                                                <div key={dayIndex} className="flex gap-4">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                                        {dayIndex + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{day.title}</h4>
                                                        <p className="text-gray-600 text-sm">{day.activities}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Seasonal Recommendations */}
                        <section>
                            <SeasonalRecommendations
                                destination={destination.name}
                                climate={destination.climate}
                            />
                        </section>

                        {/* Budget Breakdown */}
                        <section>
                            <BudgetBreakdown
                                destination={destination.name}
                                currency={destination.currency.split(' ')[0]}
                            />
                        </section>

                        {/* Local Insights */}
                        <section>
                            <LocalInsights
                                destination={destination.name}
                                tips={destination.tips}
                            />
                        </section>

                        {/* Photo Gallery */}
                        <section>
                            <PhotoGallery destination={destination.name} />
                        </section>

                        {/* Interactive Map */}
                        <section>
                            <InteractiveMap
                                destination={destination.name}
                                center={destination.coordinates}
                            />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Quick Facts */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="font-medium">Best Time to Visit</div>
                                        <div className="text-sm text-gray-600">{destination.bestTime}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Thermometer className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="font-medium">Climate</div>
                                        <div className="text-sm text-gray-600">{destination.climate}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="font-medium">Currency</div>
                                        <div className="text-sm text-gray-600">{destination.currency}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="font-medium">Language</div>
                                        <div className="text-sm text-gray-600">{destination.language}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Flight Search CTA */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white">
                            <h3 className="text-xl font-semibold mb-3">Ready to Visit {destination.name}?</h3>
                            <p className="text-sm mb-4 opacity-90">
                                Find the best flight deals and start planning your trip today.
                            </p>
                            <Link
                                href={`/?destination=${destination.airportCode}`}
                                className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors w-full justify-center"
                            >
                                <Plane className="w-4 h-4" />
                                Search Flights to {destination.name}
                            </Link>
                        </div>

                        {/* Weather Widget Placeholder */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4">Current Weather</h3>
                            <div className="text-center py-8 text-gray-500">
                                <Thermometer className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Weather widget coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}