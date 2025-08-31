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
    direct_flights_only: z.boolean(),
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
            direct_flights_only: false,
        },
    })

    const onSubmit = (data: FlightSearchParams) => {
        // For one-way flights, ensure return_date is not sent
        const searchData = {
            ...data,
            return_date: isRoundTrip ? data.return_date : undefined
        }
        onSearch(searchData)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Trip Type */}
            <div className="flex space-x-4">
                <label className="flex items-center">
                    <input
                        type="radio"
                        checked={!isRoundTrip}
                        onChange={() => {
                            setIsRoundTrip(false)
                            // Clear return date when switching to one-way
                            setValue('return_date', '')
                        }}
                        className="mr-2 text-primary"
                    />
                    <span>One way</span>
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
                        className="mr-2 text-primary"
                    />
                    <span>Round trip</span>
                </label>
            </div>

            {/* Route */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        From
                    </label>
                    <AirportAutocomplete
                        value={watch('origin') || ''}
                        onChange={(code) => setValue('origin', code)}
                        placeholder="Search city or airport code..."
                        error={errors.origin?.message}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        To
                    </label>
                    <AirportAutocomplete
                        value={watch('destination') || ''}
                        onChange={(code) => setValue('destination', code)}
                        placeholder="Search city or airport code..."
                        error={errors.destination?.message}
                    />
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departure Date
                    </label>
                    <input
                        {...register('departure_date')}
                        type="date"
                        min={minDate}
                        max={maxDate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Select any date up to 11 months in advance
                    </p>
                    {errors.departure_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.departure_date.message}</p>
                    )}
                </div>

                {isRoundTrip && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Return Date
                        </label>
                        <input
                            {...register('return_date')}
                            type="date"
                            min={watch('departure_date') || minDate}
                            max={maxDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Must be after departure date
                        </p>
                        {errors.return_date && (
                            <p className="mt-1 text-sm text-red-600">{errors.return_date.message}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Passengers */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adults
                    </label>
                    <select
                        {...register('adults', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Children
                    </label>
                    <select
                        {...register('children', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Infants
                    </label>
                    <select
                        {...register('infants', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Class & Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class
                    </label>
                    <select
                        {...register('cabin_class')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        <option value="economy">Economy</option>
                        <option value="premium_economy">Premium Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First</option>
                    </select>
                </div>


            </div>

            {/* Direct flights checkbox */}
            <div className="flex items-center">
                <input
                    {...register('direct_flights_only')}
                    type="checkbox"
                    className="mr-2 text-primary"
                />
                <label className="text-sm text-gray-700">
                    Direct flights only
                </label>
            </div>

            {/* Submit button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Searching...
                    </div>
                ) : (
                    'Search Flights'
                )}
            </button>
        </form>
    )
}