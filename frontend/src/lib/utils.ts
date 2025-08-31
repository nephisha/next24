import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price with 3-character currency code (e.g., "1,234 USD" instead of "$1,234")
export function formatPrice(price: number, currency: string = 'USD'): string {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  return `${formattedNumber} ${currency}`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), 'MMM dd, HH:mm')
}

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM dd, yyyy')
}

export function getStopsText(stops: number): string {
  if (stops === 0) return 'Direct'
  if (stops === 1) return '1 stop'
  return `${stops} stops`
}

export function getTodayAndTomorrow() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return {
    today: format(today, 'yyyy-MM-dd'),
    tomorrow: format(tomorrow, 'yyyy-MM-dd'),
  }
}

export function getDateLimits() {
  const today = new Date()
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 330) // ~11 months like Google Flights

  return {
    minDate: format(today, 'yyyy-MM-dd'),
    maxDate: format(maxDate, 'yyyy-MM-dd'),
    defaultDeparture: format(today, 'yyyy-MM-dd'),
    defaultReturn: format(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 1 week later
  }
}