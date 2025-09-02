import Link from 'next/link';
import { BookOpen, MapPin, Shield, Backpack, TrendingUp, DollarSign, Plane, Globe } from 'lucide-react';

const contentCategories = [
    {
        title: 'Travel Guides',
        description: 'Comprehensive guides to help you explore the world',
        icon: BookOpen,
        color: 'from-blue-500 to-cyan-500',
        categories: [
            { name: 'City Guides', href: '/guides/cities', description: 'Insider tips for major cities worldwide' },
            { name: 'Country Overviews', href: '/guides/countries', description: 'Complete country travel information' },
            { name: 'Regional Routes', href: '/guides/routes', description: 'Multi-destination travel itineraries' },
            { name: 'Cultural Etiquette', href: '/guides/culture', description: 'Navigate local customs with confidence' }
        ]
    },
    {
        title: 'Practical Content',
        description: 'Essential information for smooth travels',
        icon: Shield,
        color: 'from-green-500 to-teal-500',
        categories: [
            { name: 'Airport Guides', href: '/guides/airports', description: 'Navigate airports like a pro' },
            { name: 'Travel Insurance', href: '/guides/insurance', description: 'Compare and choose the right coverage' },
            { name: 'Packing Guides', href: '/guides/packing', description: 'Pack smart for any destination' },
            { name: 'Safety Information', href: '/guides/safety', description: 'Stay safe while traveling' }
        ]
    },
    {
        title: 'Inspiration Content',
        description: 'Discover your next adventure',
        icon: TrendingUp,
        color: 'from-purple-500 to-pink-500',
        categories: [
            { name: 'Best Of Lists', href: '/guides/best-of', description: 'Top beaches, cities, foods, and more' },
            { name: 'Travel Trends', href: '/guides/trends', description: 'Emerging destinations and travel styles' },
            { name: 'Seasonal Ideas', href: '/guides/seasonal', description: 'Perfect destinations for every season' },
            { name: 'Budget Hacks', href: '/guides/budget', description: 'Travel more while spending less' }
        ]
    }
];

const featuredGuides = [
    {
        title: 'Ultimate Guide to European Train Travel',
        category: 'Regional Routes',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        readTime: '12 min read',
        href: '/guides/routes/europe-train-travel'
    },
    {
        title: 'Airport Layover Survival Guide',
        category: 'Airport Guides',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
        readTime: '8 min read',
        href: '/guides/airports/layover-survival'
    },
    {
        title: 'Best Beach Destinations for 2025',
        category: 'Best Of Lists',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
        readTime: '15 min read',
        href: '/guides/best-of/beaches-2025'
    },
    {
        title: 'Budget Travel: Southeast Asia Under $50/Day',
        category: 'Budget Hacks',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        readTime: '10 min read',
        href: '/guides/budget/southeast-asia-budget'
    }
];

export default function GuidesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Travel Guides & Tips
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Everything you need to know for amazing travels - from practical tips to inspiring destinations
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                <span>100+ Guides</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                <span>50+ Countries</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                <span>Expert Tips</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Content Categories */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {contentCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <div key={category.title} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                                        <Icon className="w-8 h-8 mb-3" />
                                        <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                                        <p className="opacity-90">{category.description}</p>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {category.categories.map((subcat) => (
                                                <Link
                                                    key={subcat.name}
                                                    href={subcat.href}
                                                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                                >
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {subcat.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">{subcat.description}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Featured Guides */}
                <section className="mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Featured Guides</h2>
                        <Link href="/guides/all" className="text-blue-600 hover:text-blue-700 font-medium">
                            View All Guides →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredGuides.map((guide) => (
                            <Link key={guide.title} href={guide.href} className="group">
                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative h-48">
                                        <img
                                            src={guide.image}
                                            alt={guide.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                                            {guide.category}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {guide.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">{guide.readTime}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Quick Access */}
                <section className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Need Something Specific?</h2>
                    <p className="text-xl mb-8 opacity-90">Jump straight to what you're looking for</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/guides/packing"
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors group"
                        >
                            <Backpack className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-medium">Packing</div>
                        </Link>
                        <Link
                            href="/guides/budget"
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors group"
                        >
                            <DollarSign className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-medium">Budget Tips</div>
                        </Link>
                        <Link
                            href="/guides/airports"
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors group"
                        >
                            <Plane className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-medium">Airports</div>
                        </Link>
                        <Link
                            href="/guides/safety"
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors group"
                        >
                            <Shield className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-medium">Safety</div>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}