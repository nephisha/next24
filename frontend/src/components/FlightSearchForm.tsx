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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Trip Type */}
            <div className="flex space-x-1 p-1 bg-white/20 backdrop-blur-sm rounded-xl w-fit border border-white/30">
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
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${!isRoundTrip
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-white hover:text-blue-200'
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
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${isRoundTrip
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-white hover:text-blue-200'
                        }`}>
                        Round trip
                    </span>
                </label>
            </div>

            {/* Route */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                    <label className="block text-sm font-medium text-white mb-2 group-focus-within:text-cyan-300 transition-colors">
                        <span className="text-lg mr-2">🛫</span>
                        From
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
                    <label className="block text-sm font-medium text-white mb-2 group-focus-within:text-cyan-300 transition-colors">
                        <span className="text-lg mr-2">🛬</span>
                        To
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                    <label className="block text-sm font-medium text-white mb-2 group-focus-within:text-cyan-300 transition-colors">
                        <span className="text-lg mr-2">📅</span>
                        Departure
                    </label>
                    <input
                        {...register('departure_date')}
                        type="date"
                        min={minDate}
                        max={maxDate}
                        className="w-full px-4 py-3 text-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
                    />
                    {errors.departure_date && (
                        <p className="mt-1 text-sm text-red-300 font-medium">{errors.departure_date.message}</p>
                    )}
                </div>

                {isRoundTrip && (
                    <div className="group">
                        <label className="block text-sm font-medium text-white mb-2 group-focus-within:text-cyan-300 transition-colors">
                            <span className="text-lg mr-2">🔄</span>
                            Return
                        </label>
                        <input
                            {...register('return_date')}
                            type="date"
                            min={watch('departure_date') || minDate}
                            max={maxDate}
                            className="w-full px-4 py-3 text-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
                        />
                        {errors.return_date && (
                            <p className="mt-1 text-sm text-red-300 font-medium">{errors.return_date.message}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Passengers */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-sm font-medium text-white mb-3">
                    <span className="text-lg mr-2">👥</span>
                    Passengers
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="group">
                        <label className="block text-sm font-medium text-white mb-1 group-focus-within:text-cyan-300 transition-colors">
                            Adults
                        </label>
                        <select
                            {...register('adults', { valueAsNumber: true })}
                            className="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-white mb-1 group-focus-within:text-cyan-300 transition-colors">
                            Children
                        </label>
                        <select
                            {...register('children', { valueAsNumber: true })}
                            className="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
                        >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-white mb-1 group-focus-within:text-cyan-300 transition-colors">
                            Infants
                        </label>
                        <select
                            {...register('infants', { valueAsNumber: true })}
                            className="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
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
                <label className="block text-sm font-medium text-white mb-2 group-focus-within:text-cyan-300 transition-colors">
                    <span className="text-lg mr-2">💺</span>
                    Class
                </label>
                <select
                    {...register('cabin_class')}
                    className="w-full px-4 py-3 text-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
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
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        <span className="text-lg">Searching amazing deals...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <span className="text-xl mr-3">✈️</span>
                        <span className="text-lg">Search Flights</span>
                    </div>
                )}
            </button>
        </form>
    )
}