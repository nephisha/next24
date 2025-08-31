'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getDateLimits } from '@/lib/utils'
import AirportAutocomplete from './AirportAutocomplete'
import type { FlightSearchParams } from '@/types'

const flightSearchSchema = z.object({
    origin: z.string().min(3, 'Please select origin airport').max(3),
    destination: z.string().min(3, 'Please select destination airport').max(3),
    departure_date: z.string().min(1, 'Please select departure date'),
    return_date: z.string().optional(),
    adults: z.number().min(1).max(9),
    children: z.number().min(0).max(9),
    infants: z.number().min(0).max(9),
    cabin_class: z.enum(['economy', 'premium_economy', 'business', 'first']),
}).refine((data) => {
    if (data.return_date && data.departure_date) {
        return new Date(data.return_date) > new Date(data.departure_date)
    }
    return true
}, {
    message: "Return date must be after departure date",
    path: ["return_date"],
})

interface FlightSearchFormProps {
    onSearch: (params: FlightSearchParams) => void
    isLoading?: boolean
}

export default function FlightSearchForm({ onSearch, isLoading = false }: FlightSearchFormProps) {
    const [isRoundTrip, setIsRoundTrip] = useState(false)
    const { minDate, maxDate, defaultDeparture, defaultReturn } = getDateLimits()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FlightSearchParams>({
        resolver: zodResolver(flightSearchSchema),
        defaultValues: {
            departure_date: defaultDeparture,
            return_date: '', // Start with empty return date for one-way
            adults: 1,
            children: 0,
            infants: 0,
            cabin_class: 'economy',
        },
    })

    const onSubmit = (data: FlightSearchParams) => {
        // For one-way flights, ensure return_date is not sent
        const searchData = {
            ...data,
            return_date: isRoundTrip ? data.return_date : undefined,
            direct_flights_only: false // Default to false since we removed the checkbox
        }
        onSearch(searchData)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Trip Type */}
            <div className="flex space-x-1 p-0.5 bg-gray-100 rounded-md w-fit">
                <label className="flex items-center">
                    <input
                        type="radio"
                        checked={!isRoundTrip}
                        onChange={() => {
                            setIsRoundTrip(false)
                            // Clear return date when switching to one-way
                            setValue('return_date', '')
                        }}
                        className="sr-only"
                    />
                    <span className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 cursor-pointer ${!isRoundTrip
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-primary'
                        }`}>
                        One way
                    </span>
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        checked={isRoundTrip}
                        onChange={() => {
                            setIsRoundTrip(true)
                            // Auto-set return date if not already set
                            if (!watch('return_date')) {
                                setValue('return_date', defaultReturn)
                            }
                        }}
                        className="sr-only"
                    />
                    <span className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 cursor-pointer ${isRoundTrip
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-primary'
                        }`}>
                        Round trip
                    </span>
                </label>
            </div>

            {/* Route */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="group">
                    <label className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-cyan-600 transition-colors">
                        <span className="text-sm mr-1">🛫</span>
                        Origin
                    </label>
                    <div className="relative">
                        <AirportAutocomplete
                            value={watch('origin') || ''}
                            onChange={(code) => setValue('origin', code)}
                            placeholder="Origin city or airport"
                            error={errors.origin?.message}
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-cyan-600 transition-colors">
                        <span className="text-sm mr-1">🛬</span>
                        Destination
                    </label>
                    <div className="relative">
                        <AirportAutocomplete
                            value={watch('destination') || ''}
                            onChange={(code) => setValue('destination', code)}
                            placeholder="Destination city or airport"
                            error={errors.destination?.message}
                        />
                    </div>
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="group">
                    <label className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-cyan-600 transition-colors">
                        <span className="text-sm mr-1">📅</span>
                        Departure Date
                    </label>
                    <input
                        {...register('departure_date')}
                        type="date"
                        min={minDate}
                        max={maxDate}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                    {errors.departure_date && (
                        <p className="mt-0.5 text-xs text-red-600 font-medium">{errors.departure_date.message}</p>
                    )}
                </div>

                {isRoundTrip && (
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-cyan-600 transition-colors">
                            <span className="text-sm mr-1">🔄</span>
                            Return Date
                        </label>
                        <input
                            {...register('return_date')}
                            type="date"
                            min={watch('departure_date') || minDate}
                            max={maxDate}
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                        />
                        {errors.return_date && (
                            <p className="mt-0.5 text-xs text-red-600 font-medium">{errors.return_date.message}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Passengers */}
            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-md p-2">
                <h3 className="text-xs font-medium text-gray-700 mb-1.5">
                    <span className="text-sm mr-1">👥</span>
                    Passengers
                </h3>
                <div className="grid grid-cols-3 gap-1.5">
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-600 mb-0.5 group-focus-within:text-cyan-600 transition-colors">
                            Adults
                        </label>
                        <select
                            {...register('adults', { valueAsNumber: true })}
                            className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 bg-white"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <div className="group">
                        <label className="block text-xs font-medium text-gray-600 mb-0.5 group-focus-within:text-cyan-600 transition-colors">
                            Children
                        </label>
                        <select
                            {...register('children', { valueAsNumber: true })}
                            className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 bg-white"
                        >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <div className="group">
                        <label className="block text-xs font-medium text-gray-600 mb-0.5 group-focus-within:text-cyan-600 transition-colors">
                            Infants
                        </label>
                        <select
                            {...register('infants', { valueAsNumber: true })}
                            className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 bg-white"
                        >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Class */}
            <div className="group">
                <label className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-cyan-600 transition-colors">
                    <span className="text-sm mr-1">💺</span>
                    Class
                </label>
                <select
                    {...register('cabin_class')}
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                >
                    <option value="economy">Economy</option>
                    <option value="premium_economy">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First</option>
                </select>
            </div>

            {/* Submit button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-sm"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5" />
                        <span className="text-sm">Searching deals...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <span className="text-base mr-1.5">🚀</span>
                        <span className="text-sm">Search Flights</span>
                    </div>
                )}
            </button>
        </form>
    )
}