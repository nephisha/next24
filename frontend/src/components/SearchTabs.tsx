'use client'

import { cn } from '@/lib/utils'

interface SearchTabsProps {
    activeTab: 'flights' | 'hotels'
    onTabChange: (tab: 'flights' | 'hotels') => void
}

export default function SearchTabs({ activeTab, onTabChange }: SearchTabsProps) {
    return (
        <div className="flex space-x-0.5 p-0.5 bg-gray-100 rounded-lg border border-gray-200">
            <button
                onClick={() => onTabChange('flights')}
                className={cn(
                    'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300',
                    activeTab === 'flights'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : 'text-gray-600 hover:text-primary hover:bg-white/50'
                )}
            >
                <span className="text-base mr-1.5">✈️</span>
                Flights
            </button>
            <button
                onClick={() => onTabChange('hotels')}
                className={cn(
                    'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300',
                    activeTab === 'hotels'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : 'text-gray-600 hover:text-primary hover:bg-white/50'
                )}
            >
                <span className="text-base mr-1.5">🏨</span>
                Hotels
            </button>
        </div>
    )
}