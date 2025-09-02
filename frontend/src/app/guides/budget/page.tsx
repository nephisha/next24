import Link from 'next/link';
import { ArrowLeft, DollarSign, Plane, Bed, Utensils, MapPin, CreditCard, Calendar, Users } from 'lucide-react';

const budgetCategories = [
    {
        title: 'Flight Savings',
        icon: Plane,
        color: 'from-blue-500 to-cyan-500',
        tips: [
            'Book flights 6-8 weeks in advance for domestic, 2-3 months for international',
            'Use flexible date searches to find cheaper options',
            'Consider nearby airports and alternative routes',
            'Clear browser cookies or use incognito mode when searching',
            'Sign up for airline newsletters and fare alerts',
            'Book one-way tickets separately if cheaper than round-trip',
            'Fly on Tuesdays, Wednesdays, or Saturdays for better deals',
            'Consider budget airlines for short-haul flights'
        ]
    },
    {
        title: 'Accommodation Hacks',
        icon: Bed,
        color: 'from-green-500 to-teal-500',
        tips: [
            'Stay in hostels or guesthouses instead of hotels',
            'Book accommodations with kitchen facilities to cook meals',
            'Use house-sitting or home exchange services',
            'Stay slightly outside city centers for lower prices',
            'Book directly with hotels for potential upgrades and perks',
            'Consider longer stays for weekly/monthly discounts',
            'Use loyalty programs and credit card points',
            'Check for last-minute deals on booking apps'
        ]
    },
    {
        title: 'Food & Dining',
        icon: Utensils,
        color: 'from-orange-500 to-red-500',
        tips: [
            'Eat where locals eat - street food and local markets',
            'Cook your own meals when possible',
            'Take advantage of hotel breakfast if included',
            'Drink tap water where safe, or buy large bottles',
            'Avoid tourist area restaurants - walk a few blocks away',
            'Look for lunch specials and early bird dinners',
            'Pack snacks for day trips and flights',
            'Use food delivery apps for local restaurant deals'
        ]
    },
    {
        title: 'Transportation',
        icon: MapPin,
        color: 'from-purple-500 to-pink-500',
        tips: [
            'Use public transportation instead of taxis',
            'Walk or rent bikes for short distances',
            'Buy multi-day transport passes for savings',
            'Use ride-sharing apps and compare prices',
            'Book train tickets in advance for discounts',
            'Consider overnight buses or trains to save on accommodation',
            'Use airport shuttles instead of private transfers',
            'Download offline maps to avoid roaming charges'
        ]
    }
];

const budgetDestinations = [
    {
        name: 'Vietnam',
        dailyBudget: '$25-40',
        image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop',
        highlights: ['Cheap street food', 'Affordable accommodation', 'Low transport costs'],
        description: 'Incredible value with amazing food, beautiful landscapes, and rich culture'
    },
    {
        name: 'Guatemala',
        dailyBudget: '$30-45',
        image: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=400&h=300&fit=crop',
        highlights: ['Budget hostels', 'Inexpensive local food', 'Free activities'],
        description: 'Mayan culture, volcanoes, and colonial cities on a shoestring budget'
    },
    {
        name: 'Nepal',
        dailyBudget: '$20-35',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
        highlights: ['Cheap trekking', 'Budget guesthouses', 'Low-cost meals'],
        description: 'Himalayan adventures and spiritual experiences for very little money'
    },
    {
        name: 'Bulgaria',
        dailyBudget: '$35-50',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        highlights: ['Affordable Europe', 'Cheap wine and food', 'Budget accommodation'],
        description: 'European charm without the European prices'
    }
];

const moneyTips = [
    {
        title: 'Use the Right Credit Cards',
        description: 'Get cards with no foreign transaction fees and travel rewards',
        icon: CreditCard,
        details: [
            'No foreign transaction fees save 2-3% on all purchases',
            'Travel rewards cards earn points for flights and hotels',
            'Some cards offer travel insurance and other perks',
            'Notify banks of travel plans to avoid card blocks'
        ]
    },
    {
        title: 'Time Your Travel',
        description: 'Travel during shoulder seasons for better prices',
        icon: Calendar,
        details: [
            'Shoulder seasons offer 30-50% savings on flights and hotels',
            'Avoid peak holiday periods and school breaks',
            'Weather is often still good during shoulder seasons',
            'Fewer crowds mean better experiences'
        ]
    },
    {
        title: 'Travel in Groups',
        description: 'Split costs with friends or family',
        icon: Users,
        details: [
            'Share accommodation costs with group bookings',
            'Split taxi and car rental expenses',
            'Group discounts for tours and activities',
            'Cook meals together to save on dining'
        ]
    }
];

const budgetBreakdown = {
    backpacker: {
        title: 'Backpacker Budget',
        dailyRange: '$25-50',
        accommodation: 'Hostels, guesthouses',
        food: 'Street food, cooking',
        transport: 'Public transport, walking',
        activities: 'Free attractions, hiking'
    },
    midRange: {
        title: 'Mid-Range Budget',
        dailyRange: '$50-100',
        accommodation: 'Budget hotels, private rooms',
        food: 'Local restaurants, some cooking',
        transport: 'Mix of public and private',
        activities: 'Paid attractions, some tours'
    },
    comfort: {
        title: 'Comfort Budget',
        dailyRange: '$100-200',
        accommodation: 'Mid-range hotels',
        food: 'Restaurants, occasional splurge',
        transport: 'Taxis, domestic flights',
        activities: 'Tours, experiences, museums'
    }
};

export default function BudgetGuidePage() {
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
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <DollarSign className="w-16 h-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Budget Travel Hacks
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Travel more while spending less with proven money-saving strategies and insider tips
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Budget Categories */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Money-Saving Strategies</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {budgetCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <div key={category.title} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-8 h-8" />
                                            <h3 className="text-2xl font-bold">{category.title}</h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <ul className="space-y-3">
                                            {category.tips.map((tip, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-green-600 text-sm">✓</span>
                                                    </div>
                                                    <span className="text-gray-700">{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Budget Destinations */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Best Budget Destinations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {budgetDestinations.map((destination) => (
                            <div key={destination.name} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="relative h-48">
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {destination.dailyBudget}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{destination.description}</p>
                                    <div className="space-y-1">
                                        {destination.highlights.map((highlight, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                <span className="text-sm text-gray-600">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Money Tips */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Smart Money Tips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {moneyTips.map((tip) => {
                            const Icon = tip.icon;
                            return (
                                <div key={tip.title} className="bg-white rounded-xl shadow-md p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <Icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{tip.title}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">{tip.description}</p>
                                    <ul className="space-y-2">
                                        {tip.details.map((detail, index) => (
                                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="text-blue-500 mt-1">•</span>
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Budget Breakdown */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4">Daily Budget Breakdown</h2>
                        <p className="text-xl opacity-90">Choose your travel style</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(budgetBreakdown).map(([key, budget]) => (
                            <div key={key} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                <div className="text-center mb-4">
                                    <h3 className="text-xl font-bold mb-2">{budget.title}</h3>
                                    <div className="text-2xl font-bold text-yellow-300">{budget.dailyRange}</div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="font-semibold text-sm">Accommodation</div>
                                        <div className="text-sm opacity-90">{budget.accommodation}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Food</div>
                                        <div className="text-sm opacity-90">{budget.food}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Transport</div>
                                        <div className="text-sm opacity-90">{budget.transport}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Activities</div>
                                        <div className="text-sm opacity-90">{budget.activities}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}