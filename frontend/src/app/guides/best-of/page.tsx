import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Camera, Utensils, Waves, Mountain, Building, Heart } from 'lucide-react';

const bestOfCategories = [
    {
        title: 'Best Beaches',
        icon: Waves,
        color: 'from-cyan-500 to-blue-500',
        description: 'Paradise found: the world\'s most stunning beaches',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
        href: '/guides/best-of/beaches',
        count: '25 beaches'
    },
    {
        title: 'Best Cities',
        icon: Building,
        color: 'from-purple-500 to-pink-500',
        description: 'Urban adventures in the world\'s greatest cities',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
        href: '/guides/best-of/cities',
        count: '30 cities'
    },
    {
        title: 'Best Food Destinations',
        icon: Utensils,
        color: 'from-orange-500 to-red-500',
        description: 'Culinary journeys for food lovers',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
        href: '/guides/best-of/food',
        count: '20 destinations'
    },
    {
        title: 'Best Adventure Spots',
        icon: Mountain,
        color: 'from-green-500 to-teal-500',
        description: 'Thrilling adventures for adrenaline seekers',
        image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=600&h=400&fit=crop',
        href: '/guides/best-of/adventure',
        count: '35 locations'
    },
    {
        title: 'Best Photography Spots',
        icon: Camera,
        color: 'from-indigo-500 to-purple-500',
        description: 'Instagram-worthy locations around the globe',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        href: '/guides/best-of/photography',
        count: '40 spots'
    },
    {
        title: 'Best Romantic Getaways',
        icon: Heart,
        color: 'from-pink-500 to-rose-500',
        description: 'Perfect destinations for couples',
        image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop',
        href: '/guides/best-of/romantic',
        count: '15 destinations'
    }
];

const featuredLists = [
    {
        title: 'Top 10 Beaches for 2025',
        category: 'Beaches',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
        description: 'From Maldives to Maui, discover the world\'s most beautiful beaches',
        readTime: '8 min read',
        href: '/guides/best-of/beaches-2025',
        highlights: ['Maldives', 'Bora Bora', 'Santorini', 'Maui']
    },
    {
        title: 'Best Street Food Cities',
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
        description: 'Where to find the world\'s most delicious street food',
        readTime: '12 min read',
        href: '/guides/best-of/street-food',
        highlights: ['Bangkok', 'Istanbul', 'Mexico City', 'Mumbai']
    },
    {
        title: 'Most Photogenic Cities',
        category: 'Photography',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        description: 'Cities that look amazing in every photo',
        readTime: '10 min read',
        href: '/guides/best-of/photogenic-cities',
        highlights: ['Prague', 'Kyoto', 'Venice', 'Chefchaouen']
    }
];

const quickLists = [
    {
        title: 'Best Budget Destinations 2025',
        items: ['Vietnam', 'Guatemala', 'Nepal', 'Bulgaria', 'Indonesia'],
        icon: '💰'
    },
    {
        title: 'Best Solo Travel Destinations',
        items: ['Iceland', 'New Zealand', 'Japan', 'Costa Rica', 'Portugal'],
        icon: '🎒'
    },
    {
        title: 'Best Family Destinations',
        items: ['Orlando', 'Tokyo', 'London', 'Singapore', 'Sydney'],
        icon: '👨‍👩‍👧‍👦'
    },
    {
        title: 'Best Digital Nomad Cities',
        items: ['Lisbon', 'Mexico City', 'Bali', 'Prague', 'Buenos Aires'],
        icon: '💻'
    }
];

export default function BestOfPage() {
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
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <Star className="w-16 h-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Best Of Lists
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Discover the world's best destinations, experiences, and hidden gems curated by travel experts
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Categories */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bestOfCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Link key={category.title} href={category.href} className="group">
                                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <div className="relative h-48">
                                            <img
                                                src={category.image}
                                                alt={category.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                                            <div className={`absolute top-4 left-4 bg-gradient-to-r ${category.color} p-2 rounded-lg`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                                                <p className="text-sm opacity-90">{category.count}</p>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-gray-600">{category.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Featured Lists */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Lists</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {featuredLists.map((list) => (
                            <Link key={list.title} href={list.href} className="group">
                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative h-48">
                                        <img
                                            src={list.image}
                                            alt={list.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                                            {list.category}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {list.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">{list.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {list.highlights.map((highlight) => (
                                                <span
                                                    key={highlight}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                >
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500">{list.readTime}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Quick Lists */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Lists</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickLists.map((list) => (
                            <div key={list.title} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="text-center mb-4">
                                    <div className="text-4xl mb-2">{list.icon}</div>
                                    <h3 className="text-lg font-semibold text-gray-900">{list.title}</h3>
                                </div>
                                <ol className="space-y-2">
                                    {list.items.map((item, index) => (
                                        <li key={item} className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Seasonal Recommendations */}
                <section className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4">Seasonal Recommendations</h2>
                        <p className="text-xl opacity-90">Best destinations by time of year</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">🌸</div>
                            <h3 className="text-lg font-semibold mb-3">Spring (Mar-May)</h3>
                            <ul className="text-sm space-y-1">
                                <li>Japan (Cherry Blossoms)</li>
                                <li>Turkey</li>
                                <li>Greece</li>
                                <li>Morocco</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">☀️</div>
                            <h3 className="text-lg font-semibold mb-3">Summer (Jun-Aug)</h3>
                            <ul className="text-sm space-y-1">
                                <li>Scandinavia</li>
                                <li>Eastern Europe</li>
                                <li>Canada</li>
                                <li>Russia</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">🍂</div>
                            <h3 className="text-lg font-semibold mb-3">Fall (Sep-Nov)</h3>
                            <ul className="text-sm space-y-1">
                                <li>India</li>
                                <li>Nepal</li>
                                <li>New England</li>
                                <li>China</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">❄️</div>
                            <h3 className="text-lg font-semibold mb-3">Winter (Dec-Feb)</h3>
                            <ul className="text-sm space-y-1">
                                <li>Southeast Asia</li>
                                <li>South America</li>
                                <li>Australia</li>
                                <li>Middle East</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}