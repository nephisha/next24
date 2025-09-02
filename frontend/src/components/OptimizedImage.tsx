'use client';

import { useState } from 'react';
import Image from 'next/image';
import { optimizeImageUrl, getFallbackImage, isValidImageUrl } from '@/lib/imageUtils';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    fallbackSrc?: string;
}

export default function OptimizedImage({
    src,
    alt,
    className = '',
    width,
    height,
    fill = false,
    priority = false,
    loading = 'lazy',
    fallbackSrc
}: OptimizedImageProps) {
    // Use the original src if it's a valid URL, otherwise use fallback
    const finalSrc = isValidImageUrl(src) ? src : getFallbackImage('default');
    const finalFallback = fallbackSrc || getFallbackImage('default');

    const [imgSrc, setImgSrc] = useState(finalSrc);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        console.log('Image failed to load:', imgSrc);
        if (imgSrc !== finalFallback) {
            console.log('Trying fallback:', finalFallback);
            setImgSrc(finalFallback);
            setHasError(false);
        } else {
            console.log('Fallback also failed, showing error state');
            setHasError(true);
        }
        setIsLoading(false);
    };

    const handleLoad = () => {
        console.log('Image loaded successfully:', imgSrc);
        setIsLoading(false);
        setHasError(false);
    };

    if (hasError) {
        return (
            <div className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}>
                <div className="text-gray-500 text-center p-6">
                    <svg className="w-16 h-16 mx-auto mb-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">Travel Image</p>
                    <p className="text-xs opacity-75">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse flex items-center justify-center z-10">
                    <div className="text-blue-400">
                        <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            )}
            {fill ? (
                <Image
                    src={imgSrc}
                    alt={alt}
                    fill
                    className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                    onError={handleError}
                    onLoad={handleLoad}
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={true}
                />
            ) : (
                <Image
                    src={imgSrc}
                    alt={alt}
                    width={width || 800}
                    height={height || 600}
                    className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                    onError={handleError}
                    onLoad={handleLoad}
                    priority={priority}
                    loading={loading}
                    unoptimized={true}
                />
            )}
        </div>
    );
}