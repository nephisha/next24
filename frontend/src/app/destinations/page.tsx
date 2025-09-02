'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Plane, MapPin, Clock, Star, Globe, Compass, Camera } from 'lucide-react';

// Comprehensive destinations organized by continent
const destinationsByContinent = {
    Europe: [
        {
            id: 'paris-france',
            name: 'Paris',
            country: 'France',
            countryCode: 'france',
            cityCode: 'paris',
            image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&h=600&fit=crop&auto=format&q=80',
            description: 'The City of Light beckons with iconic landmarks, world-class museums, and romantic charm.',
            highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
            bestTime: 'Apr-Jun, Sep-Oct',
            avgFlightPrice: '$650',
            rating: 4.8
        },
        {
            id: 'london-uk',
            name: 'London',
            country: 'United Kingdom',
            countryCode: 'uk',
            cityCode: 'london',
            image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&auto=format&q=80',
            description: 'Royal heritage meets modern innovation in this cosmopolitan capital.',
            highlights: ['Big Ben', 'British Museum', 'Tower Bridge'],
            bestTime: 'May-Sep',
            avgFlightPrice: '$550',
            rating: 4.7
        },
        {
            id: 'rome-italy',
            name: 'Rome',
            country: 'Italy',
            countryCode: 'italy',
            cityCode: 'rome',
            image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
            description: 'The Eternal City where ancient history comes alive.',
            highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain'],
            bestTime: 'Apr-Jun, Sep-Oct',
            avgFlightPrice: '$580',
            rating: 4.9
        },
        {
            id: 'barcelona-spain',
            name: 'Barcelona',
            country: 'Spain',
            countryCode: 'spain',
            cityCode: 'barcelona',
            image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
            description: 'Where Gaudí\'s dreams meet Mediterranean charm.',
            highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas'],
            bestTime: 'May-Jun, Sep-Oct',
            avgFlightPrice: '$520',
            rating: 4.6
        },
        {
            id: 'berlin-germany',
            name: 'Berlin',
            country: 'Germany',
            countryCode: 'germany',
            cityCode: 'berlin',
            image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=600&fit=crop',
            description: 'Where history meets cutting-edge culture.',
            highlights: ['Brandenburg Gate', 'Berlin Wall', 'Museum Island'],
            bestTime: 'May-Sep',
            avgFlightPrice: '$480',
            rating: 4.5
        },
        {
            id: 'amsterdam-netherlands',
            name: 'Amsterdam',
            country: 'Netherlands',
            countryCode: 'netherlands',
            cityCode: 'amsterdam',
            image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
            description: 'Venice of the North with canals, culture, and charm.',
            highlights: ['Anne Frank House', 'Rijksmuseum', 'Canal Ring'],
            bestTime: 'Apr-May, Sep-Nov',
            avgFlightPrice: '$520',
            rating: 4.4
        },
        {
            id: 'athens-greece',
            name: 'Athens',
            country: 'Greece',
            countryCode: 'greece',
            cityCode: 'athens',
            image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=600&fit=crop',
            description: 'The cradle of Western civilization and democracy.',
            highlights: ['Acropolis', 'Ancient Agora', 'Plaka District'],
            bestTime: 'Apr-Jun, Sep-Oct',
            avgFlightPrice: '$590',
            rating: 4.3
        },
        {
            id: 'istanbul-turkey',
            name: 'Istanbul',
            country: 'Turkey',
            countryCode: 'turkey',
            cityCode: 'istanbul',
            image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop',
            description: 'Where Europe meets Asia in magnificent harmony.',
            highlights: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar'],
            bestTime: 'Apr-May, Sep-Nov',
            avgFlightPrice: '$650',
            rating: 4.6
        },
        {
            id: 'moscow-russia',
            name: 'Moscow',
            country: 'Russia',
            countryCode: 'russia',
            cityCode: 'moscow',
            image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
            description: 'The heart of Russia with iconic Red Square and Kremlin.',
            highlights: ['Red Square', 'Kremlin', 'Bolshoi Theatre'],
            bestTime: 'May-Sep',
            avgFlightPrice: '$720',
            rating: 4.2
        }
    ],
    Asia: [
        {
            id: 'tokyo-japan',
            name: 'Tokyo',
            country: 'Japan',
            countryCode: 'japan',
            cityCode: 'tokyo',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop&auto=format&q=80',
            description: 'Where ancient traditions meet cutting-edge innovation.',
            highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree'],
            bestTime: 'Mar-May, Sep-Nov',
            avgFlightPrice: '$850',
            rating: 4.8
        },
        {
            id: 'bangkok-thailand',
            name: 'Bangkok',
            country: 'Thailand',
            countryCode: 'thailand',
            cityCode: 'bangkok',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            description: 'The vibrant heart of Southeast Asia.',
            highlights: ['Grand Palace', 'Wat Pho Temple', 'Chatuchak Market'],
            bestTime: 'Nov-Mar',
            avgFlightPrice: '$780',
            rating: 4.5
        },
        {
            id: 'singapore-singapore',
            name: 'Singapore',
            country: 'Singapore',
            countryCode: 'singapore',
            cityCode: 'singapore',
            image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop',
            description: 'The Lion City where East meets West.',
            highlights: ['Gardens by the Bay', 'Marina Bay Sands', 'Chinatown'],
            bestTime: 'Feb-Apr',
            avgFlightPrice: '$920',
            rating: 4.7
        },
        {
            id: 'beijing-china',
            name: 'Beijing',
            country: 'China',
            countryCode: 'china',
            cityCode: 'beijing',
            image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop',
            description: 'Ancient capital where imperial history meets modern China.',
            highlights: ['Forbidden City', 'Great Wall', 'Temple of Heaven'],
            bestTime: 'Apr-May, Sep-Oct',
            avgFlightPrice: '$820',
            rating: 4.4
        },
        {
            id: 'seoul-south-korea',
            name: 'Seoul',
            country: 'South Korea',
            countryCode: 'south-korea',
            cityCode: 'seoul',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
            description: 'Dynamic metropolis where K-culture meets ancient traditions.',
            highlights: ['Gyeongbokgung Palace', 'Bukchon Hanok Village', 'Myeongdong'],
            bestTime: 'Apr-Jun, Sep-Nov',
            avgFlightPrice: '$750',
            rating: 4.3
        },
        {
            id: 'ho-chi-minh-vietnam',
            name: 'Ho Chi Minh City',
            country: 'Vietnam',
            countryCode: 'vietnam',
            cityCode: 'ho-chi-minh-city',
            image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop',
            description: 'The bustling heart of Vietnam with incredible street food.',
            highlights: ['Ben Thanh Market', 'War Remnants Museum', 'Cu Chi Tunnels'],
            bestTime: 'Dec-Apr',
            avgFlightPrice: '$680',
            rating: 4.2
        },
        {
            id: 'mumbai-india',
            name: 'Mumbai',
            country: 'India',
            countryCode: 'india',
            cityCode: 'mumbai',
            image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
            description: 'The City of Dreams where Bollywood magic comes alive.',
            highlights: ['Gateway of India', 'Marine Drive', 'Bollywood Studios'],
            bestTime: 'Nov-Feb',
            avgFlightPrice: '$720',
            rating: 4.1
        }
    ],
    'North America': [
        {
            id: 'new-york-usa',
            name: 'New York City',
            country: 'United States',
            countryCode: 'usa',
            cityCode: 'new-york',
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
            description: 'The city that never sleeps, where dreams come alive.',
            highlights: ['Statue of Liberty', 'Central Park', 'Times Square'],
            bestTime: 'Apr-Jun, Sep-Nov',
            avgFlightPrice: '$450',
            rating: 4.7
        },
        {
            id: 'vancouver-canada',
            name: 'Vancouver',
            country: 'Canada',
            countryCode: 'canada',
            cityCode: 'vancouver',
            image: 'https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?w=800&h=600&fit=crop',
            description: 'Where mountains meet the ocean in perfect harmony.',
            highlights: ['Stanley Park', 'Granville Island', 'Capilano Bridge'],
            bestTime: 'Jun-Aug, Sep-Oct',
            avgFlightPrice: '$420',
            rating: 4.5
        },
        {
            id: 'mexico-city-mexico',
            name: 'Mexico City',
            country: 'Mexico',
            countryCode: 'mexico',
            cityCode: 'mexico-city',
            image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
            description: 'The vibrant heart of Mexico where ancient meets modern.',
            highlights: ['Zócalo', 'Frida Kahlo Museum', 'Teotihuacán'],
            bestTime: 'Mar-May, Sep-Nov',
            avgFlightPrice: '$380',
            rating: 4.3
        }
    ],
    'South America': [
        {
            id: 'rio-brazil',
            name: 'Rio de Janeiro',
            country: 'Brazil',
            countryCode: 'brazil',
            cityCode: 'rio-de-janeiro',
            image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
            description: 'The Marvelous City of beaches, mountains, and carnival spirit.',
            highlights: ['Christ the Redeemer', 'Copacabana Beach', 'Sugarloaf Mountain'],
            bestTime: 'Dec-Mar, May-Oct',
            avgFlightPrice: '$680',
            rating: 4.6
        },
        {
            id: 'buenos-aires-argentina',
            name: 'Buenos Aires',
            country: 'Argentina',
            countryCode: 'argentina',
            cityCode: 'buenos-aires',
            image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&h=600&fit=crop',
            description: 'The Paris of South America with tango, steaks, and passion.',
            highlights: ['La Boca', 'Recoleta Cemetery', 'San Telmo'],
            bestTime: 'Mar-May, Sep-Nov',
            avgFlightPrice: '$720',
            rating: 4.4
        },
        {
            id: 'santiago-chile',
            name: 'Santiago',
            country: 'Chile',
            countryCode: 'chile',
            cityCode: 'santiago',
            image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=800&h=600&fit=crop',
            description: 'Cosmopolitan capital surrounded by the majestic Andes.',
            highlights: ['Cerro San Cristóbal', 'La Moneda Palace', 'Wine Country'],
            bestTime: 'Mar-May, Sep-Nov',
            avgFlightPrice: '$780',
            rating: 4.2
        },
        {
            id: 'lima-peru',
            name: 'Lima',
            country: 'Peru',
            countryCode: 'peru',
            cityCode: 'lima',
            image: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800&h=600&fit=crop',
            description: 'Culinary capital with colonial charm and coastal beauty.',
            highlights: ['Historic Center', 'Miraflores', 'Larco Museum'],
            bestTime: 'Dec-Apr',
            avgFlightPrice: '$650',
            rating: 4.1
        }
    ],
    'Africa & Middle East': [
        {
            id: 'cairo-egypt',
            name: 'Cairo',
            country: 'Egypt',
            countryCode: 'egypt',
            cityCode: 'cairo',
            image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop',
            description: 'The Mother of the World where ancient wonders meet modern life.',
            highlights: ['Pyramids of Giza', 'Egyptian Museum', 'Khan el-Khalili'],
            bestTime: 'Oct-Apr',
            avgFlightPrice: '$620',
            rating: 4.3
        },
        {
            id: 'cape-town-south-africa',
            name: 'Cape Town',
            country: 'South Africa',
            countryCode: 'south-africa',
            cityCode: 'cape-town',
            image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop',
            description: 'The Mother City where two oceans meet.',
            highlights: ['Table Mountain', 'V&A Waterfront', 'Cape Winelands'],
            bestTime: 'Nov-Mar',
            avgFlightPrice: '$890',
            rating: 4.7
        },
        {
            id: 'marrakech-morocco',
            name: 'Marrakech',
            country: 'Morocco',
            countryCode: 'morocco',
            cityCode: 'marrakech',
            image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop',
            description: 'The Red City where ancient traditions meet vibrant souks.',
            highlights: ['Jemaa el-Fnaa', 'Bahia Palace', 'Majorelle Garden'],
            bestTime: 'Oct-Apr',
            avgFlightPrice: '$580',
            rating: 4.4
        },
        {
            id: 'dubai-uae',
            name: 'Dubai',
            country: 'United Arab Emirates',
            countryCode: 'uae',
            cityCode: 'dubai',
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
            description: 'Futuristic oasis where luxury meets desert adventure.',
            highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah'],
            bestTime: 'Nov-Mar',
            avgFlightPrice: '$750',
            rating: 4.5
        },
        {
            id: 'tel-aviv-israel',
            name: 'Tel Aviv',
            country: 'Israel',
            countryCode: 'israel',
            cityCode: 'tel-aviv',
            image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=800&h=600&fit=crop',
            description: 'The Mediterranean city that never stops.',
            highlights: ['Tel Aviv Beach', 'Jaffa Old City', 'White City'],
            bestTime: 'Apr-Jun, Sep-Nov',
            avgFlightPrice: '$680',
            rating: 4.3
        }
    ],
    Oceania: [
        {
            id: 'sydney-australia',
            name: 'Sydney',
            country: 'Australia',
            countryCode: 'australia',
            cityCode: 'sydney',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            description: 'Harbor city where urban sophistication meets natural beauty.',
            highlights: ['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach'],
            bestTime: 'Sep-Nov, Mar-May',
            avgFlightPrice: '$1,200',
            rating: 4.8
        },
        {
            id: 'auckland-new-zealand',
            name: 'Auckland',
            country: 'New Zealand',
            countryCode: 'new-zealand',
            cityCode: 'auckland',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            description: 'City of Sails surrounded by harbors and volcanic cones.',
            highlights: ['Sky Tower', 'Waitemata Harbour', 'Rangitoto Island'],
            bestTime: 'Dec-Mar, Sep-Nov',
            avgFlightPrice: '$1,100',
            rating: 4.6
        }
    ]
};

const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
        <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                    ? 'text-yellow-400 fill-current opacity-50'
                    : 'text-gray-300'
                }`}
        />
    ));
};

export default function DestinationsPage() {
    const totalDestinations = Object.values(destinationsByContinent).flat().length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-700/90"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                <Globe className="w-5 h-5" />
                                <span className="text-sm font-medium">{totalDestinations} Amazing Destinations</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Discover Your Next Adventure
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
                            Explore breathtaking destinations around the world with comprehensive guides, insider tips, seasonal recommendations, and the best flight deals.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Compass className="w-5 h-5" />
                                <span>Expert Travel Guides</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Camera className="w-5 h-5" />
                                <span>Photo Galleries</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <MapPin className="w-5 h-5" />
                                <span>Interactive Maps</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Plane className="w-5 h-5" />
                                <span>Flight Deals</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Destinations by Continent */}
                {Object.entries(destinationsByContinent).map(([continent, destinations]) => (
                    <section key={continent} className="mb-20">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <h2 className="text-4xl font-bold text-gray-900 px-6">{continent}</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {destinations.map((destination) => (
                                <Link
                                    key={destination.id}
                                    href={`/destinations/${destination.countryCode}/${destination.cityCode}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                        <div className="relative h-56 overflow-hidden bg-gray-200">
                                            <Image
                                                src={destination.image}
                                                alt={`${destination.name}, ${destination.country}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                onLoad={() => console.log(`✅ Destination image loaded: ${destination.name}`)}
                                                onError={() => console.error(`❌ Destination image failed: ${destination.name}`)}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                                                From {destination.avgFlightPrice}
                                            </div>
                                            <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                                {renderStars(destination.rating)}
                                                <span className="text-xs font-medium text-gray-700 ml-1">
                                                    {destination.rating}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {destination.name}
                                                </h3>
                                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                    {destination.country}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                                {destination.description}
                                            </p>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Must-See Attractions</h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {destination.highlights.map((highlight) => (
                                                            <span
                                                                key={highlight}
                                                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
                                                            >
                                                                {highlight}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Best: {destination.bestTime}</span>
                                                    </div>
                                                    <div className="text-blue-600 font-medium group-hover:text-blue-700">
                                                        Explore Guide →
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Call to Action */}
                <section className="mt-20 relative">
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                    <Plane className="w-8 h-8" />
                                </div>
                            </div>
                            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                            <p className="text-xl mb-8 max-w-2xl mx-auto">
                                Find the best flight deals to your dream destination and start planning your perfect trip today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                                >
                                    <Plane className="w-5 h-5" />
                                    Search Flights
                                </Link>
                                <Link
                                    href="/planner"
                                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Plan Itinerary
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}