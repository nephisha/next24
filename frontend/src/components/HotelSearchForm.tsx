'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getTodayAndTomorrow } from '@/lib/utils'
import type { HotelSearchParams } from '@/types'

const hotelSearchSchema = z.object({
    destination: z.string().min(1, 'Please enter destination'),
    check_in: z.string(),
    check_out: z.string(),
    adults: z.number().min(1).max(30),
    children: z.number().min(0).max(30),
    rooms: z.number().min(1).max(30),
    max_price: z.number().optional(),
    min_rating: z.number().min(0).max(5).optional(),
})

interface HotelSearchFormProps {
    onSearch: (params: HotelSearchParams) => void
    isLoading?: boolean
}

export default function HotelSearchForm({ onSearch, isLoading = false }: HotelSearchFormProps) {
    const { today, tomorrow } = getTodayAndTomorrow()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<HotelSearchParams>({
        resolver: zodResolver(hotelSearchSchema),
        defaultValues: {
            check_in: today,
            check_out: tomorrow,
            adults: 2,
            children: 0,
            rooms: 1,
        },
    })

    const onSubmit = (data: HotelSearchParams) => {
        onSearch(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Destination */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                </label>
                <input
                    {...register('destination')}
                    type="text"
                    placeholder="City or hotel name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                {errors.destination && (
                    <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
                )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in
                    </label>
                    <select
                        {...register('check_in')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        <option value={today}>Today</option>
                        <option value={tomorrow}>Tomorrow</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out
                    </label>
                    <select
                        {...register('check_out')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        <option value={tomorrow}>Tomorrow</option>
                        <option value={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}>
                            Day after tomorrow
                        </option>
                        <option value={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}>
                            +3 days
                        </option>
                    </select>
                </div>
            </div>

            {/* Guests & Rooms */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adults
                    </label>
                    <select
                        {...register('adults', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        {[1, 2, 3, 4, 5, 6].map(num => (
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
                        {[0, 1, 2, 3, 4].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rooms
                    </label>
                    <select
                        {...register('rooms', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        {[1, 2, 3, 4].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Price per Night (USD)
                    </label>
                    <input
                        {...register('max_price', { valueAsNumber: true })}
                        type="number"
                        placeholder="No limit"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating
                    </label>
                    <select
                        {...register('min_rating', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        <option value="">Any rating</option>
                        <option value="3">3+ stars</option>
                        <option value="4">4+ stars</option>
                        <option value="5">5 stars</option>
                    </select>
                </div>
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
                    'Search Hotels'
                )}
            </button>
        </form>
    )
}
