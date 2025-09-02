import Link from 'next/link';
import { MapPin, ArrowLeft, Search } from 'lucide-react';

export default function DestinationNotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center px-4">
                <div className="mb-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Destination Not Found</h1>
                    <p className="text-gray-600">
                        We couldn't find information about this destination. It might not be available yet or the URL might be incorrect.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/destinations"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse All Destinations
                    </Link>

                    <div className="text-sm text-gray-500">
                        or
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <Search className="w-4 h-4" />
                        Search Flights Instead
                    </Link>
                </div>
            </div>
        </div>
    );
}