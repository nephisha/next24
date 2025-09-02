import Link from 'next/link';
import { ArrowLeft, Backpack, Sun, Snowflake, Briefcase, Heart, Plane, CheckCircle } from 'lucide-react';

const packingByDestination = [
    {
        type: 'Beach/Tropical',
        icon: Sun,
        color: 'from-orange-500 to-yellow-500',
        essentials: [
            'Lightweight, breathable clothing',
            'Swimwear and cover-ups',
            'Sunscreen (SPF 30+)',
            'Sunglasses and hat',
            'Flip-flops and water shoes',
            'Light rain jacket',
            'Insect repellent',
            'Waterproof phone case'
        ],
        tips: [
            'Pack quick-dry fabrics',
            'Bring reef-safe sunscreen',
            'Pack a sarong - versatile for beach, temple visits, or towel'
        ]
    },
    {
        type: 'Cold Weather/Winter',
        icon: Snowflake,
        color: 'from-blue-500 to-cyan-500',
        essentials: [
            'Insulated winter coat',
            'Thermal underwear/base layers',
            'Warm sweaters and fleeces',
            'Waterproof boots',
            'Warm hat and gloves',
            'Scarf or neck warmer',
            'Wool socks',
            'Hand/foot warmers'
        ],
        tips: [
            'Layer clothing for temperature control',
            'Pack moisture-wicking base layers',
            'Bring lip balm and moisturizer for dry air'
        ]
    },
    {
        type: 'Business Travel',
        icon: Briefcase,
        color: 'from-gray-600 to-gray-800',
        essentials: [
            'Business suits/professional attire',
            'Dress shoes and casual shoes',
            'Laptop and chargers',
            'Business cards',
            'Portable steamer/wrinkle release',
            'Professional accessories',
            'Backup presentation materials',
            'Comfortable travel clothes'
        ],
        tips: [
            'Pack one extra business outfit',
            'Use packing cubes to keep clothes wrinkle-free',
            'Bring a portable phone charger for long days'
        ]
    },
    {
        type: 'Adventure/Hiking',
        icon: Backpack,
        color: 'from-green-500 to-teal-500',
        essentials: [
            'Hiking boots and socks',
            'Moisture-wicking clothing',
            'Rain gear and layers',
            'Daypack for excursions',
            'First aid kit',
            'Water bottles/hydration system',
            'Headlamp and extra batteries',
            'Multi-tool or knife'
        ],
        tips: [
            'Break in hiking boots before travel',
            'Pack clothes you can layer',
            'Bring blister prevention supplies'
        ]
    }
];

const packingEssentials = {
    documents: [
        'Passport (valid 6+ months)',
        'Visa (if required)',
        'Travel insurance documents',
        'Flight confirmations',
        'Hotel reservations',
        'Driver\'s license',
        'Emergency contact information',
        'Copies of important documents'
    ],
    electronics: [
        'Phone and charger',
        'Portable power bank',
        'Universal travel adapter',
        'Camera and memory cards',
        'Laptop/tablet (if needed)',
        'Headphones/earbuds',
        'E-reader for long flights',
        'Voltage converter (if needed)'
    ],
    health: [
        'Prescription medications',
        'Basic first aid supplies',
        'Hand sanitizer',
        'Thermometer',
        'Pain relievers',
        'Allergy medications',
        'Probiotics for digestive health',
        'Travel-sized toiletries'
    ],
    comfort: [
        'Travel pillow',
        'Eye mask and earplugs',
        'Comfortable travel clothes',
        'Compression socks',
        'Blanket or shawl',
        'Entertainment (books, games)',
        'Snacks for travel day',
        'Reusable water bottle'
    ]
};

const packingTips = [
    {
        title: 'Roll, Don\'t Fold',
        description: 'Rolling clothes saves 30% more space than folding and reduces wrinkles.',
        icon: '🎒'
    },
    {
        title: 'Use Packing Cubes',
        description: 'Organize items by category and compress clothes for maximum space efficiency.',
        icon: '📦'
    },
    {
        title: 'Wear Heavy Items',
        description: 'Wear your heaviest shoes and jacket on the plane to save luggage weight.',
        icon: '👟'
    },
    {
        title: 'Pack a Laundry Day',
        description: 'Plan to do laundry mid-trip to pack fewer clothes for longer journeys.',
        icon: '🧺'
    },
    {
        title: 'Leave Room for Souvenirs',
        description: 'Pack your suitcase only 75% full to leave space for items you buy.',
        icon: '🎁'
    },
    {
        title: 'Check Airline Restrictions',
        description: 'Review baggage policies and prohibited items before packing.',
        icon: '✈️'
    }
];

export default function PackingGuidePage() {
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
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <Backpack className="w-16 h-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Smart Packing Guides
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Pack efficiently for any destination with our comprehensive packing checklists and expert tips
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Packing by Destination Type */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Pack by Destination Type</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {packingByDestination.map((destination) => {
                            const Icon = destination.icon;
                            return (
                                <div key={destination.type} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className={`bg-gradient-to-r ${destination.color} p-6 text-white`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <Icon className="w-8 h-8" />
                                            <h3 className="text-2xl font-bold">{destination.type}</h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Essential Items:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                                            {destination.essentials.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Pro Tips:</h4>
                                        <ul className="space-y-2">
                                            {destination.tips.map((tip, index) => (
                                                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                                    <span className="text-blue-500 mt-1">•</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Universal Packing Essentials */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Universal Packing Essentials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.entries(packingEssentials).map(([category, items]) => (
                            <div key={category} className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                                    {category}
                                </h3>
                                <ul className="space-y-2">
                                    {items.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Packing Tips */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Expert Packing Tips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packingTips.map((tip, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="text-4xl mb-4">{tip.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{tip.title}</h3>
                                <p className="text-gray-600">{tip.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Airline Baggage Guide */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
                    <div className="text-center mb-8">
                        <Plane className="w-12 h-12 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-4">Airline Baggage Guidelines</h2>
                        <p className="text-xl opacity-90">Know before you pack</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Carry-On</h3>
                            <ul className="space-y-2 text-sm">
                                <li>• Usually 22" x 14" x 9"</li>
                                <li>• Weight limit: 15-22 lbs</li>
                                <li>• Liquids: 3-1-1 rule</li>
                                <li>• No sharp objects</li>
                                <li>• Electronics must be removable</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Checked Baggage</h3>
                            <ul className="space-y-2 text-sm">
                                <li>• Usually 62 linear inches</li>
                                <li>• Weight limit: 50 lbs (economy)</li>
                                <li>• Fees vary by airline</li>
                                <li>• Lock with TSA-approved locks</li>
                                <li>• Remove old baggage tags</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Prohibited Items</h3>
                            <ul className="space-y-2 text-sm">
                                <li>• Flammable liquids</li>
                                <li>• Sharp objects (carry-on)</li>
                                <li>• Lithium batteries (checked)</li>
                                <li>• Firearms (special rules)</li>
                                <li>• Check TSA website for full list</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}