/**
 * Railway + Vercel Integration Layer
 * Optimizes communication between Vercel frontend and Railway backend
 */

import { unstable_cache } from 'next/cache';

// Railway backend health check
export async function checkRailwayHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        return response.ok;
    } catch {
        return false;
    }
}

// Cached data fetching with Vercel's built-in caching
export const getCachedDestinations = unstable_cache(
    async (limit: number = 6) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destinations/featured?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch destinations');
        return response.json();
    },
    ['featured-destinations'],
    {
        revalidate: 3600, // 1 hour
        tags: ['destinations', 'featured']
    }
);

export const getCachedGuides = unstable_cache(
    async (limit: number = 6) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/guides/featured?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch guides');
        return response.json();
    },
    ['featured-guides'],
    {
        revalidate: 7200, // 2 hours
        tags: ['guides', 'featured']
    }
);

// Edge runtime compatible functions for Vercel
export const runtime = 'edge';

// Vercel Analytics integration
declare global {
    interface Window {
        va?: (event: string, name: string, data?: any) => void;
    }
}

export function trackDestinationView(destinationId: string, country: string, city: string) {
    if (typeof window !== 'undefined' && window.va) {
        window.va('track', 'Destination View', {
            destinationId,
            country,
            city,
            timestamp: new Date().toISOString()
        });
    }
}

// Railway deployment status check
export async function getRailwayDeploymentStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    version?: string;
    region?: string;
}> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status`);
        if (!response.ok) return { status: 'down' };

        const data = await response.json();
        return {
            status: 'healthy',
            version: data.version,
            region: data.region
        };
    } catch {
        return { status: 'down' };
    }
}

// Optimized image loading for Railway + Vercel
export function getOptimizedImageUrl(
    originalUrl: string,
    width: number,
    height: number,
    quality: number = 80
): string {
    // If using Cloudinary through Railway
    if (originalUrl.includes('cloudinary.com')) {
        return originalUrl.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_${quality}/`);
    }

    // If using Vercel Image Optimization
    if (process.env.NODE_ENV === 'production') {
        return `/_next/image?url=${encodeURIComponent(originalUrl)}&w=${width}&q=${quality}`;
    }

    return originalUrl;
}

// Railway WebSocket connection for real-time updates
export class RailwayWebSocket {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    connect(onMessage: (data: any) => void) {
        if (typeof window === 'undefined') return;

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL ||
            process.env.NEXT_PUBLIC_API_URL?.replace('https://', 'wss://').replace('http://', 'ws://');

        if (!wsUrl) return;

        try {
            this.ws = new WebSocket(`${wsUrl}/ws`);

            this.ws.onopen = () => {
                console.log('Connected to Railway WebSocket');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    onMessage(data);
                } catch (error) {
                    console.error('WebSocket message parse error:', error);
                }
            };

            this.ws.onclose = () => {
                this.handleReconnect(onMessage);
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('WebSocket connection error:', error);
        }
    }

    private handleReconnect(onMessage: (data: any) => void) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff

            setTimeout(() => {
                console.log(`Reconnecting to Railway WebSocket (attempt ${this.reconnectAttempts})`);
                this.connect(onMessage);
            }, delay);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Environment-specific configuration
export const getEnvironmentConfig = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isPreview = process.env.VERCEL_ENV === 'preview';

    return {
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        wsUrl: process.env.NEXT_PUBLIC_WS_URL,
        environment: isProduction ? 'production' : isPreview ? 'preview' : 'development',
        cacheEnabled: isProduction || isPreview,
        analyticsEnabled: isProduction,
        debugMode: !isProduction
    };
};