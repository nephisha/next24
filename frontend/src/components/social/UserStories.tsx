'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share, MapPin, Calendar, Star, Plus, Camera } from 'lucide-react';

interface TravelStory {
    id: string;
    title: string;
    destination: string;
    author: {
        name: string;
        avatar?: string;
        verified: boolean;
    };
    content: string;
    images: string[];
    tags: string[];
    likes: number;
    comments: number;
    rating: number;
    travelDate: string;
    createdAt: string;
    featured: boolean;
}

interface UserStoriesProps {
    destination?: string;
    featured?: boolean;
    limit?: number;
    className?: string;
}

// Mock data for development
const mockStories: TravelStory[] = [
    {
        id: '1',
        title: 'A Magical Week in Paris: From Croissants to Couture',
        destination: 'Paris, France',
        author: {
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&face=center',
            verified: true
        },
        content: 'Paris exceeded every expectation I had. From the moment I stepped off the plane, the city embraced me with its charm. The Eiffel Tower at sunset was breathtaking, but the real magic happened in the small cafés where locals shared stories over wine. I spent hours wandering through Montmartre, watching artists paint the very streets I was walking on. The Louvre was overwhelming in the best way possible - I could have spent weeks there. But my favorite memory? A spontaneous picnic by the Seine with fresh bread, cheese, and the most incredible strawberries I\'ve ever tasted.',
        images: [
            'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&h=400&fit=crop'
        ],
        tags: ['paris', 'france', 'culture', 'food', 'art', 'romance'],
        likes: 234,
        comments: 45,
        rating: 5,
        travelDate: '2025-08-15',
        createdAt: '2025-09-05',
        featured: true
    },
    {
        id: '2',
        title: 'Tokyo Adventures: Neon Lights and Ancient Temples',
        destination: 'Tokyo, Japan',
        author: {
            name: 'Mike Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face=center',
            verified: false
        },
        content: 'Tokyo is a city of contrasts that somehow makes perfect sense. One moment you\'re in the ultra-modern Shibuya crossing with thousands of people, and the next you\'re in a peaceful temple garden where time seems to stand still. The food scene is incredible - from $3 ramen that\'s better than anything I\'ve had at home to high-end sushi that\'s pure art. Don\'t miss the early morning tuna auction at Tsukiji, and definitely spend a day in Harajuku people-watching. The Japanese hospitality is legendary for a reason.',
        images: [
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&h=400&fit=crop'
        ],
        tags: ['tokyo', 'japan', 'culture', 'food', 'temples', 'modern'],
        likes: 189,
        comments: 32,
        rating: 5,
        travelDate: '2025-08-01',
        createdAt: '2025-09-10',
        featured: true
    },
    {
        id: '3',
        title: 'New York City: The Ultimate Urban Adventure',
        destination: 'New York, USA',
        author: {
            name: 'Emma Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&face=center',
            verified: true
        },
        content: 'NYC lived up to every movie I\'ve ever seen and then some. Central Park in autumn was like walking through a painting, and the energy of Times Square is absolutely electric. I caught three Broadway shows, ate pizza at 2 AM, and took the Staten Island Ferry for the best (free!) views of the Statue of Liberty. The Metropolitan Museum could easily take up a whole day, and don\'t even get me started on the food scene. From food trucks to Michelin stars, every meal was an adventure.',
        images: [
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop'
        ],
        tags: ['newyork', 'usa', 'urban', 'broadway', 'food', 'culture'],
        likes: 156,
        comments: 28,
        rating: 4,
        travelDate: '2025-08-20',
        createdAt: '2025-09-01',
        featured: false
    }
];

export default function UserStories({ destination, featured, limit = 10, className = '' }: UserStoriesProps) {
    const [stories, setStories] = useState<TravelStory[]>(mockStories);
    const [selectedStory, setSelectedStory] = useState<TravelStory | null>(null);
    const [showSubmitForm, setShowSubmitForm] = useState(false);

    const filteredStories = stories
        .filter(story => !destination || story.destination.toLowerCase().includes(destination.toLowerCase()))
        .filter(story => !featured || story.featured)
        .slice(0, limit);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <div className={`${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Travel Stories</h2>
                    <p className="text-gray-600">Real experiences from fellow travelers</p>
                </div>
                <button
                    onClick={() => setShowSubmitForm(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Share Your Story
                </button>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStories.map(story => (
                    <article
                        key={story.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={() => setSelectedStory(story)}
                    >
                        {/* Featured Badge */}
                        {story.featured && (
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                                ⭐ Featured
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src={story.images[0]}
                                alt={story.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                            {/* Destination */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">{story.destination}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Author */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="relative">
                                    {story.author.avatar ? (
                                        <Image
                                            src={story.author.avatar}
                                            alt={story.author.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {story.author.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    {story.author.verified && (
                                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{story.author.name}</p>
                                    <p className="text-sm text-gray-500">{formatDate(story.createdAt)}</p>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{story.title}</h3>

                            {/* Content Preview */}
                            <p className="text-gray-600 mb-4 line-clamp-3">{story.content}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {renderStars(story.rating)}
                                </div>
                                <span className="text-sm text-gray-600">({story.rating}/5)</span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {story.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                                {story.tags.length > 3 && (
                                    <span className="text-xs text-gray-500">+{story.tags.length - 3} more</span>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-4 h-4" />
                                        <span>{story.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{story.comments}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(story.travelDate)}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Story Modal */}
            {selectedStory && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {selectedStory.author.avatar ? (
                                        <Image
                                            src={selectedStory.author.avatar}
                                            alt={selectedStory.author.name}
                                            width={50}
                                            height={50}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold">
                                                {selectedStory.author.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{selectedStory.title}</h3>
                                        <p className="text-gray-600">by {selectedStory.author.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedStory(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Images */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {selectedStory.images.map((image, index) => (
                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                                        <Image
                                            src={image}
                                            alt={`${selectedStory.title} - Image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="prose max-w-none mb-6">
                                <p className="text-gray-800 leading-relaxed">{selectedStory.content}</p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedStory.tags.map(tag => (
                                    <span key={tag} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        {renderStars(selectedStory.rating)}
                                        <span className="text-sm text-gray-600">({selectedStory.rating}/5)</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Heart className="w-5 h-5" />
                                            <span>{selectedStory.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="w-5 h-5" />
                                            <span>{selectedStory.comments}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                                    <Share className="w-5 h-5" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Story Form Modal */}
            {showSubmitForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Share Your Travel Story</h3>
                                <button
                                    onClick={() => setShowSubmitForm(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Story Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Give your story a catchy title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Where did you travel?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Story</label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Tell us about your amazing travel experience..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">Drag and drop your photos here, or click to browse</p>
                                        <input type="file" multiple accept="image/*" className="hidden" />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmitForm(false)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                                    >
                                        Share Story
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}