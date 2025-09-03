'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Instagram, ExternalLink, Loader2 } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

interface SocialPost {
    id: string;
    platform: string;
    media_url: string;
    thumbnail_url?: string;
    caption: string;
    hashtags: string[];
    author: {
        username: string;
        display_name?: string;
        avatar_url?: string;
        verified: boolean;
    };
    engagement: {
        likes: number;
        comments: number;
        shares: number;
    };
    location?: string;
    posted_at: string;
    external_url?: string;
}

interface InstagramFeedProps {
    feedType?: string;
    hashtags?: string[];
    limit?: number;
    className?: string;
}

export default function InstagramFeed({
    feedType = "homepage",
    hashtags = [],
    limit = 12,
    className = ""
}: InstagramFeedProps) {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSocialFeed();
    }, [feedType, limit]);

    const fetchSocialFeed = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/social/feed/${feedType}?limit=${limit}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch social feed');
            }

            const data = await response.json();
            setPosts(data.posts || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load social feed');
            console.error('Error fetching social feed:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return date.toLocaleDateString();
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    if (loading) {
        return (
            <div className={`${className}`}>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-600">Loading social feed...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${className}`}>
                <div className="text-center py-12">
                    <Instagram className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg text-gray-600 mb-2">Unable to load social feed</p>
                    <p className="text-sm text-gray-500">{error}</p>
                    <button
                        onClick={fetchSocialFeed}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className={`${className}`}>
                <div className="text-center py-12">
                    <Instagram className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg text-gray-600">No posts available</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        {/* Media */}
                        <div className="relative aspect-square overflow-hidden">
                            <OptimizedImage
                                src={post.thumbnail_url || post.media_url}
                                alt={post.caption || 'Social media post'}
                                width={400}
                                height={400}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />

                            {/* Platform badge */}
                            <div className="absolute top-3 right-3">
                                <div className="bg-black/70 backdrop-blur-sm rounded-full p-2">
                                    <Instagram className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* Engagement overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <div className="flex items-center justify-between text-white text-sm">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1">
                                            <Heart className="w-4 h-4" />
                                            <span>{formatNumber(post.engagement.likes)}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{formatNumber(post.engagement.comments)}</span>
                                        </div>
                                    </div>
                                    {post.external_url && (
                                        <a
                                            href={post.external_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-300 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {/* Author */}
                            <div className="flex items-center space-x-3 mb-3">
                                {post.author.avatar_url ? (
                                    <OptimizedImage
                                        src={post.author.avatar_url}
                                        alt={post.author.username}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-medium text-gray-600">
                                            {post.author.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            @{post.author.username}
                                        </p>
                                        {post.author.verified && (
                                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {formatTimeAgo(post.posted_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Caption */}
                            {post.caption && (
                                <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                                    {post.caption}
                                </p>
                            )}

                            {/* Location */}
                            {post.location && (
                                <p className="text-xs text-blue-600 font-medium">
                                    📍 {post.location}
                                </p>
                            )}

                            {/* Hashtags */}
                            {post.hashtags && post.hashtags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {post.hashtags.slice(0, 3).map((hashtag, index) => (
                                        <span
                                            key={index}
                                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                                        >
                                            #{hashtag}
                                        </span>
                                    ))}
                                    {post.hashtags.length > 3 && (
                                        <span className="text-xs text-gray-500">
                                            +{post.hashtags.length - 3} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Load more button */}
            {posts.length >= limit && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => {
                            // Implement load more functionality
                            console.log('Load more posts');
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Load More Posts
                    </button>
                </div>
            )}
        </div>
    );
}