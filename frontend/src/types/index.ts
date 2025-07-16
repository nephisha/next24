export interface Airport {
    code: string
    name: string
    city: string
    country: string
  }
  
  export interface Airline {
    code: string
    name: string
    logo_url?: string
  }
  
  export interface FlightSegment {
    origin: Airport
    destination: Airport
    departure_time: string
    arrival_time: string
    duration_minutes: number
    flight_number: string
    airline: Airline
    aircraft_type?: string
    cabin_class: string
    booking_class: string
  }
  
  export interface Flight {
    id: string
    segments: FlightSegment[]
    total_duration_minutes: number
    stops: number
    price: number
    currency: string
    deep_link: string
    provider: string
    last_updated: string
  }
  
  export interface FlightSearchParams {
    origin: string
    destination: string
    departure_date: string
    return_date?: string
    adults: number
    children: number
    infants: number
    cabin_class: string
    max_price?: number
    direct_flights_only: boolean
  }
  
  export interface FlightSearchResponse {
    flights: Flight[]
    search_id: string
    total_results: number
    search_params: FlightSearchParams
    providers: string[]
    cache_hit: boolean
    search_time_ms: number
  }
  
  export interface HotelLocation {
    address: string
    city: string
    country: string
    postal_code?: string
    latitude?: number
    longitude?: number
    distance_to_center_km?: number
  }
  
  export interface RoomType {
    name: string
    description?: string
    max_occupancy: number
    amenities: string[]
  }
  
  export interface HotelAmenity {
    name: string
    icon?: string
  }
  
  export interface HotelImage {
    url: string
    thumbnail_url?: string
    caption?: string
  }
  
  export interface Hotel {
    id: string
    name: string
    location: HotelLocation
    rating?: number
    review_score?: number
    review_count?: number
    price_per_night: number
    total_price: number
    currency: string
    room_type: RoomType
    amenities: HotelAmenity[]
    images: HotelImage[]
    deep_link: string
    provider: string
    cancellation_policy?: string
    breakfast_included: boolean
    last_updated: string
  }
  
  export interface HotelSearchParams {
    destination: string
    latitude?: number
    longitude?: number
    check_in: string
    check_out: string
    adults: number
    children: number
    rooms: number
    max_price?: number
    min_rating?: number
  }
  
  export interface HotelSearchResponse {
    hotels: Hotel[]
    search_id: string
    total_results: number
    search_params: HotelSearchParams
    providers: string[]
    cache_hit: boolean
    search_time_ms: number
  }