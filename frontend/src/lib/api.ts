const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Vercel Edge Config for feature flags and dynamic config
const VERCEL_EDGE_CONFIG_ID = process.env.EDGE_CONFIG;

// Cache configuration for different data types
const CACHE_CONFIG = {
  destinations: { revalidate: 1800 }, // 30 minutes
  featured: { revalidate: 3600 },     // 1 hour
  guides: { revalidate: 7200 },       // 2 hours
  prices: { revalidate: 900 }         // 15 minutes
};

export interface Destination {
  id: string;
  name: string;
  country: string;
  cityCode: string;
  description: string;
  image: string;
  galleryImages?: string[];
  highlights: string[];
  bestTime: string;
  avgFlightPrice: string;
  rating: number;
  totalReviews?: number;
  tags?: string[];
  slug: string;
  currency?: string;
}

export interface Guide {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  image: string;
  author: string;
  readTime: string;
  tags: string[];
  slug: string;
  publishedAt?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      // Add Railway-specific headers for better performance
      const headers = {
        'Content-Type': 'application/json',
        'X-Vercel-Cache': 'HIT',
        'Accept-Encoding': 'gzip, deflate, br',
        ...options?.headers,
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers,
        // Enable caching for GET requests
        next: options?.method === 'POST' ? undefined : {
          revalidate: this.getCacheRevalidate(endpoint)
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private getCacheRevalidate(endpoint: string): number {
    if (endpoint.includes('/featured')) return CACHE_CONFIG.featured.revalidate;
    if (endpoint.includes('/destinations')) return CACHE_CONFIG.destinations.revalidate;
    if (endpoint.includes('/guides')) return CACHE_CONFIG.guides.revalidate;
    if (endpoint.includes('/prices')) return CACHE_CONFIG.prices.revalidate;
    return 1800; // Default 30 minutes
  }

  // Destinations API
  async getFeaturedDestinations(limit: number = 6): Promise<ApiResponse<{ destinations: Destination[] }>> {
    return this.request(`/api/destinations/featured?limit=${limit}`);
  }

  async getAllDestinations(
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'popularity'
  ): Promise<ApiResponse<{ destinations: Destination[]; total: number; page: number; pages: number }>> {
    return this.request(`/api/destinations?page=${page}&limit=${limit}&sort_by=${sortBy}`);
  }

  async getDestinationDetail(country: string, city: string): Promise<ApiResponse<Destination>> {
    return this.request(`/api/destinations/${country}/${city}`);
  }

  // Guides API
  async getFeaturedGuides(limit: number = 6): Promise<ApiResponse<{ guides: Guide[] }>> {
    return this.request(`/api/guides/featured?limit=${limit}`);
  }

  async getGuidesByCategory(category: string): Promise<ApiResponse<{ guides: Guide[] }>> {
    return this.request(`/api/guides/category/${category}`);
  }

  // Admin functions
  async updateFlightPrices(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/destinations/update-prices', { method: 'POST' });
  }
}

export const apiClient = new ApiClient();

// React hooks for data fetching
export const useDestinations = () => {
  return {
    getFeatured: (limit?: number) => apiClient.getFeaturedDestinations(limit),
    getAll: (page?: number, limit?: number, sortBy?: string) =>
      apiClient.getAllDestinations(page, limit, sortBy),
    getDetail: (country: string, city: string) =>
      apiClient.getDestinationDetail(country, city),
  };
};

export const useGuides = () => {
  return {
    getFeatured: (limit?: number) => apiClient.getFeaturedGuides(limit),
    getByCategory: (category: string) => apiClient.getGuidesByCategory(category),
  };
};

// Import types for search functions
import type { FlightSearchParams, FlightSearchResponse, HotelSearchParams, HotelSearchResponse } from '@/types';

// Flight search function
export async function searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/flights/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Flight search failed: ${response.statusText}`);
  }

  return response.json();
}

// Hotel search function
export async function searchHotels(params: HotelSearchParams): Promise<HotelSearchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/hotels/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Hotel search failed: ${response.statusText}`);
  }

  return response.json();
}