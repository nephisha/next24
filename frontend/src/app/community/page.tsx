'use client';

import { useState } from 'react';
import { Users, Camera, Instagram, Heart, Trophy, Share, Sparkles } from 'lucide-react';
import InstagramFeed from '@/components/social/InstagramFeed';
import UserStories from '@/components/social/UserStories';
import PhotoContest from '@/components/social/PhotoContest';

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<'instagram' | 'stories' | 'contest'>('instagram');

    const tabs = [
        {
            id: 'instagram' as const,
            name: 'Instagram Feed',
            icon: Instagram,
            description: 'Latest travel posts from the community'
        },
        {
            id: 'stories' as const,
            name: 'Travel Stories',
            icon: Heart,
            description: 'Real experiences from fellow travelers'
        },
        {
            id: 'contest' as const,
            name: 'Photo Contest',
            icon: Trophy,
            description: 'Monthly photography competitions'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0">
                    {/* Floating elements */}
                    <div className="absolute top-20 left-20 animate-float">
                        <Camera className="w-8 h-8 text-white/20" />
                    </div>
                    <div className="absolute top-40 right-32 animate-float-delayed">
                        <Heart className="w-12 h-12 text-white/15" />
                    </div>
                    <div className="absolute bottom-32 left-16 animate-bounce">
                        <Share className="w-6 h-6 text-white/25" />
                    </div>
                    <div className="absolute bottom-20 right-20 animate-pulse">
                        <Trophy className="w-10 h-10 text-white/20" />
                    </div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                <Users className="w-5 h-5" />
                                <span className="text-sm font-medium">Join 50K+ Travel Enthusiasts</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Travel Community
                        </h1>

                        <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
                            Share your adventures, discover hidden gems, and connect with fellow travelers from around the world. Your journey inspires others!
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Instagram className="w-5 h-5" />
                                <span>Instagram Integration</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Heart className="w-5 h-5" />
                                <span>Travel Stories</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Trophy className="w-5 h-5" />
                                <span>Photo Contests</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Sparkles className="w-5 h-5" />
                                <span>Community Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Navigation Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-semibold">{tab.name}</div>
                                    <div className={`text-xs ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {tab.description}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="min-h-[600px]">
                    {activeTab === 'instagram' && (
                        <div className="space-y-12">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Instagram Travel Feed</h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Discover amazing travel content from our community and travel influencers.
                                    Follow hashtags like #travel, #wanderlust, and destination-specific tags.
                                </p>
                            </div>

                            <InstagramFeed
                                hashtags={['travel', 'wanderlust', 'destination']}
                                limit={12}
                                className="mb-12"
                            />

                            {/* Instagram Integration Info */}
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Instagram className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Hashtag Feeds</h3>
                                        <p className="text-sm text-gray-600">Automatically pull content from popular travel hashtags</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Influencer Partners</h3>
                                        <p className="text-sm text-gray-600">Featured content from travel influencers and partners</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-gradient-to-r from-teal-500 to-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Heart className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">User Generated</h3>
                                        <p className="text-sm text-gray-600">Real content from our community members</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'stories' && (
                        <UserStories
                            featured={false}
                            limit={12}
                        />
                    )}

                    {activeTab === 'contest' && (
                        <PhotoContest />
                    )}
                </div>

                {/* Community Stats */}
                <div className="mt-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-12 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4">Community Impact</h2>
                            <p className="text-blue-100 max-w-2xl mx-auto">
                                Our travel community is growing every day, sharing experiences and inspiring wanderlust around the world.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">50K+</div>
                                <div className="text-lg font-semibold mb-1">Community Members</div>
                                <div className="text-blue-200 text-sm">Active travelers</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">12K+</div>
                                <div className="text-lg font-semibold mb-1">Travel Stories</div>
                                <div className="text-blue-200 text-sm">Shared experiences</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">25K+</div>
                                <div className="text-lg font-semibold mb-1">Photos Shared</div>
                                <div className="text-blue-200 text-sm">Contest entries</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">150+</div>
                                <div className="text-lg font-semibold mb-1">Countries</div>
                                <div className="text-blue-200 text-sm">Represented</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}