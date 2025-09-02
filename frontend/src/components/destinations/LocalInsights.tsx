'use client';

import { useState } from 'react';
import { MapPin, Users, Lightbulb, Heart, Coffee, Shield, Clock } from 'lucide-react';

interface LocalInsightsProps {
    destination: string;
    tips: {
        budget: string[];
        cultural: string[];
    };
}

interface InsightCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
}

export default function LocalInsights({ destination, tips }: LocalInsightsProps) {
    const [activeCategory, setActiveCategory] = useState('hidden-gems');

    const categories: InsightCategory[] = [
        {
            id: 'hidden-gems',
            name: 'Hidden Gems',
            icon: <MapPin className="w-5 h-5" />,
            color: 'blue'
        },
        {
            id: 'local-customs',
            name: 'Local Customs',
            icon: <Users className="w-5 h-5" />,
            color: 'purple'
        },
        {
            id: 'insider-tips',
            name: 'Insider Tips',
            icon: <Lightbulb className="w-5 h-5" />,
            color: 'yellow'
        },
        {
            id: 'local-favorites',
            name: 'Local Favorites',
            icon: <Heart className="w-5 h-5" />,
            color: 'red'
        },
        {
            id: 'safety-tips',
            name: 'Safety & Etiquette',
            icon: <Shield className="w-5 h-5" />,
            color: 'green'
        }
    ];

    const getInsightContent = (categoryId: string) => {
        switch (categoryId) {
            case 'hidden-gems':
                return {
                    title: 'Hidden Gems & Secret Spots',
                    items: [
                        {
                            title: 'Local Neighborhood Markets',
                            description: 'Venture beyond tourist markets to discover authentic local produce, crafts, and street food that locals actually frequent.',
                            tip: 'Visit early morning for the freshest selections and best prices'
                        },
                        {
                            title: 'Residential Districts',
                            description: 'Explore quiet residential areas to see how locals really live, find neighborhood cafés, and discover beautiful architecture.',
                            tip: 'Take public transport to reach these authentic neighborhoods'
                        },
                        {
                            title: 'Local Parks & Gardens',
                            description: 'Find peaceful green spaces where families gather, perfect for people-watching and understanding local culture.',
                            tip: 'Great spots for picnics with local market finds'
                        },
                        {
                            title: 'Artisan Workshops',
                            description: 'Discover traditional craftspeople still practicing their trades in small workshops and studios.',
                            tip: 'Many artisans welcome visitors and offer informal demonstrations'
                        }
                    ]
                };
            case 'local-customs':
                return {
                    title: 'Cultural Customs & Traditions',
                    items: tips.cultural.map((tip, index) => ({
                        title: `Cultural Insight ${index + 1}`,
                        description: tip,
                        tip: 'Observing local customs shows respect and enhances your experience'
                    }))
                };
            case 'insider-tips':
                return {
                    title: 'Insider Tips from Locals',
                    items: [
                        {
                            title: 'Best Times to Visit Attractions',
                            description: 'Avoid crowds by visiting popular sites early morning or late afternoon when locals are at work.',
                            tip: 'Golden hour also provides the best lighting for photos'
                        },
                        {
                            title: 'Local Transportation Hacks',
                            description: 'Learn the most efficient routes and transportation methods that locals use to navigate the city.',
                            tip: 'Download local transport apps for real-time updates'
                        },
                        {
                            title: 'Seasonal Events & Festivals',
                            description: 'Time your visit with local festivals, markets, or seasonal celebrations for authentic cultural experiences.',
                            tip: 'Check local event calendars and community boards'
                        },
                        {
                            title: 'Weather-Specific Activities',
                            description: 'Know what locals do when weather conditions change - indoor alternatives and seasonal activities.',
                            tip: 'Always have a backup plan for outdoor activities'
                        }
                    ]
                };
            case 'local-favorites':
                return {
                    title: 'Where Locals Actually Go',
                    items: [
                        {
                            title: 'Neighborhood Restaurants',
                            description: 'Family-run establishments and hole-in-the-wall eateries that serve authentic local cuisine at reasonable prices.',
                            tip: 'Look for places with no English menus - usually a good sign!'
                        },
                        {
                            title: 'Local Coffee Culture',
                            description: 'Discover how locals take their coffee and the social rituals around coffee consumption in the area.',
                            tip: 'Observe and follow local coffee etiquette'
                        },
                        {
                            title: 'Community Gathering Spots',
                            description: 'Public squares, parks, or venues where locals meet friends, exercise, or spend leisure time.',
                            tip: 'Great places to practice the local language'
                        },
                        {
                            title: 'Local Entertainment',
                            description: 'Venues for live music, theater, or cultural performances that cater to local audiences rather than tourists.',
                            tip: 'Check local newspapers and community boards for events'
                        }
                    ]
                };
            case 'safety-tips':
                return {
                    title: 'Safety & Local Etiquette',
                    items: [
                        {
                            title: 'Personal Safety Awareness',
                            description: 'Understand local safety considerations, common scams, and areas to be cautious about, especially at night.',
                            tip: 'Trust your instincts and stay aware of your surroundings'
                        },
                        {
                            title: 'Social Etiquette',
                            description: 'Learn appropriate behavior in social situations, including greetings, personal space, and conversation topics.',
                            tip: 'When in doubt, observe locals and follow their lead'
                        },
                        {
                            title: 'Photography Etiquette',
                            description: 'Understand when and where it\'s appropriate to take photos, especially of people and religious sites.',
                            tip: 'Always ask permission before photographing people'
                        },
                        {
                            title: 'Emergency Information',
                            description: 'Know local emergency numbers, hospital locations, and how to contact your embassy if needed.',
                            tip: 'Save important numbers in your phone before you need them'
                        }
                    ]
                };
            default:
                return { title: '', items: [] };
        }
    };

    const getColorClasses = (color: string, isActive: boolean) => {
        const colors = {
            blue: isActive ? 'bg-blue-100 text-blue-800 border-blue-300' : 'text-blue-600 hover:bg-blue-50',
            purple: isActive ? 'bg-purple-100 text-purple-800 border-purple-300' : 'text-purple-600 hover:bg-purple-50',
            yellow: isActive ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'text-yellow-600 hover:bg-yellow-50',
            red: isActive ? 'bg-red-100 text-red-800 border-red-300' : 'text-red-600 hover:bg-red-50',
            green: isActive ? 'bg-green-100 text-green-800 border-green-300' : 'text-green-600 hover:bg-green-50'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    const currentContent = getInsightContent(activeCategory);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Local Insights for {destination}</h3>

            {/* Category Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${getColorClasses(category.color, activeCategory === category.id)
                            }`}
                    >
                        {category.icon}
                        <span className="font-medium">{category.name}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-6">
                <h4 className="text-xl font-semibold text-gray-800">{currentContent.title}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentContent.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-900 mb-2">{item.title}</h5>
                            <p className="text-gray-700 text-sm mb-3">{item.description}</p>
                            <div className="flex items-start gap-2 p-3 bg-white rounded border-l-4 border-blue-400">
                                <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-blue-700 font-medium">{item.tip}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Budget Tips Section */}
            {tips.budget.length > 0 && (
                <div className="mt-8 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Coffee className="w-5 h-5" />
                        Local Budget Tips
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tips.budget.map((tip, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-green-700">{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pro Tip */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Pro Tip</h4>
                        <p className="text-sm text-blue-700">
                            The best way to discover local insights is to strike up conversations with locals.
                            Most people are happy to share recommendations about their city with friendly visitors!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}