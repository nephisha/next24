'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface Airport {
    code: string
    name: string
    city: string
    country: string
}

interface AirportAutocompleteProps {
    value: string
    onChange: (code: string) => void
    placeholder: string
    error?: string
}

// Popular airports dataset
const AIRPORTS: Airport[] = [
    // US Major Airports
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
    { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
    { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'United States' },
    { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States' },
    { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States' },
    { code: 'LAS', name: 'McCarran International Airport', city: 'Las Vegas', country: 'United States' },
    { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States' },
    { code: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'United States' },
    { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States' },
    { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States' },
    { code: 'PHX', name: 'Phoenix Sky Harbor International Airport', city: 'Phoenix', country: 'United States' },
    { code: 'IAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'United States' },
    { code: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'United States' },
    { code: 'MSP', name: 'Minneapolis-Saint Paul International Airport', city: 'Minneapolis', country: 'United States' },
    { code: 'DTW', name: 'Detroit Metropolitan Wayne County Airport', city: 'Detroit', country: 'United States' },
    { code: 'PHL', name: 'Philadelphia International Airport', city: 'Philadelphia', country: 'United States' },
    { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'United States' },
    { code: 'BWI', name: 'Baltimore/Washington International Airport', city: 'Baltimore', country: 'United States' },
    { code: 'DCA', name: 'Ronald Reagan Washington National Airport', city: 'Washington', country: 'United States' },
    { code: 'IAD', name: 'Washington Dulles International Airport', city: 'Washington', country: 'United States' },

    // International Major Airports
    { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
    { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
    { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
    { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
    { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain' },
    { code: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy' },
    { code: 'ZUR', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
    { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria' },
    { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
    { code: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden' },
    { code: 'OSL', name: 'Oslo Airport', city: 'Oslo', country: 'Norway' },
    { code: 'HEL', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finland' },

    // Asia Pacific
    { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
    { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
    { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
    { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China' },
    { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China' },
    { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
    { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
    { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
    { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
    { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia' },
    { code: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines' },
    { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
    { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
    { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia' },
    { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia' },
    { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' },

    // India
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
    { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
    { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' },
    { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India' },
    { code: 'GOI', name: 'Goa Airport', city: 'Goa', country: 'India' },

    // Middle East
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
    { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
    { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates' },
    { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait' },
    { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia' },
    { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia' },

    // Canada
    { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
    { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada' },
    { code: 'YUL', name: 'Montréal-Pierre Elliott Trudeau International Airport', city: 'Montreal', country: 'Canada' },
    { code: 'YYC', name: 'Calgary International Airport', city: 'Calgary', country: 'Canada' },

    // South America
    { code: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil' },
    { code: 'GIG', name: 'Rio de Janeiro/Galeão International Airport', city: 'Rio de Janeiro', country: 'Brazil' },
    { code: 'EZE', name: 'Ezeiza International Airport', city: 'Buenos Aires', country: 'Argentina' },
    { code: 'SCL', name: 'Arturo Merino Benítez International Airport', city: 'Santiago', country: 'Chile' },
    { code: 'LIM', name: 'Jorge Chávez International Airport', city: 'Lima', country: 'Peru' },

    // Africa
    { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },
    { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa' },
    { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa' },
    { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria' },
    { code: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia' },
]

export default function AirportAutocomplete({ value, onChange, placeholder, error }: AirportAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredAirports, setFilteredAirports] = useState<Airport[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Filter airports based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredAirports([])
            return
        }

        const term = searchTerm.toLowerCase()

        // First, find all matching airports
        const allMatches = AIRPORTS.filter(airport =>
            airport.code.toLowerCase().includes(term) ||
            airport.name.toLowerCase().includes(term) ||
            airport.city.toLowerCase().includes(term) ||
            airport.country.toLowerCase().includes(term)
        )

        // If search term is exactly 3 characters, prioritize exact code matches
        if (searchTerm.length === 3) {
            const exactMatches = allMatches.filter(airport =>
                airport.code.toLowerCase() === term
            )
            const otherMatches = allMatches.filter(airport =>
                airport.code.toLowerCase() !== term
            )

            // Put exact matches first, then other matches
            const filtered = [...exactMatches, ...otherMatches].slice(0, 8)
            setFilteredAirports(filtered)
        } else {
            // For other search lengths, use regular filtering
            const filtered = allMatches.slice(0, 8)
            setFilteredAirports(filtered)
        }
    }, [searchTerm])

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.toUpperCase()
        setSearchTerm(inputValue)

        // Update the value and keep dropdown open for user choice
        // Users can either select from dropdown or continue to next field
        onChange(inputValue)
        setIsOpen(inputValue.length > 0)
    }

    // Handle airport selection
    const handleAirportSelect = (airport: Airport) => {
        onChange(airport.code)
        setSearchTerm(airport.code)
        setIsOpen(false)
        inputRef.current?.blur()
    }

    // Handle input focus
    const handleFocus = () => {
        if (searchTerm) {
            setIsOpen(true)
        }
    }

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Update search term when value changes externally
    useEffect(() => {
        setSearchTerm(value)
    }, [value])

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary uppercase ${error ? 'border-red-300' : 'border-gray-300'
                        }`}
                    maxLength={50}
                    style={{ textTransform: 'uppercase' }}
                />
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            {/* Dropdown */}
            {isOpen && filteredAirports.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
                    {/* Exact match indicator */}
                    {searchTerm.length === 3 && filteredAirports.some(airport => airport.code.toLowerCase() === searchTerm.toLowerCase()) && (
                        <div className="px-4 py-2 bg-green-50 border-b border-green-200 text-sm text-green-700">
                            ✅ Exact airport code match found! Select it or continue typing.
                        </div>
                    )}
                    {filteredAirports.map((airport, index) => {
                        const isExactMatch = airport.code.toLowerCase() === searchTerm.toLowerCase()
                        return (
                            <button
                                key={airport.code}
                                type="button"
                                onClick={() => handleAirportSelect(airport)}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 ${isExactMatch ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`font-medium ${isExactMatch ? 'text-green-700' : 'text-gray-900'}`}>
                                            {airport.code} - {airport.city}
                                            {isExactMatch && <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">✓ Exact Match</span>}
                                        </div>
                                        <div className="text-sm text-gray-600 truncate">
                                            {airport.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {airport.country}
                                        </div>
                                    </div>
                                    <div className={`text-lg font-bold ml-2 ${isExactMatch ? 'text-green-600' : 'text-primary'}`}>
                                        {airport.code}
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}

            {/* No results */}
            {isOpen && searchTerm && filteredAirports.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
                    <div className="text-sm">
                        No airports found for "{searchTerm}"
                    </div>
                    <div className="text-xs mt-1">
                        Try searching by city name or airport code
                    </div>
                </div>
            )}
        </div>
    )
}