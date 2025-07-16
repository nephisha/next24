'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SearchTabsProps {
    activeTab: 'flights' | 'hotels'
    onTabChange: (tab: 'flights' | 'hotels') => void
}

export default function SearchTabs({ activeTab, onTabChange }: SearchTabsProps) {
    return (
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            <button
                onClick={() => onTabChange('flights')}
                className={cn(
                    'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    activeTab === 'flights'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                )}
            >
                ✈️ Flights
            </button>
            <button
                onClick={() => onTabChange('hotels')}
                className={cn(
                    'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    activeTab === 'hotels'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                )}
            >
                🏨 Hotels
            </button>
        </div>
    )
}