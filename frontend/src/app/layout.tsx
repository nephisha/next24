import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'LastMinute Travel - Find Same-Day Flight & Hotel Deals',
    description: 'Discover unbeatable last-minute travel deals. Search and compare same-day and next-day flights and hotels across multiple providers.',
    keywords: 'last minute travel, same day flights, hotel deals, travel search, flight booking',
    authors: [{ name: 'LastMinute Travel' }],
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    openGraph: {
        title: 'LastMinute Travel - Same-Day Flight & Hotel Deals',
        description: 'Find unbeatable last-minute travel deals with our metasearch engine',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        siteName: 'LastMinute Travel',
        type: 'website',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'LastMinute Travel',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LastMinute Travel - Same-Day Flight & Hotel Deals',
        description: 'Find unbeatable last-minute travel deals',
        images: ['/og-image.jpg'],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gray-50`}>
                <div className="min-h-screen flex flex-col">
                    {children}
                </div>
            </body>
        </html>
    )
}
