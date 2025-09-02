import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, DollarSign } from 'lucide-react';
import { getAllDestinations } from '@/lib/destinations';

export default async function AllDestinationsPage() {
    const destinations = await getAllDestinations();

    // Group destinations by country
    const destinationsByCountry = destinations.reduce((acc, destination) => {
        if (!acc[destination.country]) {
            acc[destination.country] = [];
        }
        acc[destination.country].push(destination);
        return acc;
    }, {} as Record<string, typeof destinations>);

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

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">All Destinations</h1>
                    <p className="text-xl opacity-90">
                        Explore {destinations.length} amazing destinations around the world
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Destinations by Country */}
                <div className="space-y-12">
                    {Object.entries(destinationsByCountry).map(([country, countryDestinations]) => (
                        <section key={country}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-blue-600" />
                                {country}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {countryDestinations.map((destination) => (
                                    <Link
                                        key={destination.id}
                                        href={`/destinations/${destination.countryCode}/${destination.cityCode}`}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            <div className="relative h-48">
                                                <img
                                                    src={destination.heroImage}
                                                    alt={destination.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                                                    {destination.avgFlightPrice}
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    {destination.name}
                                                </h3>

                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {destination.tagline}
                                                </p>

                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{destination.bestTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3" />
                                                        <span>{destination.currency.split(' ')[0]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Call to Action */}
                <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
                    <p className="text-xl mb-6">Find the best flight deals to any of these amazing destinations</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        Search Flights
                    </Link>
                </section>
            </div>
        </div>
    );
}