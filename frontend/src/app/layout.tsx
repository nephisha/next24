import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: 'Next24 - Compare Flights from 600+ Airlines Worldwide',
    description: 'Search and compare flights from 600+ airlines worldwide with real-time prices in your local currency. Find your perfect flight deal with Next24.',
    keywords: 'Next24, flight search, compare flights, airline tickets, flight booking, travel search, flight deals, cheap flights',
    authors: [{ name: 'Next24' }],
    robots: 'index, follow',
    openGraph: {
        title: 'Next24 - Compare Flights from 600+ Airlines',
        description: 'Search and compare flights from 600+ airlines worldwide with real-time prices in your local currency',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        siteName: 'Next24',
        type: 'website',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Next24 - Compare Flights Worldwide',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Next24 - Compare Flights from 600+ Airlines',
        description: 'Search and compare flights worldwide with real-time prices - Next24',
        images: ['/og-image.jpg'],
    },
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                {/* Travelpayouts Verification Script */}
                <Script
                    id="travelpayouts-verification"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                (function () {
                    var script = document.createElement("script");
                    script.async = 1;
                    script.src = 'https://tp-em.com/NDM5NDA2.js?t=439406';
                    document.head.appendChild(script);
                })();
                `
                    }}
                />
            </head>
            <body className={`${inter.className} bg-gray-50`}>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
