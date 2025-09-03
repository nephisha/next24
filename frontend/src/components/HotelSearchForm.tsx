'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getDateLimits } from '@/lib/utils'
import type { HotelSearchParams } from '@/types'

const hotelSearchSchema = z.object({
    destination: z.string().min(1, 'Please enter destination'),
    check_in: z.string().min(1, 'Please select check-in date'),
    check_out: z.string().min(1, 'Please select check-out date'),
    adults: z.number().min(1).max(30),
    children: z.number().min(0).max(30),
    rooms: z.number().min(1).max(30),
}).refine((data) => {
    if (data.check_out && data.check_in) {
        return new Date(data.check_out) > new Date(data.check_in)
    }
    return true
}, {
    message: "Check-out date must be after check-in date",
    path: ["check_out"],
})

interface HotelSearchFormProps {
    onSearch: (params: HotelSearchParams) => void
    isLoading?: boolean
    initialValues?: HotelSearchParams | null
    redirectToResults?: boolean
}

export default function HotelSearchForm({
    onSearch,
    isLoading = false,
    initialValues = null,
    redirectToResults = false
}: HotelSearchFormProps) {
    const { minDate, maxDate, defaultDeparture, defaultReturn } = getDateLimits()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<HotelSearchParams>({
        resolver: zodResolver(hotelSearchSchema),
        defaultValues: initialValues || {
            check_in: defaultDeparture,
            check_out: defaultReturn,
            adults: 2,
            children: 0,
            rooms: 1,
        },
    })

    const onSubmit = (data: HotelSearchParams) => {
        if (redirectToResults) {
            // Redirect to hotels page with search params
            const params = new URLSearchParams({
                destination: data.destination,
                check_in: data.check_in,
                check_out: data.check_out,
                adults: data.adults.toString(),
                children: data.children.toString(),
                rooms: data.rooms.toString(),
            })

            window.location.href = `/hotels?${params.toString()}`
        } else {
            onSearch(data)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Destination */}
            <div className="group">
                <label className="block text-sm font-medium text-white mb-2 group-focus-within:text-cyan-300 transition-colors">
                    <span className="text-lg mr-2">🏨</span>
                    Destination
                </label>
                <input
                    {...register('destination')}
                    type="text"
                    placeholder="City or hotel name"
                    className="w-full px-4 py-3 text-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
                />
                {errors.destination && (
                    <p className="mt-1 text-sm text-red-300 font-medium">{errors.destination.message}</p>
                )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                    <label className="block text-sm font-medium text-white mb-2 group-focus-within:text-cyan-300 transition-colors">
                        <span className="text-lg mr-2">📅</span>
                        Check-in
                    </label>
                    <input
                        {...register('check_in')}
                        type="date"
                        min={minDate}
                        max={maxDate}
                        className="w-full px-4 py-3 text-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
                    />
                    {errors.check_in && (
                        <p className="mt-1 text-sm text-red-300 font-medium">{errors.check_in.message}</p>
                    )}
                </div>

                <div className="group">
                    <label className="block text-sm font-medium text-white mb-2 group-focus-within:text-cyan-300 transition-colors">
                        <span className="text-lg mr-2">🔄</span>
                        Check-out
                    </label>
                    <input
                        {...register('check_out')}
                        type="date"
                        min={watch('check_in') || minDate}
                        max={maxDate}
                        className="w-full px-4 py-3 text-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
                    />
                    {errors.check_out && (
                        <p className="mt-1 text-sm text-red-300 font-medium">{errors.check_out.message}</p>
                    )}
                </div>
            </div>

            {/* Guests & Rooms */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-sm font-medium text-white mb-3">
                    <span className="text-lg mr-2">👥</span>
                    Guests & Rooms
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
                            {[1, 2, 3, 4, 5, 6].map(num => (
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
                            {[0, 1, 2, 3, 4].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-white mb-1 group-focus-within:text-cyan-300 transition-colors">
                            Rooms
                        </label>
                        <select
                            {...register('rooms', { valueAsNumber: true })}
                            className="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
                        >
                            {[1, 2, 3, 4].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>



            {/* Submit button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-purple-600 hover:via-pink-600 hover:to-red-600 focus:ring-4 focus:ring-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        <span className="text-lg">Searching amazing hotels...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <span className="text-xl mr-3">🏨</span>
                        <span className="text-lg">Search Hotels</span>
                    </div>
                )}
            </button>
        </form>
    )
}
