import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Wifi, Coffee, Car, Shield, Plane } from 'lucide-react';

const majorAirports = [
    {
        name: 'London Heathrow (LHR)',
        location: 'London, UK',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
        tips: ['Use Heathrow Express for fastest city connection', 'Terminal 5 has best shopping and dining', 'Allow 3+ hours for international connections'],
        href: '/guides/airports/heathrow'
    },
    {
        name: 'Dubai International (DXB)',
        location: 'Dubai, UAE',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tips: ['Free WiFi throughout airport', 'Duty-free shopping paradise', 'Sleep pods available for long layovers'],
        href: '/guides/airports/dubai'
    },
    {
        name: 'Singapore Changi (SIN)',
        location: 'Singapore',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tips: ['Jewel Changi has indoor waterfall', 'Free city tour for long layovers', 'Movie theater and swimming pool available'],
        href: '/guides/airports/changi'
    },
    {
        name: 'Tokyo Narita (NRT)',
        location: 'Tokyo, Japan',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tips: ['Narita Express to city center', 'Traditional Japanese gardens inside', 'Excellent sushi restaurants in terminals'],
        href: '/guides/airports/narita'
    }
];

const airportTips = [
    {
        category: 'Before You Go',
        icon: Clock,
        tips: [
            'Check in online 24 hours before departure',
            'Download your airline\'s mobile app',
            'Print boarding passes as backup',
            'Check baggage restrictions and fees',
            'Arrive 2 hours early for domestic, 3 hours for international'
        ]
    },
    {
        category: 'At the Airport',
        icon: MapPin,
        tips: [
            'Use airport maps and apps for navigation',
            'Keep important documents easily accessible',
            'Stay hydrated but mind liquid restrictions',
            'Charge devices before security',
            'Know your gate and boarding time'
        ]
    },
    {
        category: 'Security & Immigration',
        icon: Shield,
        tips: [
            'Wear easily removable shoes and belt',
            'Pack liquids in clear, quart-sized bag',
            'Remove electronics larger than phone',
            'Have passport and boarding pass ready',
            'Be patient and follow all instructions'
        ]
    },
    {
        category: 'Comfort & Convenience',
        icon: Coffee,
        tips: [
            'Bring empty water bottle to fill after security',
            'Pack snacks for long flights',
            'Bring entertainment and chargers',
            'Consider airport lounge access',
            'Dress in comfortable layers'
        ]
    }
];

const layoverGuide = {
    short: {
        title: '1-3 Hours',
        description: 'Stay in the airport',
        activities: [
            'Find your next gate immediately',
            'Grab a meal or snacks',
            'Use restrooms and stretch',
            'Shop duty-free if interested',
            'Charge your devices'
        ]
    },
    medium: {
        title: '3-6 Hours',
        description: 'Explore airport amenities',
        activities: [
            'Visit airport lounges',
            'Take a shower if available',
            'Explore restaurants and shops',
            'Use sleep pods or quiet areas',
            'Take advantage of free WiFi'
        ]
    },
    long: {
        title: '6+ Hours',
        description: 'Consider leaving the airport',
        activities: [
            'Check visa requirements for transit',
            'Store luggage if possible',
            'Take airport-sponsored city tours',
            'Visit nearby attractions',
            'Book airport hotel for rest'
        ]
    }
};

export default function AirportGuidesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/guides"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Guides
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <Plane className="w-16 h-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Airport Guides & Tips
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Navigate airports like a pro with insider tips, terminal maps, and layover strategies
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Essential Airport Tips */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Essential Airport Tips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {airportTips.map((category) => {
                            const Icon = category.icon;
                            return (
                                <div key={category.category} className="bg-white rounded-xl shadow-md p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {category.tips.map((tip, index) => (
                                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="text-blue-500 mt-1">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Layover Survival Guide */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Layover Survival Guide</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(layoverGuide).map(([key, guide]) => (
                            <div key={key} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white">
                                    <h3 className="text-xl font-bold">{guide.title}</h3>
                                    <p className="opacity-90">{guide.description}</p>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3">
                                        {guide.activities.map((activity, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-green-600 text-sm font-bold">{index + 1}</span>
                                                </div>
                                                <span className="text-gray-700">{activity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Major Airport Guides */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Major Airport Guides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {majorAirports.map((airport) => (
                            <Link key={airport.name} href={airport.href} className="group">
                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative h-48">
                                        <img
                                            src={airport.image}
                                            alt={airport.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="text-xl font-bold">{airport.name}</h3>
                                            <p className="opacity-90">{airport.location}</p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">Quick Tips:</h4>
                                        <ul className="space-y-2">
                                            {airport.tips.map((tip, index) => (
                                                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                                    <span className="text-blue-500 mt-1">•</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Airport Amenities Guide */}
                <section className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Common Airport Amenities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wifi className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Free WiFi</h3>
                            <p className="text-sm text-gray-600">Most airports offer free internet access</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Coffee className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Dining Options</h3>
                            <p className="text-sm text-gray-600">From fast food to fine dining restaurants</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Car className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Ground Transport</h3>
                            <p className="text-sm text-gray-600">Taxis, buses, trains, and rental cars</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Information Desks</h3>
                            <p className="text-sm text-gray-600">Get help with connections and local info</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}