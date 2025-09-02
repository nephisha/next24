'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Plus, Share, Download, Users, Clock, Star } from 'lucide-react';
import ItineraryTimeline from '@/components/planner/ItineraryTimeline';
import MapView from '@/components/planner/MapView';
import ActivitySuggestions from '@/components/planner/ActivitySuggestions';
import ItineraryHeader from '@/components/planner/ItineraryHeader';
import ExportOptions from '@/components/planner/ExportOptions';
import CollaborationPanel from '@/components/planner/CollaborationPanel';

export interface Activity {
    id: string;
    name: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    duration: number; // in minutes
    category: 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'activity';
    rating?: number;
    price?: string;
    image?: string;
    openingHours?: string;
    website?: string;
}

export interface ItineraryDay {
    id: string;
    date: string;
    activities: Activity[];
    notes?: string;
}

export interface Itinerary {
    id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    days: ItineraryDay[];
    collaborators?: string[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function ItineraryPlannerPage() {
    const [itinerary, setItinerary] = useState<Itinerary>({
        id: 'temp-id',
        title: 'My Trip to Paris',
        destination: 'Paris, France',
        startDate: '2025-09-15',
        endDate: '2025-09-20',
        days: [],
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    const [selectedDay, setSelectedDay] = useState<string>('');
    const [showMap, setShowMap] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showCollabModal, setShowCollabModal] = useState(false);

    // Initialize days based on date range
    useEffect(() => {
        const start = new Date(itinerary.startDate);
        const end = new Date(itinerary.endDate);
        const days: ItineraryDay[] = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dayActivities: Activity[] = [];

            // Add sample activities for the first day to demonstrate functionality
            if (d.getTime() === start.getTime()) {
                dayActivities.push({
                    id: 'sample-eiffel',
                    name: 'Eiffel Tower',
                    description: 'Visit the iconic iron lattice tower and symbol of Paris',
                    location: { lat: 48.8584, lng: 2.2945, address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris' },
                    duration: 120,
                    category: 'attraction',
                    rating: 4.6,
                    price: '€29'
                });

                dayActivities.push({
                    id: 'sample-lunch',
                    name: 'Café de Flore',
                    description: 'Historic Parisian café famous for its literary clientele',
                    location: { lat: 48.8542, lng: 2.3320, address: '172 Boulevard Saint-Germain, 75006 Paris' },
                    duration: 90,
                    category: 'restaurant',
                    rating: 4.2,
                    price: '€25'
                });
            }

            days.push({
                id: `day-${d.getTime()}`,
                date: d.toISOString().split('T')[0],
                activities: dayActivities
            });
        }

        setItinerary(prev => ({ ...prev, days }));
        if (days.length > 0) {
            setSelectedDay(days[0].id);
        }
    }, [itinerary.startDate, itinerary.endDate]);

    const addActivity = (dayId: string, activity: Activity) => {
        setItinerary(prev => ({
            ...prev,
            days: prev.days.map(day =>
                day.id === dayId
                    ? { ...day, activities: [...day.activities, activity] }
                    : day
            ),
            updatedAt: new Date().toISOString()
        }));
    };

    const removeActivity = (dayId: string, activityId: string) => {
        setItinerary(prev => ({
            ...prev,
            days: prev.days.map(day =>
                day.id === dayId
                    ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
                    : day
            ),
            updatedAt: new Date().toISOString()
        }));
    };

    const moveActivity = (fromDayId: string, toDayId: string, activityId: string, newIndex: number) => {
        setItinerary(prev => {
            const fromDay = prev.days.find(d => d.id === fromDayId);
            const activity = fromDay?.activities.find(a => a.id === activityId);

            if (!activity) return prev;

            return {
                ...prev,
                days: prev.days.map(day => {
                    if (day.id === fromDayId) {
                        return { ...day, activities: day.activities.filter(a => a.id !== activityId) };
                    }
                    if (day.id === toDayId) {
                        const newActivities = [...day.activities];
                        newActivities.splice(newIndex, 0, activity);
                        return { ...day, activities: newActivities };
                    }
                    return day;
                }),
                updatedAt: new Date().toISOString()
            };
        });
    };

    const updateItinerary = (updates: Partial<Itinerary>) => {
        setItinerary(prev => ({
            ...prev,
            ...updates,
            updatedAt: new Date().toISOString()
        }));
    };

    const selectedDayData = itinerary.days.find(day => day.id === selectedDay);
    const allActivities = itinerary.days.flatMap(day => day.activities);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <ItineraryHeader
                itinerary={itinerary}
                onUpdate={updateItinerary}
                onShare={() => setShowCollabModal(true)}
                onExport={() => setShowExportModal(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Controls */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => setShowMap(!showMap)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${showMap
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <MapPin className="w-4 h-4" />
                        {showMap ? 'Hide Map' : 'Show Map'}
                    </button>

                    <button
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${showSuggestions
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Star className="w-4 h-4" />
                        {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
                    </button>

                    <button
                        onClick={() => setShowCollabModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Users className="w-4 h-4" />
                        Collaborate
                    </button>

                    <button
                        onClick={() => setShowExportModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Timeline */}
                    <div className={`${showMap && showSuggestions ? 'lg:col-span-4' : showMap || showSuggestions ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
                        <ItineraryTimeline
                            itinerary={itinerary}
                            selectedDay={selectedDay}
                            onSelectDay={setSelectedDay}
                            onAddActivity={addActivity}
                            onRemoveActivity={removeActivity}
                            onMoveActivity={moveActivity}
                        />
                    </div>

                    {/* Map */}
                    {showMap && (
                        <div className={`${showSuggestions ? 'lg:col-span-5' : 'lg:col-span-6'}`}>
                            <MapView
                                activities={selectedDayData?.activities || []}
                                allActivities={allActivities}
                                destination={itinerary.destination}
                                onActivitySelect={(activity) => {
                                    // Handle activity selection from map
                                }}
                            />
                        </div>
                    )}

                    {/* Suggestions */}
                    {showSuggestions && (
                        <div className={`${showMap ? 'lg:col-span-3' : 'lg:col-span-6'}`}>
                            <ActivitySuggestions
                                destination={itinerary.destination}
                                selectedDay={selectedDayData}
                                existingActivities={allActivities}
                                onAddActivity={(activity) => {
                                    if (selectedDay) {
                                        addActivity(selectedDay, activity);
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showExportModal && (
                <ExportOptions
                    itinerary={itinerary}
                    onClose={() => setShowExportModal(false)}
                />
            )}

            {showCollabModal && (
                <CollaborationPanel
                    itinerary={itinerary}
                    onUpdate={updateItinerary}
                    onClose={() => setShowCollabModal(false)}
                />
            )}
        </div>
    );
}