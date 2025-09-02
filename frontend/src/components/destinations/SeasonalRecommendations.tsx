'use client';

import { useState } from 'react';
import { Sun, Cloud, Snowflake, Leaf, Thermometer, Umbrella, Wind } from 'lucide-react';

interface SeasonalData {
    season: string;
    months: string;
    temperature: string;
    weather: string;
    pros: string[];
    cons: string[];
    activities: string[];
    icon: React.ReactNode;
    color: string;
}

interface SeasonalRecommendationsProps {
    destination: string;
    climate: string;
}

export default function SeasonalRecommendations({ destination, climate }: SeasonalRecommendationsProps) {
    const [selectedSeason, setSelectedSeason] = useState('spring');

    // Generate seasonal data based on destination and climate
    const getSeasonalData = (): SeasonalData[] => {
        const baseData = [
            {
                season: 'spring',
                months: 'March - May',
                temperature: '15-22°C (59-72°F)',
                weather: 'Mild temperatures, occasional rain',
                pros: ['Perfect weather for walking', 'Fewer crowds', 'Beautiful blooming flowers', 'Comfortable temperatures'],
                cons: ['Unpredictable weather', 'Some attractions may have limited hours', 'Pack layers needed'],
                activities: ['City walking tours', 'Park visits', 'Outdoor cafés', 'Photography'],
                icon: <Leaf className="w-6 h-6" />,
                color: 'green'
            },
            {
                season: 'summer',
                months: 'June - August',
                temperature: '20-28°C (68-82°F)',
                weather: 'Warm and sunny, peak tourist season',
                pros: ['Long daylight hours', 'All attractions open', 'Outdoor events and festivals', 'Best weather for sightseeing'],
                cons: ['Crowded tourist spots', 'Higher prices', 'Hot temperatures', 'Need sun protection'],
                activities: ['Outdoor festivals', 'River cruises', 'Rooftop dining', 'Beach visits'],
                icon: <Sun className="w-6 h-6" />,
                color: 'yellow'
            },
            {
                season: 'autumn',
                months: 'September - November',
                temperature: '12-20°C (54-68°F)',
                weather: 'Cool and crisp, beautiful fall colors',
                pros: ['Stunning fall foliage', 'Comfortable temperatures', 'Fewer tourists', 'Great for photography'],
                cons: ['Shorter days', 'Unpredictable weather', 'Some outdoor activities limited'],
                activities: ['Fall foliage tours', 'Museum visits', 'Cozy café culture', 'Wine tasting'],
                icon: <Wind className="w-6 h-6" />,
                color: 'orange'
            },
            {
                season: 'winter',
                months: 'December - February',
                temperature: '2-8°C (36-46°F)',
                weather: 'Cold with possible snow, festive atmosphere',
                pros: ['Holiday decorations', 'Cozy indoor attractions', 'Lower prices', 'Unique winter activities'],
                cons: ['Cold weather', 'Short daylight hours', 'Some attractions closed', 'Need warm clothing'],
                activities: ['Holiday markets', 'Museums and galleries', 'Theater shows', 'Hot chocolate tours'],
                icon: <Snowflake className="w-6 h-6" />,
                color: 'blue'
            }
        ];

        return baseData;
    };

    const seasonalData = getSeasonalData();
    const currentSeason = seasonalData.find(s => s.season === selectedSeason) || seasonalData[0];

    const getColorClasses = (color: string, isSelected: boolean) => {
        const colors = {
            green: isSelected ? 'bg-green-100 text-green-800 border-green-300' : 'text-green-600 hover:bg-green-50',
            yellow: isSelected ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'text-yellow-600 hover:bg-yellow-50',
            orange: isSelected ? 'bg-orange-100 text-orange-800 border-orange-300' : 'text-orange-600 hover:bg-orange-50',
            blue: isSelected ? 'bg-blue-100 text-blue-800 border-blue-300' : 'text-blue-600 hover:bg-blue-50'
        };
        return colors[color as keyof typeof colors] || colors.green;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Best Time to Visit {destination}</h3>

            {/* Season Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
                {seasonalData.map((season) => (
                    <button
                        key={season.season}
                        onClick={() => setSelectedSeason(season.season)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${getColorClasses(season.color, selectedSeason === season.season)
                            }`}
                    >
                        {season.icon}
                        <span className="font-medium capitalize">{season.season}</span>
                    </button>
                ))}
            </div>

            {/* Selected Season Details */}
            <div className="space-y-6">
                {/* Weather Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Thermometer className="w-5 h-5 text-red-500" />
                            <span className="font-medium">Temperature</span>
                        </div>
                        <p className="text-sm text-gray-600">{currentSeason.temperature}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Cloud className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">Weather</span>
                        </div>
                        <p className="text-sm text-gray-600">{currentSeason.weather}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Umbrella className="w-5 h-5 text-purple-500" />
                            <span className="font-medium">Duration</span>
                        </div>
                        <p className="text-sm text-gray-600">{currentSeason.months}</p>
                    </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-green-700 mb-3">Why Visit in {currentSeason.season}?</h4>
                        <ul className="space-y-2">
                            {currentSeason.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-gray-700">{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-orange-700 mb-3">Things to Consider</h4>
                        <ul className="space-y-2">
                            {currentSeason.cons.map((con, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-gray-700">{con}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Recommended Activities */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Best Activities for {currentSeason.season}</h4>
                    <div className="flex flex-wrap gap-2">
                        {currentSeason.activities.map((activity, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                                {activity}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}