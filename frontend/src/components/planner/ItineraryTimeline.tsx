'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Star, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import type { Itinerary, ItineraryDay, Activity } from '@/app/planner/page';

interface ItineraryTimelineProps {
    itinerary: Itinerary;
    selectedDay: string;
    onSelectDay: (dayId: string) => void;
    onAddActivity: (dayId: string, activity: Activity) => void;
    onRemoveActivity: (dayId: string, activityId: string) => void;
    onMoveActivity: (fromDayId: string, toDayId: string, activityId: string, newIndex: number) => void;
}

export default function ItineraryTimeline({
    itinerary,
    selectedDay,
    onSelectDay,
    onAddActivity,
    onRemoveActivity,
    onMoveActivity
}: ItineraryTimelineProps) {
    const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set([selectedDay]));

    const toggleDay = (dayId: string) => {
        const newExpanded = new Set(expandedDays);
        if (newExpanded.has(dayId)) {
            newExpanded.delete(dayId);
        } else {
            newExpanded.add(dayId);
        }
        setExpandedDays(newExpanded);
        onSelectDay(dayId);
    };

    const moveActivityUp = (dayId: string, activityId: string, currentIndex: number) => {
        if (currentIndex > 0) {
            onMoveActivity(dayId, dayId, activityId, currentIndex - 1);
        }
    };

    const moveActivityDown = (dayId: string, activityId: string, currentIndex: number, totalActivities: number) => {
        if (currentIndex < totalActivities - 1) {
            onMoveActivity(dayId, dayId, activityId, currentIndex + 1);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' })
        };
    };

    const getTotalDuration = (activities: Activity[]) => {
        return activities.reduce((total, activity) => total + activity.duration, 0);
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
        }
        return `${mins}m`;
    };

    const getCategoryIcon = (category: Activity['category']) => {
        switch (category) {
            case 'attraction': return '🏛️';
            case 'restaurant': return '🍽️';
            case 'hotel': return '🏨';
            case 'transport': return '🚗';
            case 'activity': return '🎯';
            default: return '📍';
        }
    };

    const getCategoryColor = (category: Activity['category']) => {
        switch (category) {
            case 'attraction': return 'bg-blue-100 text-blue-800';
            case 'restaurant': return 'bg-orange-100 text-orange-800';
            case 'hotel': return 'bg-purple-100 text-purple-800';
            case 'transport': return 'bg-green-100 text-green-800';
            case 'activity': return 'bg-pink-100 text-pink-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Itinerary Timeline</h2>
                <p className="text-gray-600">Plan your daily activities and organize your trip</p>
            </div>

            <div className="max-h-[800px] overflow-y-auto">
                {itinerary.days.map((day, dayIndex) => {
                    const dateInfo = formatDate(day.date);
                    const isExpanded = expandedDays.has(day.id);
                    const isSelected = selectedDay === day.id;
                    const totalDuration = getTotalDuration(day.activities);

                    return (
                        <div key={day.id} className={`border-b border-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}>
                            {/* Day Header */}
                            <div
                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => toggleDay(day.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${isSelected ? 'bg-blue-600' : 'bg-gray-400'
                                                }`}>
                                                {dateInfo.day}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {dateInfo.weekday}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Day {dayIndex + 1}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {dateInfo.month} {dateInfo.day} • {day.activities.length} activities
                                                {totalDuration > 0 && ` • ${formatDuration(totalDuration)}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Add activity functionality would go here
                                            }}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Add activity"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>

                                        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activities List */}
                            {isExpanded && (
                                <div className="px-4 pb-4">
                                    {day.activities.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p>No activities planned for this day</p>
                                            <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                                                Add your first activity
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {day.activities.map((activity, index) => (
                                                <div
                                                    key={activity.id}
                                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex flex-col gap-1 mt-1">
                                                            <button
                                                                onClick={() => moveActivityUp(day.id, activity.id, index)}
                                                                disabled={index === 0}
                                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                title="Move up"
                                                            >
                                                                <ArrowUp className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => moveActivityDown(day.id, activity.id, index, day.activities.length)}
                                                                disabled={index === day.activities.length - 1}
                                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                title="Move down"
                                                            >
                                                                <ArrowDown className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-lg">{getCategoryIcon(activity.category)}</span>
                                                                        <h4 className="font-semibold text-gray-900 truncate">
                                                                            {activity.name}
                                                                        </h4>
                                                                        {activity.rating && (
                                                                            <div className="flex items-center gap-1">
                                                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                                                <span className="text-xs text-gray-600">{activity.rating}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                                        {activity.description}
                                                                    </p>

                                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                        <div className="flex items-center gap-1">
                                                                            <MapPin className="w-3 h-3" />
                                                                            <span className="truncate">{activity.location.address}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            <span>{formatDuration(activity.duration)}</span>
                                                                        </div>
                                                                        {activity.price && (
                                                                            <span className="font-medium text-green-600">{activity.price}</span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2 ml-2">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                                                                        {activity.category}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => onRemoveActivity(day.id, activity.id)}
                                                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                        title="Remove activity"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}