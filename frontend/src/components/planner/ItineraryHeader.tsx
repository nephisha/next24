'use client';

import { useState } from 'react';
import { Calendar, MapPin, Edit3, Share, Download, Save, X } from 'lucide-react';
import type { Itinerary } from '@/app/planner/page';

interface ItineraryHeaderProps {
    itinerary: Itinerary;
    onUpdate: (updates: Partial<Itinerary>) => void;
    onShare: () => void;
    onExport: () => void;
}

export default function ItineraryHeader({ itinerary, onUpdate, onShare, onExport }: ItineraryHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: itinerary.title,
        destination: itinerary.destination,
        startDate: itinerary.startDate,
        endDate: itinerary.endDate
    });

    const handleSave = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({
            title: itinerary.title,
            destination: itinerary.destination,
            startDate: itinerary.startDate,
            endDate: itinerary.endDate
        });
        setIsEditing(false);
    };

    const getDuration = () => {
        const start = new Date(itinerary.startDate);
        const end = new Date(itinerary.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isEditing) {
        return (
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trip Title
                            </label>
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter trip title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Destination
                            </label>
                            <input
                                type="text"
                                value={editData.destination}
                                onChange={(e) => setEditData(prev => ({ ...prev, destination: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter destination"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={editData.startDate}
                                    onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={editData.endDate}
                                    onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold">{itinerary.title}</h1>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                title="Edit trip details"
                            >
                                <Edit3 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                <span className="text-lg">{itinerary.destination}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>
                                    {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                                </span>
                            </div>

                            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                {getDuration()} days
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <button
                            onClick={onShare}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            <Share className="w-4 h-4" />
                            Share
                        </button>

                        <button
                            onClick={onExport}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Trip Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{itinerary.days.length}</div>
                        <div className="text-sm opacity-90">Days</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">
                            {itinerary.days.reduce((total, day) => total + day.activities.length, 0)}
                        </div>
                        <div className="text-sm opacity-90">Activities</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">
                            {itinerary.collaborators?.length || 0}
                        </div>
                        <div className="text-sm opacity-90">Collaborators</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">
                            {new Date(itinerary.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm opacity-90">Last Updated</div>
                    </div>
                </div>
            </div>
        </div>
    );
}