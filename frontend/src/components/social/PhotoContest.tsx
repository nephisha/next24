'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Trophy, Heart, Upload, Calendar, MapPin, Award, Star } from 'lucide-react';

interface ContestEntry {
    id: string;
    title: string;
    photographer: {
        name: string;
        avatar?: string;
        location: string;
    };
    image: string;
    description: string;
    location: string;
    votes: number;
    hasVoted: boolean;
    tags: string[];
    submittedAt: string;
}

interface Contest {
    id: string;
    title: string;
    theme: string;
    description: string;
    startDate: string;
    endDate: string;
    prize: string;
    status: 'upcoming' | 'active' | 'voting' | 'ended';
    totalEntries: number;
    totalVotes: number;
    coverImage: string;
}

interface PhotoContestProps {
    className?: string;
}

// Mock data
const currentContest: Contest = {
    id: 'contest-sep-2025',
    title: 'September Photo Contest',
    theme: 'Autumn Adventures',
    description: 'Capture the beauty of autumn destinations around the world. Show us colorful foliage, harvest festivals, cozy mountain retreats, or vibrant fall landscapes.',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    prize: '$500 Travel Voucher + Feature on Homepage',
    status: 'active',
    totalEntries: 127,
    totalVotes: 2341,
    coverImage: 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=800&h=400&fit=crop'
};

const contestEntries: ContestEntry[] = [
    {
        id: '1',
        title: 'Northern Lights Over Iceland',
        photographer: {
            name: 'Alex Thompson',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face=center',
            location: 'Reykjavik, Iceland'
        },
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop',
        description: 'Captured this magical moment during a winter night in Iceland. The aurora borealis danced across the sky for hours.',
        location: 'Jökulsárlón Glacier Lagoon, Iceland',
        votes: 234,
        hasVoted: false,
        tags: ['iceland', 'aurora', 'autumn', 'night'],
        submittedAt: '2025-09-15'
    },
    {
        id: '2',
        title: 'Swiss Alpine Village',
        photographer: {
            name: 'Maria Schmidt',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&face=center',
            location: 'Zurich, Switzerland'
        },
        image: 'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?w=600&h=400&fit=crop',
        description: 'A perfect winter morning in the Swiss Alps. The snow-covered chalets looked like something from a fairy tale.',
        location: 'Zermatt, Switzerland',
        votes: 189,
        hasVoted: true,
        tags: ['switzerland', 'alps', 'village', 'autumn'],
        submittedAt: '2025-09-12'
    },
    {
        id: '3',
        title: 'Frozen Waterfall Wonder',
        photographer: {
            name: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face=center',
            location: 'Toronto, Canada'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        description: 'Nature\'s ice sculpture at its finest. This waterfall completely froze during the polar vortex.',
        location: 'Niagara Falls, Canada',
        votes: 156,
        hasVoted: false,
        tags: ['canada', 'waterfall', 'autumn', 'foliage'],
        submittedAt: '2025-09-10'
    },
    {
        id: '4',
        title: 'Tokyo Winter Illumination',
        photographer: {
            name: 'Yuki Tanaka',
            location: 'Tokyo, Japan'
        },
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
        description: 'The winter illuminations in Tokyo create a magical atmosphere. This shot captures the perfect blend of tradition and modernity.',
        location: 'Shibuya, Tokyo',
        votes: 201,
        hasVoted: false,
        tags: ['tokyo', 'japan', 'lights', 'urban'],
        submittedAt: '2025-09-08'
    }
];

export default function PhotoContest({ className = '' }: PhotoContestProps) {
    const [entries, setEntries] = useState<ContestEntry[]>(contestEntries);
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<ContestEntry | null>(null);
    const [sortBy, setSortBy] = useState<'votes' | 'recent'>('votes');

    const handleVote = (entryId: string) => {
        setEntries(prev => prev.map(entry => {
            if (entry.id === entryId && !entry.hasVoted) {
                return { ...entry, votes: entry.votes + 1, hasVoted: true };
            }
            return entry;
        }));
    };

    const sortedEntries = [...entries].sort((a, b) => {
        if (sortBy === 'votes') {
            return b.votes - a.votes;
        }
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

    const getStatusColor = (status: Contest['status']) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'voting': return 'bg-blue-100 text-blue-800';
            case 'ended': return 'bg-gray-100 text-gray-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusText = (status: Contest['status']) => {
        switch (status) {
            case 'active': return 'Submissions Open';
            case 'voting': return 'Voting Phase';
            case 'ended': return 'Contest Ended';
            default: return 'Coming Soon';
        }
    };

    return (
        <div className={`${className}`}>
            {/* Contest Header */}
            <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-3xl overflow-hidden mb-8">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src={currentContest.coverImage}
                        alt={currentContest.theme}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative p-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{currentContest.title}</h1>
                                <p className="text-blue-100">Theme: {currentContest.theme}</p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(currentContest.status)}`}>
                            {getStatusText(currentContest.status)}
                        </div>
                    </div>

                    <p className="text-lg mb-6 max-w-3xl">{currentContest.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5" />
                                <span className="font-medium">Deadline</span>
                            </div>
                            <p className="text-sm">{new Date(currentContest.endDate).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Camera className="w-5 h-5" />
                                <span className="font-medium">Entries</span>
                            </div>
                            <p className="text-sm">{currentContest.totalEntries} submissions</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-5 h-5" />
                                <span className="font-medium">Votes</span>
                            </div>
                            <p className="text-sm">{currentContest.totalVotes} total votes</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5" />
                                <span className="font-medium">Prize</span>
                            </div>
                            <p className="text-sm">{currentContest.prize}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowSubmitForm(true)}
                        className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        <Upload className="w-5 h-5" />
                        Submit Your Photo
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Contest Entries</h2>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'votes' | 'recent')}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="votes">Most Votes</option>
                        <option value="recent">Most Recent</option>
                    </select>
                </div>
            </div>

            {/* Entries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedEntries.map((entry, index) => (
                    <div
                        key={entry.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={() => setSelectedEntry(entry)}
                    >
                        {/* Ranking Badge */}
                        {index < 3 && sortBy === 'votes' && (
                            <div className="absolute top-4 left-4 z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-yellow-500' :
                                    index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                                    }`}>
                                    {index + 1}
                                </div>
                            </div>
                        )}

                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={entry.image}
                                alt={entry.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                            {/* Vote Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleVote(entry.id);
                                }}
                                disabled={entry.hasVoted}
                                className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-colors ${entry.hasVoted
                                    ? 'bg-red-500 text-white cursor-not-allowed'
                                    : 'bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white'
                                    }`}
                            >
                                <Heart className={`w-4 h-4 ${entry.hasVoted ? 'fill-current' : ''}`} />
                                <span className="text-sm">{entry.votes}</span>
                            </button>

                            {/* Location */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">{entry.location}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{entry.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{entry.description}</p>

                            {/* Photographer */}
                            <div className="flex items-center gap-3 mb-4">
                                {entry.photographer.avatar ? (
                                    <Image
                                        src={entry.photographer.avatar}
                                        alt={entry.photographer.name}
                                        width={32}
                                        height={32}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">
                                            {entry.photographer.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{entry.photographer.name}</p>
                                    <p className="text-xs text-gray-500">{entry.photographer.location}</p>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {entry.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Entry Modal */}
            {selectedEntry && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Image */}
                            <div className="relative aspect-square md:aspect-auto">
                                <Image
                                    src={selectedEntry.image}
                                    alt={selectedEntry.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedEntry.title}</h3>
                                    <button
                                        onClick={() => setSelectedEntry(null)}
                                        className="text-gray-400 hover:text-gray-600 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <p className="text-gray-600 mb-6">{selectedEntry.description}</p>

                                {/* Photographer */}
                                <div className="flex items-center gap-4 mb-6">
                                    {selectedEntry.photographer.avatar ? (
                                        <Image
                                            src={selectedEntry.photographer.avatar}
                                            alt={selectedEntry.photographer.name}
                                            width={50}
                                            height={50}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold">
                                                {selectedEntry.photographer.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-900">{selectedEntry.photographer.name}</p>
                                        <p className="text-gray-600">{selectedEntry.photographer.location}</p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-2 mb-6 text-gray-600">
                                    <MapPin className="w-5 h-5" />
                                    <span>{selectedEntry.location}</span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedEntry.tags.map(tag => (
                                        <span key={tag} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Vote Button */}
                                <button
                                    onClick={() => handleVote(selectedEntry.id)}
                                    disabled={selectedEntry.hasVoted}
                                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition-colors ${selectedEntry.hasVoted
                                        ? 'bg-red-500 text-white cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${selectedEntry.hasVoted ? 'fill-current' : ''}`} />
                                    <span>{selectedEntry.hasVoted ? 'Voted!' : 'Vote for this photo'}</span>
                                    <span className="bg-white/20 px-2 py-1 rounded-full text-sm">{selectedEntry.votes}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Form Modal */}
            {showSubmitForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Submit Your Photo</h3>
                                <button
                                    onClick={() => setShowSubmitForm(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Give your photo a compelling title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Where was this photo taken?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Tell the story behind your photo..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">Drag and drop your photo here, or click to browse</p>
                                        <p className="text-sm text-gray-500 mt-2">Max file size: 10MB. Formats: JPG, PNG</p>
                                        <input type="file" accept="image/*" className="hidden" />
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
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                                    >
                                        Submit Entry
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