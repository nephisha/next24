// Currency utilities for flight price display

export interface CurrencyInfo {
  code: string
  symbol: string
  name: string
  locale: string
}

// Airport code to currency mapping
export const AIRPORT_CURRENCY_MAP: Record<string, string> = {
  // United States
  'JFK': 'USD', 'LAX': 'USD', 'ORD': 'USD', 'MIA': 'USD', 'SFO': 'USD',
  'LAS': 'USD', 'SEA': 'USD', 'DEN': 'USD', 'ATL': 'USD', 'DFW': 'USD',
  'PHX': 'USD', 'IAH': 'USD', 'BOS': 'USD', 'MSP': 'USD', 'DTW': 'USD',
  'PHL': 'USD', 'LGA': 'USD', 'BWI': 'USD', 'DCA': 'USD', 'IAD': 'USD',

  // United Kingdom
  'LHR': 'GBP', 'LGW': 'GBP', 'STN': 'GBP', 'LTN': 'GBP', 'MAN': 'GBP',
  'EDI': 'GBP', 'GLA': 'GBP', 'BHX': 'GBP', 'NCL': 'GBP',

  // Eurozone
  'CDG': 'EUR', 'ORY': 'EUR', // France
  'FRA': 'EUR', 'MUC': 'EUR', 'DUS': 'EUR', 'BER': 'EUR', // Germany
  'AMS': 'EUR', // Netherlands
  'MAD': 'EUR', 'BCN': 'EUR', // Spain
  'FCO': 'EUR', 'MXP': 'EUR', 'LIN': 'EUR', // Italy
  'VIE': 'EUR', // Austria
  'BRU': 'EUR', // Belgium
  'LIS': 'EUR', // Portugal
  'ATH': 'EUR', // Greece
  'DUB': 'EUR', // Ireland
  'HEL': 'EUR', // Finland
  'ZUR': 'CHF', // Switzerland (not Eurozone)

  // Scandinavia
  'CPH': 'DKK', // Denmark
  'ARN': 'SEK', 'GOT': 'SEK', // Sweden
  'OSL': 'NOK', // Norway

  // Asia Pacific
  'NRT': 'JPY', 'HND': 'JPY', 'KIX': 'JPY', // Japan
  'ICN': 'KRW', 'GMP': 'KRW', // South Korea
  'PVG': 'CNY', 'PEK': 'CNY', 'CAN': 'CNY', 'SZX': 'CNY', // China
  'HKG': 'HKD', // Hong Kong
  'TPE': 'TWD', // Taiwan
  'SIN': 'SGD', // Singapore
  'BKK': 'THB', 'DMK': 'THB', // Thailand
  'KUL': 'MYR', 'PEN': 'MYR', // Malaysia
  'CGK': 'IDR', 'DPS': 'IDR', // Indonesia
  'MNL': 'PHP', // Philippines
  'SYD': 'AUD', 'MEL': 'AUD', 'BNE': 'AUD', 'PER': 'AUD', 'ADL': 'AUD', // Australia
  'AKL': 'NZD', 'CHC': 'NZD', // New Zealand

  // India
  'DEL': 'INR', 'BOM': 'INR', 'MAA': 'INR', 'BLR': 'INR', 'HYD': 'INR',
  'CCU': 'INR', 'COK': 'INR', 'GOI': 'INR', 'AMD': 'INR', 'PNQ': 'INR',

  // Middle East
  'DXB': 'AED', 'AUH': 'AED', // UAE
  'DOH': 'QAR', // Qatar
  'KWI': 'KWD', // Kuwait
  'RUH': 'SAR', 'JED': 'SAR', 'DMM': 'SAR', // Saudi Arabia
  'BAH': 'BHD', // Bahrain
  'MCT': 'OMR', // Oman
  'IST': 'TRY', 'SAW': 'TRY', // Turkey
  'TLV': 'ILS', // Israel

  // Canada
  'YYZ': 'CAD', 'YVR': 'CAD', 'YUL': 'CAD', 'YYC': 'CAD', 'YOW': 'CAD',

  // South America
  'GRU': 'BRL', 'GIG': 'BRL', 'BSB': 'BRL', // Brazil
  'EZE': 'ARS', 'AEP': 'ARS', // Argentina
  'SCL': 'CLP', // Chile
  'LIM': 'PEN', // Peru
  'BOG': 'COP', // Colombia
  'UIO': 'USD', // Ecuador (uses USD)

  // Africa
  'CAI': 'EGP', // Egypt
  'JNB': 'ZAR', 'CPT': 'ZAR', 'DUR': 'ZAR', // South Africa
  'LOS': 'NGN', 'ABV': 'NGN', // Nigeria
  'ADD': 'ETB', // Ethiopia
  'NBO': 'KES', // Kenya
  'DAR': 'TZS', // Tanzania
  'ACC': 'GHS', // Ghana
  'CMN': 'MAD', 'RAK': 'MAD', // Morocco
  'TUN': 'TND', // Tunisia
  'ALG': 'DZD', // Algeria

  // Eastern Europe
  'SVO': 'RUB', 'DME': 'RUB', 'VKO': 'RUB', // Russia
  'WAW': 'PLN', 'KRK': 'PLN', // Poland
  'PRG': 'CZK', // Czech Republic
  'BUD': 'HUF', // Hungary
  'OTP': 'RON', // Romania
  'SOF': 'BGN', // Bulgaria
  'ZAG': 'HRK', // Croatia
  'BEG': 'RSD', // Serbia
  'SKP': 'MKD', // North Macedonia
  'TIA': 'ALL', // Albania
  'LJU': 'EUR', // Slovenia (Eurozone)
  'SJJ': 'BAM', // Bosnia and Herzegovina
}

// Currency information
export const CURRENCY_INFO: Record<string, CurrencyInfo> = {
  'USD': { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  'EUR': { code: 'EUR', symbol: '€', name: 'Euro', locale: 'en-EU' },
  'GBP': { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  'JPY': { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  'CNY': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  'KRW': { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  'INR': { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  'AED': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  'SAR': { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA' },
  'QAR': { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal', locale: 'ar-QA' },
  'KWD': { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', locale: 'ar-KW' },
  'BHD': { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', locale: 'ar-BH' },
  'OMR': { code: 'OMR', symbol: '﷼', name: 'Omani Rial', locale: 'ar-OM' },
  'CAD': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  'AUD': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  'NZD': { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ' },
  'SGD': { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  'HKD': { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'en-HK' },
  'CHF': { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
  'SEK': { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE' },
  'NOK': { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO' },
  'DKK': { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK' },
  'THB': { code: 'THB', symbol: '฿', name: 'Thai Baht', locale: 'th-TH' },
  'MYR': { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY' },
  'IDR': { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID' },
  'PHP': { code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH' },
  'TWD': { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', locale: 'zh-TW' },
  'BRL': { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  'ARS': { code: 'ARS', symbol: '$', name: 'Argentine Peso', locale: 'es-AR' },
  'CLP': { code: 'CLP', symbol: '$', name: 'Chilean Peso', locale: 'es-CL' },
  'PEN': { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', locale: 'es-PE' },
  'COP': { code: 'COP', symbol: '$', name: 'Colombian Peso', locale: 'es-CO' },
  'ZAR': { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  'EGP': { code: 'EGP', symbol: '£', name: 'Egyptian Pound', locale: 'ar-EG' },
  'NGN': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG' },
  'TRY': { code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR' },
  'ILS': { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', locale: 'he-IL' },
  'RUB': { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU' },
  'PLN': { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', locale: 'pl-PL' },
  'CZK': { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', locale: 'cs-CZ' },
  'HUF': { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', locale: 'hu-HU' },
}

// Mock exchange rates (in production, you'd fetch from an API)
export const EXCHANGE_RATES: Record<string, number> = {
  // Base: USD = 1.00
  'USD': 1.00,
  'EUR': 0.85,
  'GBP': 0.73,
  'JPY': 110.0,
  'CNY': 6.45,
  'KRW': 1180.0,
  'INR': 74.5,
  'AED': 3.67,
  'SAR': 3.75,
  'QAR': 3.64,
  'KWD': 0.30,
  'BHD': 0.38,
  'OMR': 0.38,
  'CAD': 1.25,
  'AUD': 1.35,
  'NZD': 1.42,
  'SGD': 1.35,
  'HKD': 7.80,
  'CHF': 0.92,
  'SEK': 8.60,
  'NOK': 8.50,
  'DKK': 6.35,
  'THB': 33.0,
  'MYR': 4.15,
  'IDR': 14250.0,
  'PHP': 50.0,
  'TWD': 28.0,
  'BRL': 5.20,
  'ARS': 98.0,
  'CLP': 800.0,
  'PEN': 3.60,
  'COP': 3800.0,
  'ZAR': 14.5,
  'EGP': 15.7,
  'NGN': 411.0,
  'TRY': 8.50,
  'ILS': 3.25,
  'RUB': 73.0,
  'PLN': 3.85,
  'CZK': 21.5,
  'HUF': 295.0,
}

/**
 * Get the currency for an airport code
 */
export function getAirportCurrency(airportCode: string): string {
  return AIRPORT_CURRENCY_MAP[airportCode.toUpperCase()] || 'USD'
}

/**
 * Convert price from one currency to another
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount

  const fromRate = EXCHANGE_RATES[fromCurrency] || 1
  const toRate = EXCHANGE_RATES[toCurrency] || 1

  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate
  return usdAmount * toRate
}

/**
 * Format price in the specified currency with proper locale
 */
export function formatPriceInCurrency(amount: number, currency: string): string {
  const currencyInfo = CURRENCY_INFO[currency]
  if (!currencyInfo) {
    // Fallback to USD formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Convert and format price for display based on origin airport
 */
export function formatFlightPrice(
  price: number,
  originalCurrency: string,
  originAirport: string
): {
  formattedPrice: string
  currency: string
  originalPrice?: string
} {
  const targetCurrency = getAirportCurrency(originAirport)

  if (originalCurrency === targetCurrency) {
    return {
      formattedPrice: formatPriceInCurrency(price, originalCurrency),
      currency: originalCurrency
    }
  }

  const convertedAmount = convertCurrency(price, originalCurrency, targetCurrency)

  return {
    formattedPrice: formatPriceInCurrency(convertedAmount, targetCurrency),
    currency: targetCurrency,
    originalPrice: formatPriceInCurrency(price, originalCurrency)
  }
}