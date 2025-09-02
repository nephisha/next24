'use client';

import { useState, useEffect } from 'react';
import { Star, Clock, MapPin, Plus, Search, Filter, Sparkles } from 'lucide-react';
import type { Activity, ItineraryDay } from '@/app/planner/page';

interface ActivitySuggestionsProps {
    destination: string;
    selectedDay: ItineraryDay | undefined;
    existingActivities: Activity[];
    onAddActivity: (activity: Activity) => void;
}

const sampleActivities: Record<string, Activity[]> = {
    'Paris, France': [
        {
            id: 'eiffel-tower',
            name: 'Eiffel Tower',
            description: 'Iconic iron lattice tower and symbol of Paris with breathtaking city views',
            location: { lat: 48.8584, lng: 2.2945, address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris' },
            duration: 120,
            category: 'attraction',
            rating: 4.6,
            price: '€29',
            image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=300&h=200&fit=crop',
            openingHours: '9:30 AM - 11:45 PM'
        },
        {
            id: 'louvre-museum',
            name: 'Louvre Museum',
            description: 'World\'s largest art museum, home to the Mona Lisa and countless masterpieces',
            location: { lat: 48.8606, lng: 2.3376, address: 'Rue de Rivoli, 75001 Paris' },
            duration: 180,
            category: 'attraction',
            rating: 4.7,
            price: '€17',
            image: 'https://images.unsplash.com/photo-1566139884669-4b9356b4c040?w=300&h=200&fit=crop',
            openingHours: '9:00 AM - 6:00 PM'
        },
        {
            id: 'seine-cruise',
            name: 'Seine River Cruise',
            description: 'Romantic boat cruise along the Seine with views of Paris landmarks',
            location: { lat: 48.8566, lng: 2.3522, address: 'Port de la Bourdonnais, 75007 Paris' },
            duration: 60,
            category: 'activity',
            rating: 4.4,
            price: '€15',
            image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop',
            openingHours: '10:00 AM - 10:00 PM'
        },
        {
            id: 'cafe-de-flore',
            name: 'Café de Flore',
            description: 'Historic Parisian café famous for its literary clientele and classic atmosphere',
            location: { lat: 48.8542, lng: 2.3320, address: '172 Boulevard Saint-Germain, 75006 Paris' },
            duration: 90,
            category: 'restaurant',
            rating: 4.2,
            price: '€25',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop',
            openingHours: '7:00 AM - 1:30 AM'
        },
        {
            id: 'montmartre-walk',
            name: 'Montmartre Walking Tour',
            description: 'Explore the bohemian hilltop district with its artists, cafés, and Sacré-Cœur',
            location: { lat: 48.8867, lng: 2.3431, address: 'Place du Tertre, 75018 Paris' },
            duration: 150,
            category: 'activity',
            rating: 4.5,
            price: 'Free',
            image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop',
            openingHours: 'All day'
        },
        {
            id: 'le-comptoir-relais',
            name: 'Le Comptoir du Relais',
            description: 'Authentic French bistro serving traditional cuisine in a cozy setting',
            location: { lat: 48.8529, lng: 2.3364, address: '9 Carrefour de l\'Odéon, 75006 Paris' },
            duration: 120,
            category: 'restaurant',
            rating: 4.3,
            price: '€45',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop',
            openingHours: '12:00 PM - 11:00 PM'
        }
    ]
};

export default function ActivitySuggestions({
    destination,
    selectedDay,
    existingActivities,
    onAddActivity
}: ActivitySuggestionsProps) {
    const [suggestions, setSuggestions] = useState<Activity[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<Activity[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = [
        { id: 'all', name: 'All', icon: '🌟' },
        { id: 'attraction', name: 'Attractions', icon: '🏛️' },
        { id: 'restaurant', name: 'Dining', icon: '🍽️' },
        { id: 'activity', name: 'Activities', icon: '🎯' },
        { id: 'hotel', name: 'Hotels', icon: '🏨' },
        { id: 'transport', name: 'Transport', icon: '🚗' }
    ];

    // Load suggestions based on destination
    useEffect(() => {
        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const destinationSuggestions = sampleActivities[destination] || [];

            // Filter out activities that are already added
            const existingIds = new Set(existingActivities.map(a => a.id));
            const availableSuggestions = destinationSuggestions.filter(
                activity => !existingIds.has(activity.id)
            );

            setSuggestions(availableSuggestions);
            setLoading(false);
        }, 500);
    }, [destination, existingActivities]);

    // Filter suggestions based on category and search
    useEffect(() => {
        let filtered = suggestions;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(activity => activity.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(activity =>
                activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredSuggestions(filtered);
    }, [suggestions, selectedCategory, searchQuery]);

    const handleAddActivity = (activity: Activity) => {
        // Generate unique ID for the new activity instance
        const newActivity = {
            ...activity,
            id: `${activity.id}-${Date.now()}`
        };

        onAddActivity(newActivity);
    };

    const getSmartSuggestions = () => {
        if (!selectedDay) return [];

        const currentTime = selectedDay.activities.reduce((total, activity) => total + activity.duration, 0);
        const remainingTime = 8 * 60 - currentTime; // Assume 8-hour day

        return suggestions
            .filter(activity => activity.duration <= remainingTime)
            .slice(0, 3);
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
        }
        return `${mins}m`;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Activity Suggestions</h3>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-1 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === category.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Smart Suggestions */}
            {selectedDay && getSmartSuggestions().length > 0 && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Smart Suggestions for Today
                    </h4>
                    <div className="space-y-2">
                        {getSmartSuggestions().map(activity => (
                            <div key={activity.id} className="flex items-center justify-between bg-white rounded-lg p-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 truncate">{activity.name}</p>
                                    <p className="text-xs text-gray-500">{formatDuration(activity.duration)} • {activity.price}</p>
                                </div>
                                <button
                                    onClick={() => handleAddActivity(activity)}
                                    className="ml-2 p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions List */}
            <div className="max-h-[500px] overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                        <p className="text-gray-600">Finding great activities...</p>
                    </div>
                ) : filteredSuggestions.length === 0 ? (
                    <div className="p-8 text-center">
                        <Filter className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No activities found</p>
                        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        {filteredSuggestions.map(activity => (
                            <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex gap-3">
                                    {activity.image && (
                                        <img
                                            src={activity.image}
                                            alt={activity.name}
                                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900 truncate pr-2">{activity.name}</h4>
                                            <button
                                                onClick={() => handleAddActivity(activity)}
                                                className="flex-shrink-0 p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Add to itinerary"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{formatDuration(activity.duration)}</span>
                                            </div>
                                            {activity.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                    <span>{activity.rating}</span>
                                                </div>
                                            )}
                                            {activity.price && (
                                                <span className="font-medium text-green-600">{activity.price}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.category === 'attraction' ? 'bg-blue-100 text-blue-800' :
                                                    activity.category === 'restaurant' ? 'bg-orange-100 text-orange-800' :
                                                        activity.category === 'activity' ? 'bg-green-100 text-green-800' :
                                                            activity.category === 'hotel' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-gray-100 text-gray-800'
                                                }`}>
                                                {activity.category}
                                            </span>
                                            {activity.openingHours && (
                                                <span className="text-xs text-gray-500">{activity.openingHours}</span>
                                            )}
                                        </div>

                                        {activity.location.address && (
                                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate">{activity.location.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}