'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, Clock } from 'lucide-react';

interface Photo {
    id: string;
    url: string;
    title: string;
    description: string;
    location: string;
    category: string;
    photographer?: string;
}

interface PhotoGalleryProps {
    destination: string;
    photos?: Photo[];
}

export default function PhotoGallery({ destination, photos }: PhotoGalleryProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Generate sample photos if none provided
    const defaultPhotos: Photo[] = [
        {
            id: '1',
            url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop',
            title: 'Iconic Landmarks',
            description: 'The most recognizable symbols and monuments that define the city\'s skyline.',
            location: 'City Center',
            category: 'landmarks',
            photographer: 'Travel Photographer'
        },
        {
            id: '2',
            url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
            title: 'Local Cuisine',
            description: 'Authentic dishes and culinary experiences that showcase local flavors.',
            location: 'Local Restaurant',
            category: 'food',
            photographer: 'Food Enthusiast'
        },
        {
            id: '3',
            url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
            title: 'Street Life',
            description: 'Vibrant street scenes capturing the daily rhythm of local life.',
            location: 'Historic District',
            category: 'culture',
            photographer: 'Street Photographer'
        },
        {
            id: '4',
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            title: 'Natural Beauty',
            description: 'Stunning natural landscapes and green spaces within the city.',
            location: 'City Park',
            category: 'nature',
            photographer: 'Nature Lover'
        },
        {
            id: '5',
            url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
            title: 'Architecture',
            description: 'Remarkable buildings showcasing the city\'s architectural heritage.',
            location: 'Historic Quarter',
            category: 'architecture',
            photographer: 'Architecture Fan'
        },
        {
            id: '6',
            url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
            title: 'Nightlife',
            description: 'The city comes alive after dark with vibrant nightlife scenes.',
            location: 'Entertainment District',
            category: 'nightlife',
            photographer: 'Night Owl'
        },
        {
            id: '7',
            url: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=800&h=600&fit=crop',
            title: 'Museums & Art',
            description: 'World-class museums and galleries showcasing art and culture.',
            location: 'Museum District',
            category: 'culture',
            photographer: 'Art Lover'
        },
        {
            id: '8',
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
            title: 'Local Markets',
            description: 'Bustling markets where locals shop for fresh produce and goods.',
            location: 'Market Square',
            category: 'culture',
            photographer: 'Market Explorer'
        }
    ];

    const galleryPhotos = photos || defaultPhotos;

    const categories = [
        { id: 'all', name: 'All Photos', count: galleryPhotos.length },
        { id: 'landmarks', name: 'Landmarks', count: galleryPhotos.filter(p => p.category === 'landmarks').length },
        { id: 'culture', name: 'Culture', count: galleryPhotos.filter(p => p.category === 'culture').length },
        { id: 'food', name: 'Food', count: galleryPhotos.filter(p => p.category === 'food').length },
        { id: 'nature', name: 'Nature', count: galleryPhotos.filter(p => p.category === 'nature').length },
        { id: 'architecture', name: 'Architecture', count: galleryPhotos.filter(p => p.category === 'architecture').length },
        { id: 'nightlife', name: 'Nightlife', count: galleryPhotos.filter(p => p.category === 'nightlife').length }
    ].filter(cat => cat.count > 0);

    const filteredPhotos = selectedCategory === 'all'
        ? galleryPhotos
        : galleryPhotos.filter(photo => photo.category === selectedCategory);

    const openLightbox = (photo: Photo) => {
        setSelectedPhoto(photo);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedPhoto(null);
        document.body.style.overflow = 'unset';
    };

    const navigatePhoto = (direction: 'prev' | 'next') => {
        if (!selectedPhoto) return;

        const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
        let newIndex;

        if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : filteredPhotos.length - 1;
        } else {
            newIndex = currentIndex < filteredPhotos.length - 1 ? currentIndex + 1 : 0;
        }

        setSelectedPhoto(filteredPhotos[newIndex]);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Photo Gallery - {destination}</h3>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${selectedCategory === category.id
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {category.name} ({category.count})
                    </button>
                ))}
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPhotos.map((photo) => (
                    <div
                        key={photo.id}
                        className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => openLightbox(photo)}
                    >
                        <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
                        <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-white">
                                <h4 className="font-semibold text-sm">{photo.title}</h4>
                                <p className="text-xs opacity-90 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {photo.location}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={() => navigatePhoto('prev')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => navigatePhoto('next')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Image */}
                        <img
                            src={selectedPhoto.url}
                            alt={selectedPhoto.title}
                            className="max-w-full max-h-[70vh] object-contain"
                        />

                        {/* Photo Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-6">
                            <h3 className="text-xl font-bold mb-2">{selectedPhoto.title}</h3>
                            <p className="text-sm mb-3 opacity-90">{selectedPhoto.description}</p>
                            <div className="flex items-center justify-between text-xs opacity-75">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {selectedPhoto.location}
                                    </span>
                                    {selectedPhoto.photographer && (
                                        <span className="flex items-center gap-1">
                                            <Camera className="w-3 h-3" />
                                            {selectedPhoto.photographer}
                                        </span>
                                    )}
                                </div>
                                <span>
                                    {filteredPhotos.findIndex(p => p.id === selectedPhoto.id) + 1} of {filteredPhotos.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Count */}
            <div className="mt-6 text-center text-sm text-gray-600">
                Showing {filteredPhotos.length} photos
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            </div>
        </div>
    );
}