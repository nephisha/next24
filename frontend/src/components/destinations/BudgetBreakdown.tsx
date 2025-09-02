'use client';

import { useState } from 'react';
import { DollarSign, Utensils, Bed, Car, Camera, ShoppingBag, Coffee } from 'lucide-react';

interface BudgetCategory {
    name: string;
    icon: React.ReactNode;
    budget: number;
    mid: number;
    luxury: number;
    description: string;
}

interface BudgetBreakdownProps {
    destination: string;
    currency: string;
}

export default function BudgetBreakdown({ destination, currency }: BudgetBreakdownProps) {
    const [selectedStyle, setSelectedStyle] = useState<'budget' | 'mid' | 'luxury'>('mid');
    const [duration, setDuration] = useState(7);

    const categories: BudgetCategory[] = [
        {
            name: 'Accommodation',
            icon: <Bed className="w-5 h-5" />,
            budget: 35,
            mid: 85,
            luxury: 250,
            description: 'Hotels, hostels, Airbnb per night'
        },
        {
            name: 'Food & Dining',
            icon: <Utensils className="w-5 h-5" />,
            budget: 25,
            mid: 55,
            luxury: 120,
            description: 'Meals, snacks, drinks per day'
        },
        {
            name: 'Transportation',
            icon: <Car className="w-5 h-5" />,
            budget: 15,
            mid: 35,
            luxury: 80,
            description: 'Local transport, taxis, tours per day'
        },
        {
            name: 'Activities',
            icon: <Camera className="w-5 h-5" />,
            budget: 20,
            mid: 45,
            luxury: 100,
            description: 'Attractions, tours, experiences per day'
        },
        {
            name: 'Shopping',
            icon: <ShoppingBag className="w-5 h-5" />,
            budget: 10,
            mid: 30,
            luxury: 75,
            description: 'Souvenirs, gifts, personal items per day'
        },
        {
            name: 'Miscellaneous',
            icon: <Coffee className="w-5 h-5" />,
            budget: 8,
            mid: 20,
            luxury: 45,
            description: 'Tips, coffee, unexpected expenses per day'
        }
    ];

    const travelStyles = [
        {
            key: 'budget' as const,
            name: 'Budget Traveler',
            description: 'Hostels, street food, public transport',
            color: 'green'
        },
        {
            key: 'mid' as const,
            name: 'Mid-Range',
            description: 'Hotels, restaurants, mix of transport',
            color: 'blue'
        },
        {
            key: 'luxury' as const,
            name: 'Luxury',
            description: 'Premium hotels, fine dining, private transport',
            color: 'purple'
        }
    ];

    const getStyleColor = (style: string, isSelected: boolean) => {
        const colors = {
            green: isSelected ? 'bg-green-100 text-green-800 border-green-300' : 'text-green-600 hover:bg-green-50',
            blue: isSelected ? 'bg-blue-100 text-blue-800 border-blue-300' : 'text-blue-600 hover:bg-blue-50',
            purple: isSelected ? 'bg-purple-100 text-purple-800 border-purple-300' : 'text-purple-600 hover:bg-purple-50'
        };
        return colors[style as keyof typeof colors] || colors.blue;
    };

    const dailyTotal = categories.reduce((sum, category) => sum + category[selectedStyle], 0);
    const tripTotal = dailyTotal * duration;

    const formatCurrency = (amount: number) => {
        const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '$';
        return `${symbol}${amount.toLocaleString()}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Budget Breakdown for {destination}</h3>

            {/* Travel Style Selector */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Choose Your Travel Style</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {travelStyles.map((style) => (
                        <button
                            key={style.key}
                            onClick={() => setSelectedStyle(style.key)}
                            className={`p-4 rounded-lg border text-left transition-colors ${getStyleColor(style.color, selectedStyle === style.key)
                                }`}
                        >
                            <div className="font-medium mb-1">{style.name}</div>
                            <div className="text-sm opacity-75">{style.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Duration Selector */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Trip Duration</h4>
                <div className="flex gap-2">
                    {[3, 5, 7, 10, 14].map((days) => (
                        <button
                            key={days}
                            onClick={() => setDuration(days)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${duration === days
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {days} days
                        </button>
                    ))}
                </div>
            </div>

            {/* Budget Breakdown */}
            <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-700">Daily Expenses</h4>
                {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="text-gray-600">{category.icon}</div>
                            <div>
                                <div className="font-medium">{category.name}</div>
                                <div className="text-sm text-gray-600">{category.description}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-lg">
                                {formatCurrency(category[selectedStyle])}
                            </div>
                            <div className="text-sm text-gray-600">per day</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Summary */}
            <div className="border-t pt-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Daily Budget</div>
                            <div className="text-3xl font-bold text-blue-600">
                                {formatCurrency(dailyTotal)}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Total Trip Cost ({duration} days)</div>
                            <div className="text-3xl font-bold text-purple-600">
                                {formatCurrency(tripTotal)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Money-Saving Tips */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Money-Saving Tips
                </h4>
                <ul className="space-y-2 text-sm text-green-700">
                    <li>• Book accommodations in advance for better rates</li>
                    <li>• Use public transportation instead of taxis</li>
                    <li>• Eat at local markets and street food vendors</li>
                    <li>• Look for free walking tours and museum days</li>
                    <li>• Travel during shoulder season for lower prices</li>
                </ul>
            </div>
        </div>
    );
}