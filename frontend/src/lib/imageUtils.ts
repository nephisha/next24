// Image utility functions for handling Unsplash URLs and fallbacks

export const FALLBACK_IMAGES = {
    landmark: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format&q=80',
    museum: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop&auto=format&q=80',
    religious: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop&auto=format&q=80',
    neighborhood: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop&auto=format&q=80',
    park: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=300&fit=crop&auto=format&q=80',
    beach: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=80',
    market: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format&q=80',
    default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format&q=80'
};

/**
 * Ensures an Unsplash URL has proper parameters for optimization
 */
export function optimizeImageUrl(url: string, width = 400, height = 300): string {
    if (!url || !url.includes('unsplash.com')) {
        return FALLBACK_IMAGES.default;
    }

    // Remove existing parameters
    const baseUrl = url.split('?')[0];

    // Add optimized parameters
    return `${baseUrl}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
}

/**
 * Gets a fallback image based on category
 */
export function getFallbackImage(category: string): string {
    return FALLBACK_IMAGES[category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default;
}

/**
 * Validates if an image URL is likely to work
 */
export function isValidImageUrl(url: string): boolean {
    if (!url) return false;

    // Check if it's a valid URL format
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * High-quality destination images for specific cities
 */
export const DESTINATION_IMAGES = {
    paris: {
        hero: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1200&h=800&fit=crop&auto=format&q=80',
        eiffelTower: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop&auto=format&q=80',
        louvre: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&auto=format&q=80',
        notreDame: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop&auto=format&q=80',
        montmartre: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop&auto=format&q=80'
    },
    london: {
        hero: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=800&fit=crop&auto=format&q=80',
        bigBen: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&h=300&fit=crop&auto=format&q=80',
        britishMuseum: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop&auto=format&q=80',
        towerBridge: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&auto=format&q=80',
        buckinghamPalace: 'https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400&h=300&fit=crop&auto=format&q=80'
    },
    tokyo: {
        hero: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=800&fit=crop&auto=format&q=80',
        shibuya: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop&auto=format&q=80',
        sensoji: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop&auto=format&q=80',
        skytree: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop&auto=format&q=80',
        tsukiji: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format&q=80'
    }
};