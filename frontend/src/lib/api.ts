import axios from 'axios'
import type { FlightSearchParams, FlightSearchResponse, HotelSearchParams, HotelSearchResponse } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const searchFlights = async (params: FlightSearchParams): Promise<FlightSearchResponse> => {
  const response = await api.post('/api/v1/flights/search', params)
  return response.data
}

export const searchHotels = async (params: HotelSearchParams): Promise<HotelSearchResponse> => {
  const response = await api.post('/api/v1/hotels/search', params)
  return response.data
}

export default api
