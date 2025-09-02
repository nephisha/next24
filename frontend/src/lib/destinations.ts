// Destination data types
export interface Destination {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    cityCode: string;
    airportCode: string;
    tagline: string;
    description: string;
    heroImage: string;
    bestTime: string;
    climate: string;
    currency: string;
    language: string;
    avgFlightPrice: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    attractions: Attraction[];
    itineraries: Itinerary[];
    tips: {
        budget: string[];
        cultural: string[];
    };
}

export interface Attraction {
    name: string;
    description: string;
    image: string;
    category: string;
}

export interface Itinerary {
    duration: string;
    title: string;
    days: {
        title: string;
        activities: string;
    }[];
}

// Sample destination data - this will be expanded
const destinationsData: Record<string, Record<string, Destination>> = {
    france: {
        paris: {
            id: 'paris-france',
            name: 'Paris',
            country: 'France',
            countryCode: 'france',
            cityCode: 'paris',
            airportCode: 'CDG',
            tagline: 'The City of Light awaits with timeless elegance and endless discoveries',
            description: 'Paris, the capital of France, is globally renowned for its art, fashion, gastronomy, and culture. From the iconic Eiffel Tower to the world-famous Louvre Museum, every corner of this magnificent city tells a story. Stroll along the Seine River, explore charming neighborhoods like Montmartre, and indulge in exquisite French cuisine at sidewalk cafés.',
            heroImage: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1200&h=800&fit=crop&auto=format&q=80',
            bestTime: 'April-June, September-October',
            climate: 'Temperate oceanic',
            currency: 'Euro (EUR)',
            language: 'French',
            avgFlightPrice: '$650',
            coordinates: {
                lat: 48.8566,
                lng: 2.3522
            },
            attractions: [
                {
                    name: 'Eiffel Tower',
                    description: 'Iconic iron lattice tower and symbol of Paris, offering breathtaking city views.',
                    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop&auto=format&q=80',
                    category: 'landmark'
                },
                {
                    name: 'Louvre Museum',
                    description: 'World\'s largest art museum, home to the Mona Lisa and countless masterpieces.',
                    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&auto=format&q=80',
                    category: 'museum'
                },
                {
                    name: 'Notre-Dame Cathedral',
                    description: 'Gothic architectural masterpiece on Île de la Cité, currently under restoration.',
                    image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop&auto=format&q=80',
                    category: 'religious'
                },
                {
                    name: 'Montmartre & Sacré-Cœur',
                    description: 'Bohemian hilltop district with the stunning Sacré-Cœur Basilica.',
                    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop&auto=format&q=80',
                    category: 'neighborhood'
                }
            ],
            itineraries: [
                {
                    duration: '3 Days',
                    title: 'Paris Highlights',
                    days: [
                        {
                            title: 'Classic Paris',
                            activities: 'Eiffel Tower, Seine River cruise, Champs-Élysées, Arc de Triomphe'
                        },
                        {
                            title: 'Art & Culture',
                            activities: 'Louvre Museum, Tuileries Garden, Île de la Cité, Notre-Dame area'
                        },
                        {
                            title: 'Bohemian Paris',
                            activities: 'Montmartre, Sacré-Cœur, artist squares, Latin Quarter'
                        }
                    ]
                },
                {
                    duration: '1 Week',
                    title: 'Paris Deep Dive',
                    days: [
                        {
                            title: 'Iconic Landmarks',
                            activities: 'Eiffel Tower, Trocadéro, Seine cruise, dinner cruise'
                        },
                        {
                            title: 'World-Class Museums',
                            activities: 'Louvre, Musée d\'Orsay, Rodin Museum'
                        },
                        {
                            title: 'Historic Districts',
                            activities: 'Île de la Cité, Sainte-Chapelle, Latin Quarter'
                        },
                        {
                            title: 'Montmartre & Pigalle',
                            activities: 'Sacré-Cœur, artist studios, Moulin Rouge area'
                        },
                        {
                            title: 'Marais District',
                            activities: 'Jewish quarter, vintage shops, Place des Vosges'
                        },
                        {
                            title: 'Day Trip',
                            activities: 'Versailles Palace and Gardens'
                        },
                        {
                            title: 'Shopping & Relaxation',
                            activities: 'Champs-Élysées, Luxembourg Gardens, café culture'
                        }
                    ]
                }
            ],
            tips: {
                budget: [
                    'Many museums are free on first Sunday mornings',
                    'Picnic in parks with fresh market ingredients',
                    'Use the efficient metro system instead of taxis',
                    'Happy hour at wine bars (5-7 PM) for cheaper drinks'
                ],
                cultural: [
                    'Greet shopkeepers with "Bonjour" when entering stores',
                    'Dinner is typically served after 7:30 PM',
                    'Tipping 5-10% is appreciated but not mandatory',
                    'Dress elegantly - Parisians value style and presentation'
                ]
            }
        }
    },
    japan: {
        tokyo: {
            id: 'tokyo-japan',
            name: 'Tokyo',
            country: 'Japan',
            countryCode: 'japan',
            cityCode: 'tokyo',
            airportCode: 'NRT',
            tagline: 'Where ancient traditions meet cutting-edge innovation',
            description: 'Tokyo is a mesmerizing metropolis that seamlessly blends ultra-modern technology with deep-rooted traditions. From the bustling streets of Shibuya to the serene temples of Asakusa, this dynamic city offers endless discoveries. Experience world-class cuisine, innovative architecture, and the unique Japanese culture that makes Tokyo one of the world\'s most fascinating destinations.',
            heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=800&fit=crop',
            bestTime: 'March-May, September-November',
            climate: 'Humid subtropical',
            currency: 'Japanese Yen (JPY)',
            language: 'Japanese',
            avgFlightPrice: '$850',
            coordinates: {
                lat: 35.6762,
                lng: 139.6503
            },
            attractions: [
                {
                    name: 'Shibuya Crossing',
                    description: 'The world\'s busiest pedestrian crossing, epitomizing Tokyo\'s energy.',
                    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop',
                    category: 'landmark'
                },
                {
                    name: 'Senso-ji Temple',
                    description: 'Tokyo\'s oldest temple in historic Asakusa district.',
                    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
                    category: 'religious'
                },
                {
                    name: 'Tokyo Skytree',
                    description: 'World\'s second-tallest structure with panoramic city views.',
                    image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
                    category: 'landmark'
                },
                {
                    name: 'Tsukiji Outer Market',
                    description: 'Famous fish market area with incredible street food and sushi.',
                    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
                    category: 'market'
                }
            ],
            itineraries: [
                {
                    duration: '5 Days',
                    title: 'Tokyo Essentials',
                    days: [
                        {
                            title: 'Modern Tokyo',
                            activities: 'Shibuya Crossing, Harajuku, Omotesando, Tokyo Skytree'
                        },
                        {
                            title: 'Traditional Tokyo',
                            activities: 'Asakusa, Senso-ji Temple, traditional crafts, rickshaw ride'
                        },
                        {
                            title: 'Food & Markets',
                            activities: 'Tsukiji Outer Market, sushi breakfast, ramen tour, izakaya dinner'
                        },
                        {
                            title: 'Culture & Gardens',
                            activities: 'Imperial Palace East Gardens, Meiji Shrine, tea ceremony'
                        },
                        {
                            title: 'Neighborhoods',
                            activities: 'Ginza shopping, Akihabara electronics, Shinjuku nightlife'
                        }
                    ]
                }
            ],
            tips: {
                budget: [
                    'Convenience store meals are cheap and high quality',
                    'Many temples and shrines are free to visit',
                    'Use JR Pass for unlimited train travel',
                    'Department store basement food courts offer great deals'
                ],
                cultural: [
                    'Bow slightly when greeting people',
                    'Remove shoes when entering homes and some restaurants',
                    'Don\'t eat or drink while walking',
                    'Be quiet on public transportation'
                ]
            }
        }
    },
    usa: {
        'new-york': {
            id: 'new-york-usa',
            name: 'New York City',
            country: 'United States',
            countryCode: 'usa',
            cityCode: 'new-york',
            airportCode: 'JFK',
            tagline: 'The city that never sleeps, where dreams come alive',
            description: 'New York City is the ultimate urban playground, a melting pot of cultures, cuisines, and experiences. From the bright lights of Times Square to the tranquil paths of Central Park, from world-class Broadway shows to cutting-edge art galleries, NYC offers something for everyone. This iconic metropolis continues to inspire and amaze visitors from around the globe.',
            heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=800&fit=crop',
            bestTime: 'April-June, September-November',
            climate: 'Humid continental',
            currency: 'US Dollar (USD)',
            language: 'English',
            avgFlightPrice: '$450',
            coordinates: {
                lat: 40.7128,
                lng: -74.0060
            },
            attractions: [
                {
                    name: 'Statue of Liberty',
                    description: 'Iconic symbol of freedom and democracy on Liberty Island.',
                    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop',
                    category: 'landmark'
                },
                {
                    name: 'Central Park',
                    description: 'Massive urban oasis in the heart of Manhattan.',
                    image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=300&fit=crop',
                    category: 'park'
                },
                {
                    name: 'Times Square',
                    description: 'The dazzling crossroads of the world with bright billboards.',
                    image: 'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?w=400&h=300&fit=crop',
                    category: 'landmark'
                },
                {
                    name: 'Brooklyn Bridge',
                    description: 'Historic suspension bridge with stunning city views.',
                    image: 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=400&h=300&fit=crop',
                    category: 'landmark'
                }
            ],
            itineraries: [
                {
                    duration: '4 Days',
                    title: 'NYC First Timer',
                    days: [
                        {
                            title: 'Manhattan Icons',
                            activities: 'Times Square, Broadway show, Empire State Building, Central Park'
                        },
                        {
                            title: 'Liberty & Downtown',
                            activities: 'Statue of Liberty, Ellis Island, 9/11 Memorial, Wall Street'
                        },
                        {
                            title: 'Culture & Museums',
                            activities: 'Metropolitan Museum, MoMA, High Line, Chelsea Market'
                        },
                        {
                            title: 'Brooklyn & Views',
                            activities: 'Brooklyn Bridge walk, DUMBO, Top of the Rock observation deck'
                        }
                    ]
                }
            ],
            tips: {
                budget: [
                    'Many museums have "pay-what-you-wish" hours',
                    'Food trucks and delis offer affordable meals',
                    'Walk or use subway instead of taxis',
                    'Free events in parks and public spaces year-round'
                ],
                cultural: [
                    'Walk fast and stay to the right on sidewalks',
                    'Tipping 18-20% is standard at restaurants',
                    'Don\'t block subway doors or stairs',
                    'New Yorkers are helpful despite seeming rushed'
                ]
            }
        }
    },
    uk: {
        london: {
            id: 'london-uk',
            name: 'London',
            country: 'United Kingdom',
            countryCode: 'uk',
            cityCode: 'london',
            airportCode: 'LHR',
            tagline: 'Where royal heritage meets modern innovation',
            description: 'London is a captivating blend of historic grandeur and contemporary dynamism. From the majestic Buckingham Palace to the modern London Eye, from world-class museums to vibrant markets, this cosmopolitan capital offers an unparalleled cultural experience. Explore royal palaces, enjoy traditional afternoon tea, and discover why London remains one of the world\'s most visited cities.',
            heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=800&fit=crop',
            bestTime: 'May-September',
            climate: 'Temperate oceanic',
            currency: 'British Pound (GBP)',
            language: 'English',
            avgFlightPrice: '$550',
            coordinates: {
                lat: 51.5074,
                lng: -0.1278
            },
            attractions: [
                {
                    name: 'Big Ben & Parliament',
                    description: 'Iconic clock tower and the heart of British democracy.',
                    image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&h=300&fit=crop',
                    category: 'landmark'
                },
                {
                    name: 'British Museum',
                    description: 'World-renowned museum with artifacts from across the globe.',
                    image: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop',
                    category: 'museum'
                },
                {
                    name: 'Tower Bridge',
                    description: 'Victorian Gothic bridge with glass floor walkways.',
                    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
                    category: 'landmark'
                },
                {
                    name: 'Buckingham Palace',
                    description: 'Official residence of the British monarch.',
                    image: 'https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400&h=300&fit=crop',
                    category: 'palace'
                }
            ],
            itineraries: [
                {
                    duration: '4 Days',
                    title: 'London Classics',
                    days: [
                        {
                            title: 'Royal London',
                            activities: 'Buckingham Palace, Westminster Abbey, Big Ben, Parliament tour'
                        },
                        {
                            title: 'Museums & Culture',
                            activities: 'British Museum, Tate Modern, Shakespeare\'s Globe, Thames walk'
                        },
                        {
                            title: 'Markets & Neighborhoods',
                            activities: 'Borough Market, Covent Garden, Notting Hill, Camden Market'
                        },
                        {
                            title: 'Modern London',
                            activities: 'London Eye, Tower Bridge, Shard, East London street art'
                        }
                    ]
                }
            ],
            tips: {
                budget: [
                    'Many museums offer free admission',
                    'Pub lunches are often cheaper than restaurants',
                    'Use an Oyster Card for public transport discounts',
                    'Free walking tours available in most areas'
                ],
                cultural: [
                    'Queue politely and wait your turn',
                    'Stand right on escalators, walk left',
                    'Pub etiquette: order at the bar, no table service',
                    'Tipping 10-15% is appreciated but not mandatory'
                ]
            }
        }
    },
    italy: {
        rome: {
            id: 'rome-italy',
            name: 'Rome',
            country: 'Italy',
            countryCode: 'italy',
            cityCode: 'rome',
            airportCode: 'FCO',
            tagline: 'The Eternal City where history comes alive',
            description: 'Rome is a living museum where ancient history meets vibrant modern life. Walk through millennia of civilization as you explore the Colosseum, Vatican City, and countless piazzas. Every street corner tells a story, every fountain has a legend, and every meal is a celebration of Italian culture.',
            heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=800&fit=crop',
            bestTime: 'April-June, September-October',
            climate: 'Mediterranean',
            currency: 'Euro (EUR)',
            language: 'Italian',
            avgFlightPrice: '$580',
            coordinates: { lat: 41.9028, lng: 12.4964 },
            attractions: [
                { name: 'Colosseum', description: 'Ancient amphitheater and symbol of Imperial Rome.', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop&auto=format&q=80', category: 'landmark' },
                { name: 'Vatican City', description: 'Spiritual center with Sistine Chapel and St. Peter\'s Basilica.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=80', category: 'religious' },
                { name: 'Trevi Fountain', description: 'Baroque fountain where wishes come true.', image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop&auto=format&q=80', category: 'landmark' },
                { name: 'Roman Forum', description: 'Heart of ancient Roman civilization.', image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400&h=300&fit=crop&auto=format&q=80', category: 'historical' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Rome Classics', days: [
                        { title: 'Ancient Rome', activities: 'Colosseum, Roman Forum, Palatine Hill, Pantheon' },
                        { title: 'Vatican City', activities: 'St. Peter\'s Basilica, Sistine Chapel, Vatican Museums' },
                        { title: 'Baroque Rome', activities: 'Trevi Fountain, Spanish Steps, Piazza Navona, Campo de\' Fiori' },
                        { title: 'Trastevere & Food', activities: 'Trastevere neighborhood, food tour, sunset at Gianicolo Hill' }
                    ]
                }
            ],
            tips: {
                budget: ['Book skip-the-line tickets in advance', 'Eat at local trattorias away from tourist sites', 'Use Roma Pass for public transport and museums', 'Aperitivo hour offers great value'],
                cultural: ['Dress modestly when visiting churches', 'Lunch is typically 1-3 PM, dinner after 8 PM', 'Greet with "Buongiorno" or "Buonasera"', 'Tipping 10% is appreciated but not required']
            }
        }
    },
    spain: {
        barcelona: {
            id: 'barcelona-spain',
            name: 'Barcelona',
            country: 'Spain',
            countryCode: 'spain',
            cityCode: 'barcelona',
            airportCode: 'BCN',
            tagline: 'Where Gaudí\'s dreams meet Mediterranean charm',
            description: 'Barcelona captivates with its unique blend of Gothic and modernist architecture, vibrant street life, and Mediterranean beaches. From the whimsical Sagrada Familia to the bustling Las Ramblas, this Catalan capital offers artistic inspiration, culinary delights, and a laid-back coastal lifestyle.',
            heroImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=800&fit=crop',
            bestTime: 'May-June, September-October',
            climate: 'Mediterranean',
            currency: 'Euro (EUR)',
            language: 'Spanish, Catalan',
            avgFlightPrice: '$520',
            coordinates: { lat: 41.3851, lng: 2.1734 },
            attractions: [
                { name: 'Sagrada Familia', description: 'Gaudí\'s unfinished masterpiece and Barcelona\'s icon.', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop&auto=format&q=80', category: 'landmark' },
                { name: 'Park Güell', description: 'Whimsical park with colorful mosaics and city views.', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop&auto=format&q=80', category: 'park' },
                { name: 'Las Ramblas', description: 'Famous pedestrian street with street performers and cafés.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop&auto=format&q=80', category: 'street' },
                { name: 'Gothic Quarter', description: 'Medieval neighborhood with narrow streets and historic buildings.', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop&auto=format&q=80', category: 'neighborhood' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Barcelona Highlights', days: [
                        { title: 'Gaudí\'s Barcelona', activities: 'Sagrada Familia, Park Güell, Casa Batlló, Casa Milà' },
                        { title: 'Gothic & Born', activities: 'Gothic Quarter, Picasso Museum, El Born district, Santa Maria del Mar' },
                        { title: 'Beach & Barceloneta', activities: 'Barceloneta Beach, seafood lunch, Port Vell, cable car' },
                        { title: 'Montjuïc Hill', activities: 'Magic Fountain, Montjuïc Castle, Olympic Stadium, city views' }
                    ]
                }
            ],
            tips: {
                budget: ['Many museums are free on Sunday afternoons', 'Tapas crawls are cheaper than full meals', 'Use T-10 transport card for metro savings', 'Beach picnics with market food'],
                cultural: ['Siesta time is 2-5 PM, shops may close', 'Dinner is very late, often after 9 PM', 'Learn basic Catalan phrases - locals appreciate it', 'Pickpockets are common in tourist areas, stay alert']
            }
        }
    },
    thailand: {
        bangkok: {
            id: 'bangkok-thailand',
            name: 'Bangkok',
            country: 'Thailand',
            countryCode: 'thailand',
            cityCode: 'bangkok',
            airportCode: 'BKK',
            tagline: 'The vibrant heart of Southeast Asia',
            description: 'Bangkok is a sensory explosion of golden temples, floating markets, street food aromas, and bustling tuk-tuks. This dynamic metropolis seamlessly blends ancient traditions with modern energy, offering everything from serene Buddhist temples to rooftop bars with stunning skyline views.',
            heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
            bestTime: 'November-March',
            climate: 'Tropical',
            currency: 'Thai Baht (THB)',
            language: 'Thai',
            avgFlightPrice: '$780',
            coordinates: { lat: 13.7563, lng: 100.5018 },
            attractions: [
                { name: 'Grand Palace', description: 'Opulent royal complex with stunning Thai architecture.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'palace' },
                { name: 'Wat Pho Temple', description: 'Temple of the Reclining Buddha and traditional massage school.', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', category: 'religious' },
                { name: 'Chatuchak Market', description: 'Massive weekend market with everything imaginable.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'market' },
                { name: 'Khao San Road', description: 'Backpacker hub with street food and nightlife.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', category: 'street' }
            ],
            itineraries: [
                {
                    duration: '5 Days', title: 'Bangkok Explorer', days: [
                        { title: 'Royal Bangkok', activities: 'Grand Palace, Wat Pho, Wat Arun, Chao Phraya River cruise' },
                        { title: 'Markets & Food', activities: 'Chatuchak Market, street food tour, cooking class' },
                        { title: 'Modern Bangkok', activities: 'Skytrain tour, shopping malls, rooftop bars, Lumphini Park' },
                        { title: 'Floating Markets', activities: 'Damnoen Saduak floating market, Amphawa evening market' },
                        { title: 'Culture & Relaxation', activities: 'Jim Thompson House, Thai massage, Khao San Road nightlife' }
                    ]
                }
            ],
            tips: {
                budget: ['Street food is incredibly cheap and delicious', 'Use BTS Skytrain and MRT for efficient transport', 'Bargain at markets but not in malls', 'Temple visits are usually free or very cheap'],
                cultural: ['Remove shoes before entering temples and homes', 'Dress modestly when visiting temples', 'Don\'t point feet toward Buddha statues', 'Wai greeting (hands together, slight bow) shows respect']
            }
        }
    },
    australia: {
        sydney: {
            id: 'sydney-australia',
            name: 'Sydney',
            country: 'Australia',
            countryCode: 'australia',
            cityCode: 'sydney',
            airportCode: 'SYD',
            tagline: 'Harbor city where urban sophistication meets natural beauty',
            description: 'Sydney dazzles with its iconic harbor, world-famous Opera House, and stunning beaches. This cosmopolitan city offers the perfect blend of urban sophistication and outdoor adventure, from harbor cruises and beach culture to world-class dining and vibrant nightlife.',
            heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
            bestTime: 'September-November, March-May',
            climate: 'Temperate oceanic',
            currency: 'Australian Dollar (AUD)',
            language: 'English',
            avgFlightPrice: '$1,200',
            coordinates: { lat: -33.8688, lng: 151.2093 },
            attractions: [
                { name: 'Sydney Opera House', description: 'Iconic architectural masterpiece and cultural hub.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Sydney Harbour Bridge', description: 'Steel arch bridge offering spectacular harbor views.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Bondi Beach', description: 'World-famous beach with golden sand and surf culture.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'beach' },
                { name: 'The Rocks', description: 'Historic area with cobblestone streets and weekend markets.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'neighborhood' }
            ],
            itineraries: [
                {
                    duration: '5 Days', title: 'Sydney Highlights', days: [
                        { title: 'Harbor Icons', activities: 'Opera House tour, Harbour Bridge climb, Circular Quay, ferry rides' },
                        { title: 'Beach Culture', activities: 'Bondi Beach, Coogee Beach, coastal walk, surf lesson' },
                        { title: 'City & Culture', activities: 'Royal Botanic Gardens, Art Gallery of NSW, The Rocks markets' },
                        { title: 'Blue Mountains', activities: 'Day trip to Blue Mountains, Three Sisters, scenic railway' },
                        { title: 'Food & Nightlife', activities: 'Darling Harbour, Chinatown, rooftop bars, harbor dinner cruise' }
                    ]
                }
            ],
            tips: {
                budget: ['Many beaches and parks are free to enjoy', 'Happy hour specials at pubs 4-6 PM', 'Use Opal Card for public transport discounts', 'BYO restaurants save on alcohol costs'],
                cultural: ['Tipping is not mandatory but 10% is appreciated', 'Sun protection is essential year-round', 'Swim between the flags at beaches', 'Australians are generally informal and friendly']
            }
        }
    },
    brazil: {
        'rio-de-janeiro': {
            id: 'rio-brazil',
            name: 'Rio de Janeiro',
            country: 'Brazil',
            countryCode: 'brazil',
            cityCode: 'rio-de-janeiro',
            airportCode: 'GIG',
            tagline: 'The Marvelous City of beaches, mountains, and carnival spirit',
            description: 'Rio de Janeiro captivates with its stunning natural setting, vibrant culture, and infectious energy. From the iconic Christ the Redeemer statue atop Corcovado to the famous beaches of Copacabana and Ipanema, Rio offers an intoxicating blend of natural beauty, music, dance, and joie de vivre.',
            heroImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&h=800&fit=crop',
            bestTime: 'December-March, May-October',
            climate: 'Tropical',
            currency: 'Brazilian Real (BRL)',
            language: 'Portuguese',
            avgFlightPrice: '$680',
            coordinates: { lat: -22.9068, lng: -43.1729 },
            attractions: [
                { name: 'Christ the Redeemer', description: 'Iconic statue overlooking the city from Corcovado Mountain.', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Copacabana Beach', description: 'World-famous beach with vibrant beach culture.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'beach' },
                { name: 'Sugarloaf Mountain', description: 'Granite peak with cable car and panoramic views.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Santa Teresa', description: 'Bohemian neighborhood with colonial architecture and art studios.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'neighborhood' }
            ],
            itineraries: [
                {
                    duration: '5 Days', title: 'Rio Essentials', days: [
                        { title: 'Iconic Rio', activities: 'Christ the Redeemer, Corcovado train, Tijuca Forest' },
                        { title: 'Beach Culture', activities: 'Copacabana, Ipanema, beach volleyball, caipirinha sunset' },
                        { title: 'Sugarloaf & Views', activities: 'Sugarloaf cable car, Urca neighborhood, harbor views' },
                        { title: 'Culture & Music', activities: 'Santa Teresa, Selarón Steps, samba show, lapa nightlife' },
                        { title: 'Local Life', activities: 'Feira de São Cristóvão market, favela tour, Brazilian BBQ' }
                    ]
                }
            ],
            tips: {
                budget: ['Beach activities are mostly free', 'Local buses are very cheap', 'Eat at botequims for authentic, affordable meals', 'Happy hour caipirinhas are cheaper'],
                cultural: ['Learn basic Portuguese phrases', 'Brazilians are warm and physical in greetings', 'Beach attire is acceptable in most casual settings', 'Safety awareness is important, especially at night']
            }
        }
    },
    germany: {
        berlin: {
            id: 'berlin-germany',
            name: 'Berlin',
            country: 'Germany',
            countryCode: 'germany',
            cityCode: 'berlin',
            airportCode: 'BER',
            tagline: 'Where history meets cutting-edge culture',
            description: 'Berlin is a city of contrasts where remnants of the Cold War coexist with vibrant street art, world-class museums, and an legendary nightlife scene. This dynamic capital offers profound historical experiences alongside cutting-edge culture, making it one of Europe\'s most fascinating destinations.',
            heroImage: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&h=800&fit=crop',
            bestTime: 'May-September',
            climate: 'Temperate continental',
            currency: 'Euro (EUR)',
            language: 'German',
            avgFlightPrice: '$480',
            coordinates: { lat: 52.5200, lng: 13.4050 },
            attractions: [
                { name: 'Brandenburg Gate', description: 'Iconic neoclassical monument and symbol of German reunification.', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Berlin Wall Memorial', description: 'Preserved section of the wall with historical documentation.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'historical' },
                { name: 'Museum Island', description: 'UNESCO World Heritage site with five world-class museums.', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop', category: 'museum' },
                { name: 'East Side Gallery', description: 'Longest remaining section of Berlin Wall covered in murals.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'art' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Berlin History & Culture', days: [
                        { title: 'Historical Berlin', activities: 'Brandenburg Gate, Holocaust Memorial, Reichstag, Unter den Linden' },
                        { title: 'Cold War Sites', activities: 'Berlin Wall Memorial, Checkpoint Charlie, East Side Gallery' },
                        { title: 'Museums & Culture', activities: 'Museum Island, Pergamon Museum, Berlin Cathedral' },
                        { title: 'Modern Berlin', activities: 'Kreuzberg district, street art tour, beer gardens, nightlife' }
                    ]
                }
            ],
            tips: {
                budget: ['Many museums offer discounted evening hours', 'Currywurst and döner are cheap, filling meals', 'Use day passes for public transport', 'Free walking tours available daily'],
                cultural: ['Germans value punctuality and directness', 'Quiet hours (Ruhezeit) are typically 10 PM - 6 AM', 'Recycling is taken very seriously', 'Cash is still preferred in many places']
            }
        }
    },
    netherlands: {
        amsterdam: {
            id: 'amsterdam-netherlands',
            name: 'Amsterdam',
            country: 'Netherlands',
            countryCode: 'netherlands',
            cityCode: 'amsterdam',
            airportCode: 'AMS',
            tagline: 'Venice of the North with canals, culture, and charm',
            description: 'Amsterdam enchants with its picturesque canals, historic architecture, world-class museums, and liberal atmosphere. This compact city is perfect for exploring by bike, offering everything from the artistic treasures of the Rijksmuseum to the vibrant nightlife of the Red Light District.',
            heroImage: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&h=800&fit=crop',
            bestTime: 'April-May, September-November',
            climate: 'Temperate oceanic',
            currency: 'Euro (EUR)',
            language: 'Dutch',
            avgFlightPrice: '$520',
            coordinates: { lat: 52.3676, lng: 4.9041 },
            attractions: [
                { name: 'Anne Frank House', description: 'Moving museum in the secret annex where Anne Frank hid.', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop', category: 'museum' },
                { name: 'Rijksmuseum', description: 'National museum with Dutch Golden Age masterpieces.', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop', category: 'museum' },
                { name: 'Canal Ring', description: 'UNESCO World Heritage canals perfect for boat tours.', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Vondelpark', description: 'Large urban park perfect for picnics and people-watching.', image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=300&fit=crop', category: 'park' }
            ],
            itineraries: [
                {
                    duration: '3 Days', title: 'Amsterdam Highlights', days: [
                        { title: 'Museums & Culture', activities: 'Rijksmuseum, Van Gogh Museum, Museumplein, Vondelpark' },
                        { title: 'Canals & History', activities: 'Canal cruise, Anne Frank House, Jordaan district, local brown cafés' },
                        { title: 'Local Life', activities: 'Bike tour, Albert Cuyp Market, Red Light District, coffee shops' }
                    ]
                }
            ],
            tips: {
                budget: ['Museumkaart offers great value for multiple museums', 'Lunch at local cafés is cheaper than dinner', 'Rent a bike - it\'s the cheapest way to get around', 'Happy hour at brown cafés 5-7 PM'],
                cultural: ['Cycling is the primary mode of transport', 'Dutch people are direct but not rude', 'Tipping 10% is standard in restaurants', 'Book Anne Frank House tickets well in advance']
            }
        }
    },
    singapore: {
        singapore: {
            id: 'singapore-singapore',
            name: 'Singapore',
            country: 'Singapore',
            countryCode: 'singapore',
            cityCode: 'singapore',
            airportCode: 'SIN',
            tagline: 'The Lion City where East meets West',
            description: 'Singapore is a gleaming modern city-state that seamlessly blends diverse cultures, cutting-edge architecture, and incredible cuisine. From the futuristic Gardens by the Bay to the historic streets of Chinatown, this compact nation offers world-class attractions in a uniquely multicultural setting.',
            heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=800&fit=crop',
            bestTime: 'February-April',
            climate: 'Tropical',
            currency: 'Singapore Dollar (SGD)',
            language: 'English, Mandarin, Malay, Tamil',
            avgFlightPrice: '$920',
            coordinates: { lat: 1.3521, lng: 103.8198 },
            attractions: [
                { name: 'Gardens by the Bay', description: 'Futuristic park with iconic Supertree structures.', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop', category: 'park' },
                { name: 'Marina Bay Sands', description: 'Iconic hotel with infinity pool and city views.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Chinatown', description: 'Historic district with temples, markets, and street food.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'neighborhood' },
                { name: 'Sentosa Island', description: 'Resort island with beaches, attractions, and entertainment.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'island' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Singapore Explorer', days: [
                        { title: 'Modern Singapore', activities: 'Marina Bay Sands, Gardens by the Bay, Singapore Flyer, light show' },
                        { title: 'Cultural Districts', activities: 'Chinatown, Little India, Arab Street, temple visits' },
                        { title: 'Sentosa Island', activities: 'Universal Studios, beaches, cable car, evening shows' },
                        { title: 'Food & Shopping', activities: 'Hawker centers, Orchard Road, Clarke Quay nightlife' }
                    ]
                }
            ],
            tips: {
                budget: ['Hawker centers offer cheap, delicious meals', 'Many attractions offer combo tickets', 'Public transport is efficient and affordable', 'Free WiFi available throughout the city'],
                cultural: ['Singapore is very multicultural and English-friendly', 'Strict laws - no chewing gum, jaywalking fines', 'Tipping is not expected but appreciated', 'Dress modestly when visiting religious sites']
            }
        }
    },
    canada: {
        vancouver: {
            id: 'vancouver-canada',
            name: 'Vancouver',
            country: 'Canada',
            countryCode: 'canada',
            cityCode: 'vancouver',
            airportCode: 'YVR',
            tagline: 'Where mountains meet the ocean in perfect harmony',
            description: 'Vancouver offers the rare combination of urban sophistication and stunning natural beauty. Nestled between mountains and ocean, this cosmopolitan city provides world-class dining, outdoor adventures, and cultural diversity, all set against one of the world\'s most spectacular backdrops.',
            heroImage: 'https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?w=1200&h=800&fit=crop',
            bestTime: 'June-August, September-October',
            climate: 'Temperate oceanic',
            currency: 'Canadian Dollar (CAD)',
            language: 'English, French',
            avgFlightPrice: '$420',
            coordinates: { lat: 49.2827, lng: -123.1207 },
            attractions: [
                { name: 'Stanley Park', description: 'Massive urban park with seawall, beaches, and totem poles.', image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=300&fit=crop', category: 'park' },
                { name: 'Granville Island', description: 'Vibrant market and arts district on False Creek.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'market' },
                { name: 'Capilano Suspension Bridge', description: 'Thrilling bridge walk through temperate rainforest.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'attraction' },
                { name: 'Gastown', description: 'Historic district with cobblestone streets and steam clock.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'neighborhood' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Vancouver Nature & City', days: [
                        { title: 'Stanley Park & Downtown', activities: 'Stanley Park seawall, English Bay, downtown exploration' },
                        { title: 'Granville Island & Kitsilano', activities: 'Public Market, Kitsilano Beach, local breweries' },
                        { title: 'North Shore Adventures', activities: 'Capilano Bridge, Grouse Mountain, Lynn Canyon' },
                        { title: 'Gastown & Culture', activities: 'Historic Gastown, Chinatown, Museum of Anthropology' }
                    ]
                }
            ],
            tips: {
                budget: ['Many parks and beaches are free to enjoy', 'Happy hour specials at restaurants 3-6 PM', 'Public transport day passes offer good value', 'Hiking trails provide free entertainment'],
                cultural: ['Canadians are polite and say "sorry" frequently', 'Tipping 15-20% is standard', 'Outdoor activities are popular year-round', 'Multiculturalism is celebrated and visible everywhere']
            }
        }
    },
    india: {
        mumbai: {
            id: 'mumbai-india',
            name: 'Mumbai',
            country: 'India',
            countryCode: 'india',
            cityCode: 'mumbai',
            airportCode: 'BOM',
            tagline: 'The City of Dreams where Bollywood magic comes alive',
            description: 'Mumbai is India\'s financial capital and entertainment hub, a city of incredible contrasts where gleaming skyscrapers stand alongside bustling slums. From the colonial architecture of South Mumbai to the film studios of Bollywood, this vibrant metropolis pulses with ambition, creativity, and endless energy.',
            heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&h=800&fit=crop',
            bestTime: 'November-February',
            climate: 'Tropical',
            currency: 'Indian Rupee (INR)',
            language: 'Hindi, Marathi, English',
            avgFlightPrice: '$720',
            coordinates: { lat: 19.0760, lng: 72.8777 },
            attractions: [
                { name: 'Gateway of India', description: 'Iconic arch monument overlooking Mumbai Harbor.', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Marine Drive', description: 'Curved waterfront promenade known as the Queen\'s Necklace.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'waterfront' },
                { name: 'Dharavi Slum', description: 'Asia\'s largest slum, offering insight into Mumbai\'s contrasts.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'neighborhood' },
                { name: 'Bollywood Studios', description: 'Film City where Bollywood movies are made.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', category: 'entertainment' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Mumbai Highlights', days: [
                        { title: 'South Mumbai', activities: 'Gateway of India, Taj Hotel, Colaba Causeway, Marine Drive' },
                        { title: 'Bollywood & Culture', activities: 'Film City tour, Crawford Market, Chhatrapati Shivaji Terminus' },
                        { title: 'Local Life', activities: 'Dharavi tour, local train experience, street food tour' },
                        { title: 'Elephanta Caves', activities: 'Ferry to Elephanta Island, ancient cave temples, sunset at Juhu Beach' }
                    ]
                }
            ],
            tips: {
                budget: ['Street food is incredibly cheap and delicious', 'Local trains are the cheapest transport', 'Bargain at markets and with auto-rickshaws', 'Many temples and beaches are free to visit'],
                cultural: ['Dress modestly, especially when visiting religious sites', 'Use your right hand for eating and greeting', 'Monsoon season (June-September) brings heavy rains', 'Traffic is chaotic - be patient and alert']
            }
        }
    },
    egypt: {
        cairo: {
            id: 'cairo-egypt',
            name: 'Cairo',
            country: 'Egypt',
            countryCode: 'egypt',
            cityCode: 'cairo',
            airportCode: 'CAI',
            tagline: 'The Mother of the World where ancient wonders meet modern life',
            description: 'Cairo is a mesmerizing blend of ancient history and vibrant modern culture. Home to the last surviving Wonder of the Ancient World, the Great Pyramid of Giza, this sprawling metropolis offers incredible archaeological treasures, bustling bazaars, and the timeless flow of the Nile River.',
            heroImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&h=800&fit=crop',
            bestTime: 'October-April',
            climate: 'Hot desert',
            currency: 'Egyptian Pound (EGP)',
            language: 'Arabic',
            avgFlightPrice: '$620',
            coordinates: { lat: 30.0444, lng: 31.2357 },
            attractions: [
                { name: 'Pyramids of Giza', description: 'Last surviving Wonder of the Ancient World.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Egyptian Museum', description: 'World\'s most extensive collection of ancient Egyptian artifacts.', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop', category: 'museum' },
                { name: 'Khan el-Khalili Bazaar', description: 'Historic market with traditional crafts and spices.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'market' },
                { name: 'Islamic Cairo', description: 'Medieval Islamic architecture and historic mosques.', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', category: 'historical' }
            ],
            itineraries: [
                {
                    duration: '5 Days', title: 'Cairo Ancient & Modern', days: [
                        { title: 'Giza Pyramids', activities: 'Great Pyramid, Sphinx, Solar Boat Museum, camel ride' },
                        { title: 'Egyptian Museum', activities: 'Tutankhamun treasures, mummy room, Tahrir Square' },
                        { title: 'Islamic Cairo', activities: 'Citadel of Saladin, Mohammed Ali Mosque, Islamic architecture tour' },
                        { title: 'Khan el-Khalili', activities: 'Bazaar shopping, traditional coffee house, Al-Azhar Mosque' },
                        { title: 'Nile & Coptic Cairo', activities: 'Nile felucca ride, Coptic Quarter, Hanging Church' }
                    ]
                }
            ],
            tips: {
                budget: ['Bargain is expected at markets and for services', 'Local food is very affordable', 'Use metro and buses for cheap transport', 'Many mosques are free to visit'],
                cultural: ['Dress modestly, especially at religious sites', 'Friday is the holy day, some attractions may be closed', 'Tipping (baksheesh) is customary for services', 'Learn basic Arabic greetings - locals appreciate it']
            }
        }
    },
    south_africa: {
        'cape-town': {
            id: 'cape-town-south-africa',
            name: 'Cape Town',
            country: 'South Africa',
            countryCode: 'south-africa',
            cityCode: 'cape-town',
            airportCode: 'CPT',
            tagline: 'The Mother City where two oceans meet',
            description: 'Cape Town is one of the world\'s most beautiful cities, dramatically situated between Table Mountain and two oceans. This vibrant city offers stunning natural beauty, world-class wine regions, rich history, and a unique blend of African, European, and Asian cultures.',
            heroImage: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&h=800&fit=crop',
            bestTime: 'November-March',
            climate: 'Mediterranean',
            currency: 'South African Rand (ZAR)',
            language: 'English, Afrikaans, Xhosa',
            avgFlightPrice: '$890',
            coordinates: { lat: -33.9249, lng: 18.4241 },
            attractions: [
                { name: 'Table Mountain', description: 'Iconic flat-topped mountain with cable car access.', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'V&A Waterfront', description: 'Historic harbor with shopping, dining, and entertainment.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'waterfront' },
                { name: 'Robben Island', description: 'Historic prison island where Nelson Mandela was held.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'historical' },
                { name: 'Cape Winelands', description: 'World-renowned wine region with stunning scenery.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'nature' }
            ],
            itineraries: [
                {
                    duration: '5 Days', title: 'Cape Town Highlights', days: [
                        { title: 'Table Mountain & City', activities: 'Table Mountain cable car, city center, Company\'s Garden' },
                        { title: 'Robben Island & Waterfront', activities: 'Robben Island tour, V&A Waterfront, Two Oceans Aquarium' },
                        { title: 'Cape Peninsula', activities: 'Cape Point, Boulders Beach penguins, Chapman\'s Peak Drive' },
                        { title: 'Winelands', activities: 'Stellenbosch wine tasting, Franschhoek, scenic drives' },
                        { title: 'Culture & Townships', activities: 'District Six Museum, township tour, local markets' }
                    ]
                }
            ],
            tips: {
                budget: ['Wine tastings are very affordable', 'Use MyCiTi bus for safe, cheap transport', 'Many beaches and hiking trails are free', 'Restaurant portions are large - consider sharing'],
                cultural: ['South Africa has 11 official languages', 'Tipping 10-15% is standard', 'Be aware of safety, especially after dark', 'The currency offers great value for international visitors']
            }
        }
    },
    mexico: {
        'mexico-city': {
            id: 'mexico-city-mexico',
            name: 'Mexico City',
            country: 'Mexico',
            countryCode: 'mexico',
            cityCode: 'mexico-city',
            airportCode: 'MEX',
            tagline: 'The vibrant heart of Mexico where ancient meets modern',
            description: 'Mexico City is a sprawling metropolis that seamlessly blends pre-Columbian history, colonial architecture, and contemporary culture. From world-class museums and ancient Aztec ruins to incredible street food and vibrant neighborhoods, this dynamic capital offers an authentic and unforgettable Mexican experience.',
            heroImage: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200&h=800&fit=crop',
            bestTime: 'March-May, September-November',
            climate: 'Subtropical highland',
            currency: 'Mexican Peso (MXN)',
            language: 'Spanish',
            avgFlightPrice: '$380',
            coordinates: { lat: 19.4326, lng: -99.1332 },
            attractions: [
                { name: 'Zócalo', description: 'Main square surrounded by historic buildings and cathedral.', image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Frida Kahlo Museum', description: 'Blue House where the famous artist lived and worked.', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop', category: 'museum' },
                { name: 'Teotihuacán', description: 'Ancient Mesoamerican city with impressive pyramids.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'historical' },
                { name: 'Xochimilco', description: 'Floating gardens with colorful trajinera boats.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'attraction' }
            ],
            itineraries: [
                {
                    duration: '5 Days', title: 'Mexico City Explorer', days: [
                        { title: 'Historic Center', activities: 'Zócalo, Metropolitan Cathedral, National Palace, Templo Mayor' },
                        { title: 'Museums & Culture', activities: 'National Museum of Anthropology, Chapultepec Castle, Reforma Avenue' },
                        { title: 'Coyoacán & Frida', activities: 'Frida Kahlo Museum, Coyoacán market, Diego Rivera murals' },
                        { title: 'Teotihuacán Day Trip', activities: 'Pyramid of the Sun, Pyramid of the Moon, ancient city exploration' },
                        { title: 'Xochimilco & Local Life', activities: 'Trajinera boat ride, local markets, street food tour' }
                    ]
                }
            ],
            tips: {
                budget: ['Street food is delicious and very cheap', 'Metro system is extensive and affordable', 'Many museums are free on Sundays for locals', 'Mercados offer great value for meals and shopping'],
                cultural: ['Learn basic Spanish phrases - locals appreciate the effort', 'Mexicans are warm and family-oriented', 'Lunch is the main meal, often 2-4 PM', 'Altitude (7,350 ft) may affect some visitors initially']
            }
        }
    },
    greece: {
        athens: {
            id: 'athens-greece',
            name: 'Athens',
            country: 'Greece',
            countryCode: 'greece',
            cityCode: 'athens',
            airportCode: 'ATH',
            tagline: 'The cradle of Western civilization and democracy',
            description: 'Athens is where democracy was born and philosophy flourished. This ancient city offers incredible archaeological sites like the Acropolis, vibrant neighborhoods, delicious Mediterranean cuisine, and easy access to beautiful Greek islands.',
            heroImage: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&h=800&fit=crop',
            bestTime: 'April-June, September-October',
            climate: 'Mediterranean',
            currency: 'Euro (EUR)',
            language: 'Greek',
            avgFlightPrice: '$590',
            coordinates: { lat: 37.9838, lng: 23.7275 },
            attractions: [
                { name: 'Acropolis', description: 'Ancient citadel with the iconic Parthenon temple.', image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Ancient Agora', description: 'Heart of ancient Athens with well-preserved ruins.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'historical' },
                { name: 'Plaka District', description: 'Charming old town with traditional tavernas.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'neighborhood' },
                { name: 'National Archaeological Museum', description: 'World-class collection of ancient Greek artifacts.', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop', category: 'museum' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Athens Ancient & Modern', days: [
                        { title: 'Acropolis & Ancient Sites', activities: 'Acropolis, Parthenon, Acropolis Museum, Ancient Agora' },
                        { title: 'Museums & Culture', activities: 'National Archaeological Museum, Benaki Museum, National Gardens' },
                        { title: 'Neighborhoods', activities: 'Plaka district, Monastiraki flea market, traditional tavernas' },
                        { title: 'Day Trip', activities: 'Temple of Poseidon at Sounion, coastal drive, sunset views' }
                    ]
                }
            ],
            tips: {
                budget: ['Many archaeological sites offer combo tickets', 'Lunch menus are cheaper than dinner', 'Free museum days on certain Sundays', 'Street food like souvlaki is delicious and cheap'],
                cultural: ['Greeks are hospitable and love to talk', 'Afternoon siesta is common 2-5 PM', 'Tipping 10% is appreciated', 'Learn a few Greek phrases - locals love it']
            }
        }
    },
    turkey: {
        istanbul: {
            id: 'istanbul-turkey',
            name: 'Istanbul',
            country: 'Turkey',
            countryCode: 'turkey',
            cityCode: 'istanbul',
            airportCode: 'IST',
            tagline: 'Where Europe meets Asia in magnificent harmony',
            description: 'Istanbul is a mesmerizing city that straddles two continents, blending Byzantine and Ottoman heritage with modern Turkish culture. From the stunning Hagia Sophia to the bustling Grand Bazaar, this historic city offers incredible architecture, delicious cuisine, and warm hospitality.',
            heroImage: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&h=800&fit=crop',
            bestTime: 'April-May, September-November',
            climate: 'Temperate oceanic',
            currency: 'Turkish Lira (TRY)',
            language: 'Turkish',
            avgFlightPrice: '$650',
            coordinates: { lat: 41.0082, lng: 28.9784 },
            attractions: [
                { name: 'Hagia Sophia', description: 'Magnificent Byzantine cathedral turned mosque.', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop', category: 'religious' },
                { name: 'Blue Mosque', description: 'Stunning Ottoman mosque with six minarets.', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', category: 'religious' },
                { name: 'Grand Bazaar', description: 'Historic covered market with 4,000 shops.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'market' },
                { name: 'Bosphorus Strait', description: 'Waterway separating Europe and Asia.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'waterfront' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Istanbul Highlights', days: [
                        { title: 'Sultanahmet District', activities: 'Hagia Sophia, Blue Mosque, Topkapi Palace, Basilica Cistern' },
                        { title: 'Grand Bazaar & Spice Market', activities: 'Shopping, Turkish coffee, traditional crafts, local cuisine' },
                        { title: 'Bosphorus & Asian Side', activities: 'Bosphorus cruise, Üsküdar district, Maiden\'s Tower' },
                        { title: 'Modern Istanbul', activities: 'Galata Tower, Taksim Square, Turkish bath experience' }
                    ]
                }
            ],
            tips: {
                budget: ['Bargaining is expected at markets', 'Street food and local restaurants are very affordable', 'Public transport is cheap and efficient', 'Many mosques are free to visit'],
                cultural: ['Remove shoes when entering mosques', 'Dress modestly at religious sites', 'Turkish people are very hospitable', 'Learn basic Turkish greetings']
            }
        }
    },
    russia: {
        moscow: {
            id: 'moscow-russia',
            name: 'Moscow',
            country: 'Russia',
            countryCode: 'russia',
            cityCode: 'moscow',
            airportCode: 'SVO',
            tagline: 'The heart of Russia with iconic Red Square and Kremlin',
            description: 'Moscow is Russia\'s political and cultural capital, home to the iconic Red Square, magnificent Kremlin, and stunning Orthodox churches. This historic city offers world-class ballet, fascinating museums, and a unique glimpse into Russian culture and history.',
            heroImage: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&h=800&fit=crop',
            bestTime: 'May-September',
            climate: 'Humid continental',
            currency: 'Russian Ruble (RUB)',
            language: 'Russian',
            avgFlightPrice: '$720',
            coordinates: { lat: 55.7558, lng: 37.6176 },
            attractions: [
                { name: 'Red Square', description: 'Iconic square with St. Basil\'s Cathedral and Lenin\'s Mausoleum.', image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Kremlin', description: 'Fortified complex and seat of Russian government.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'historical' },
                { name: 'Bolshoi Theatre', description: 'World-famous ballet and opera house.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', category: 'entertainment' },
                { name: 'Tretyakov Gallery', description: 'Premier collection of Russian fine art.', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop', category: 'museum' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Moscow Essentials', days: [
                        { title: 'Red Square & Kremlin', activities: 'Red Square, St. Basil\'s Cathedral, Kremlin tour, Armory Chamber' },
                        { title: 'Culture & Arts', activities: 'Tretyakov Gallery, Bolshoi Theatre, Pushkin Museum' },
                        { title: 'Soviet History', activities: 'Lenin\'s Mausoleum, Metro tour, VDNKh park, Soviet monuments' },
                        { title: 'Modern Moscow', activities: 'Arbat Street, Gorky Park, Moscow City skyscrapers, Russian cuisine' }
                    ]
                }
            ],
            tips: {
                budget: ['Metro system is beautiful and very cheap', 'Business lunch menus offer great value', 'Many parks and squares are free to explore', 'Student discounts available at museums'],
                cultural: ['Learn Cyrillic alphabet basics for navigation', 'Russians may seem reserved but are helpful when approached', 'Tipping 10% is becoming more common', 'Dress warmly in winter - temperatures can be extreme']
            }
        }
    },
    china: {
        beijing: {
            id: 'beijing-china',
            name: 'Beijing',
            country: 'China',
            countryCode: 'china',
            cityCode: 'beijing',
            airportCode: 'PEK',
            tagline: 'Ancient capital where imperial history meets modern China',
            description: 'Beijing is China\'s capital and cultural heart, home to the Forbidden City, Great Wall, and centuries of imperial history. This dynamic metropolis seamlessly blends ancient traditions with rapid modernization, offering incredible historical sites, delicious cuisine, and fascinating cultural experiences.',
            heroImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&h=800&fit=crop',
            bestTime: 'April-May, September-October',
            climate: 'Continental',
            currency: 'Chinese Yuan (CNY)',
            language: 'Mandarin Chinese',
            avgFlightPrice: '$820',
            coordinates: { lat: 39.9042, lng: 116.4074 },
            attractions: [
                { name: 'Forbidden City', description: 'Imperial palace complex with 9,999 rooms.', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop', category: 'palace' },
                { name: 'Great Wall of China', description: 'Ancient fortification and UNESCO World Heritage site.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Temple of Heaven', description: 'Imperial temple complex with stunning architecture.', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', category: 'religious' },
                { name: 'Tiananmen Square', description: 'World\'s largest public square and political center.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'landmark' }
            ],
            itineraries: [
                {
                    duration: '5 Days', title: 'Beijing Imperial Tour', days: [
                        { title: 'Forbidden City', activities: 'Forbidden City, Tiananmen Square, Jingshan Park sunset' },
                        { title: 'Great Wall', activities: 'Mutianyu section of Great Wall, cable car, mountain views' },
                        { title: 'Temples & Parks', activities: 'Temple of Heaven, Lama Temple, Beihai Park' },
                        { title: 'Hutongs & Culture', activities: 'Hutong tour, traditional courtyard houses, Peking duck dinner' },
                        { title: 'Summer Palace', activities: 'Summer Palace, Kunming Lake, traditional Chinese gardens' }
                    ]
                }
            ],
            tips: {
                budget: ['Street food is delicious and very cheap', 'Public transport is extensive and affordable', 'Many temples have small entrance fees', 'Bargain at markets and with taxi drivers'],
                cultural: ['Learn basic Mandarin phrases or use translation apps', 'Respect for elders is very important', 'Business cards should be received with both hands', 'Tipping is not customary in most situations']
            }
        }
    },
    south_korea: {
        seoul: {
            id: 'seoul-south-korea',
            name: 'Seoul',
            country: 'South Korea',
            countryCode: 'south-korea',
            cityCode: 'seoul',
            airportCode: 'ICN',
            tagline: 'Dynamic metropolis where K-culture meets ancient traditions',
            description: 'Seoul is a vibrant mega-city that perfectly balances cutting-edge technology with deep-rooted traditions. From ancient palaces and Buddhist temples to K-pop culture and world-class shopping, this dynamic capital offers an exciting glimpse into modern Asian culture.',
            heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=800&fit=crop',
            bestTime: 'April-June, September-November',
            climate: 'Humid continental',
            currency: 'South Korean Won (KRW)',
            language: 'Korean',
            avgFlightPrice: '$750',
            coordinates: { lat: 37.5665, lng: 126.9780 },
            attractions: [
                { name: 'Gyeongbokgung Palace', description: 'Grand royal palace with changing of the guard ceremony.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop', category: 'palace' },
                { name: 'Bukchon Hanok Village', description: 'Traditional Korean houses in historic neighborhood.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'neighborhood' },
                { name: 'Myeongdong', description: 'Shopping district famous for cosmetics and street food.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'shopping' },
                { name: 'N Seoul Tower', description: 'Iconic tower with panoramic city views.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'landmark' }
            ],
            itineraries: [
                {
                    duration: '5 Days', title: 'Seoul Culture & Modern Life', days: [
                        { title: 'Royal Palaces', activities: 'Gyeongbokgung Palace, Changdeokgung Palace, traditional hanbok rental' },
                        { title: 'Traditional Culture', activities: 'Bukchon Hanok Village, Insadong art district, tea ceremony' },
                        { title: 'Modern Seoul', activities: 'Gangnam district, K-pop culture, Lotte World Tower' },
                        { title: 'Food & Markets', activities: 'Myeongdong street food, Dongdaemun night market, Korean BBQ' },
                        { title: 'Nature & Views', activities: 'Namsan Park, N Seoul Tower, Han River cruise' }
                    ]
                }
            ],
            tips: {
                budget: ['Street food is amazing and very affordable', 'T-money card saves money on public transport', 'Many palaces offer combo tickets', 'Convenience stores have great cheap meals'],
                cultural: ['Bowing is important when greeting', 'Remove shoes when entering homes', 'Koreans are very tech-savvy and helpful', 'Learn basic Korean phrases - locals appreciate it']
            }
        }
    },
    vietnam: {
        'ho-chi-minh-city': {
            id: 'ho-chi-minh-vietnam',
            name: 'Ho Chi Minh City',
            country: 'Vietnam',
            countryCode: 'vietnam',
            cityCode: 'ho-chi-minh-city',
            airportCode: 'SGN',
            tagline: 'The bustling heart of Vietnam with incredible street food',
            description: 'Ho Chi Minh City (formerly Saigon) is Vietnam\'s largest city and economic hub, a bustling metropolis where French colonial architecture meets modern skyscrapers. Famous for its incredible street food, vibrant markets, and rich history, this dynamic city offers an authentic Vietnamese experience.',
            heroImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&h=800&fit=crop',
            bestTime: 'December-April',
            climate: 'Tropical',
            currency: 'Vietnamese Dong (VND)',
            language: 'Vietnamese',
            avgFlightPrice: '$680',
            coordinates: { lat: 10.8231, lng: 106.6297 },
            attractions: [
                { name: 'Ben Thanh Market', description: 'Iconic market with local food, crafts, and souvenirs.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'market' },
                { name: 'War Remnants Museum', description: 'Moving museum documenting the Vietnam War.', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop', category: 'museum' },
                { name: 'Notre-Dame Cathedral', description: 'French colonial cathedral in the city center.', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', category: 'religious' },
                { name: 'Cu Chi Tunnels', description: 'Historic underground tunnel network from the war.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'historical' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Ho Chi Minh City Explorer', days: [
                        { title: 'City Center', activities: 'Ben Thanh Market, Notre-Dame Cathedral, Central Post Office, street food tour' },
                        { title: 'History & Culture', activities: 'War Remnants Museum, Reunification Palace, Jade Emperor Pagoda' },
                        { title: 'Cu Chi Tunnels', activities: 'Day trip to Cu Chi Tunnels, underground experience, local lunch' },
                        { title: 'Local Life', activities: 'Mekong Delta day trip, floating markets, traditional villages' }
                    ]
                }
            ],
            tips: {
                budget: ['Street food is incredibly cheap and delicious', 'Motorbike taxis are affordable for short distances', 'Bargain at markets but not in restaurants', 'Local beer is very inexpensive'],
                cultural: ['Traffic is chaotic - be very careful crossing streets', 'Vietnamese people are friendly and helpful', 'Tipping is not expected but appreciated', 'Learn basic Vietnamese phrases for better experiences']
            }
        }
    },
    argentina: {
        'buenos-aires': {
            id: 'buenos-aires-argentina',
            name: 'Buenos Aires',
            country: 'Argentina',
            countryCode: 'argentina',
            cityCode: 'buenos-aires',
            airportCode: 'EZE',
            tagline: 'The Paris of South America with tango, steaks, and passion',
            description: 'Buenos Aires is a sophisticated city that exudes European elegance with Latin American passion. Known for its tango culture, incredible steakhouses, beautiful architecture, and vibrant nightlife, this cosmopolitan capital offers a unique blend of cultures and unforgettable experiences.',
            heroImage: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&h=800&fit=crop',
            bestTime: 'March-May, September-November',
            climate: 'Humid subtropical',
            currency: 'Argentine Peso (ARS)',
            language: 'Spanish',
            avgFlightPrice: '$720',
            coordinates: { lat: -34.6118, lng: -58.3960 },
            attractions: [
                { name: 'La Boca', description: 'Colorful neighborhood famous for tango and Caminito street.', image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=400&h=300&fit=crop', category: 'neighborhood' },
                { name: 'Recoleta Cemetery', description: 'Elaborate cemetery where Eva Perón is buried.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'historical' },
                { name: 'San Telmo', description: 'Historic neighborhood with antique markets and tango shows.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'neighborhood' },
                { name: 'Puerto Madero', description: 'Modern waterfront district with upscale dining.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'waterfront' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Buenos Aires Tango & Culture', days: [
                        { title: 'Historic Center', activities: 'Plaza de Mayo, Casa Rosada, Caminito in La Boca, tango show' },
                        { title: 'Recoleta & Palermo', activities: 'Recoleta Cemetery, MALBA museum, Palermo parks and cafés' },
                        { title: 'San Telmo & Markets', activities: 'San Telmo antique market, tango lessons, traditional parrilla dinner' },
                        { title: 'Modern Buenos Aires', activities: 'Puerto Madero, Tigre Delta day trip, wine tasting' }
                    ]
                }
            ],
            tips: {
                budget: ['Lunch menus are much cheaper than dinner', 'Public transport is very affordable', 'Free tango shows in parks on weekends', 'Happy hour at bars 6-8 PM'],
                cultural: ['Argentines dine very late - dinner starts around 9-10 PM', 'Kissing on the cheek is the standard greeting', 'Tipping 10% is expected at restaurants', 'Learn some tango basics - locals love to teach']
            }
        }
    },
    chile: {
        santiago: {
            id: 'santiago-chile',
            name: 'Santiago',
            country: 'Chile',
            countryCode: 'chile',
            cityCode: 'santiago',
            airportCode: 'SCL',
            tagline: 'Cosmopolitan capital surrounded by the majestic Andes',
            description: 'Santiago is a modern metropolis set against the dramatic backdrop of the Andes Mountains. This sophisticated city offers world-class wine regions, excellent cuisine, vibrant cultural scene, and easy access to both mountain adventures and Pacific coast beaches.',
            heroImage: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=1200&h=800&fit=crop',
            bestTime: 'March-May, September-November',
            climate: 'Mediterranean',
            currency: 'Chilean Peso (CLP)',
            language: 'Spanish',
            avgFlightPrice: '$780',
            coordinates: { lat: -33.4489, lng: -70.6693 },
            attractions: [
                { name: 'Cerro San Cristóbal', description: 'Hill with panoramic city views and cable car access.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'La Moneda Palace', description: 'Presidential palace and seat of government.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'palace' },
                { name: 'Bellavista', description: 'Bohemian neighborhood with nightlife and Pablo Neruda\'s house.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', category: 'neighborhood' },
                { name: 'Central Market', description: 'Historic market famous for fresh seafood and local products.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'market' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Santiago & Wine Country', days: [
                        { title: 'City Center', activities: 'Plaza de Armas, La Moneda Palace, Central Market, historic walking tour' },
                        { title: 'Hills & Views', activities: 'Cerro San Cristóbal, cable car, city panoramas, Bellavista nightlife' },
                        { title: 'Wine Country', activities: 'Maipo Valley wine tour, vineyard visits, wine tastings' },
                        { title: 'Culture & Food', activities: 'Pre-Columbian Art Museum, local markets, Chilean cuisine tour' }
                    ]
                }
            ],
            tips: {
                budget: ['Lunch menus offer great value', 'Metro system is modern and affordable', 'Many museums have free days', 'Wine tastings are reasonably priced'],
                cultural: ['Chileans are formal and polite', 'Punctuality is important for appointments', 'Tipping 10% is standard', 'Air quality can be poor due to smog - check daily reports']
            }
        }
    },
    peru: {
        lima: {
            id: 'lima-peru',
            name: 'Lima',
            country: 'Peru',
            countryCode: 'peru',
            cityCode: 'lima',
            airportCode: 'LIM',
            tagline: 'Culinary capital with colonial charm and coastal beauty',
            description: 'Lima is Peru\'s vibrant capital and the gastronomic heart of South America. This coastal city blends colonial architecture with modern districts, offering world-renowned cuisine, fascinating museums, and beautiful Pacific Ocean views.',
            heroImage: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=1200&h=800&fit=crop',
            bestTime: 'December-April',
            climate: 'Desert coastal',
            currency: 'Peruvian Sol (PEN)',
            language: 'Spanish, Quechua',
            avgFlightPrice: '$650',
            coordinates: { lat: -12.0464, lng: -77.0428 },
            attractions: [
                { name: 'Historic Center', description: 'UNESCO World Heritage colonial architecture.', image: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=400&h=300&fit=crop', category: 'historical' },
                { name: 'Miraflores', description: 'Upscale district with ocean views and shopping.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'neighborhood' },
                { name: 'Larco Museum', description: 'Impressive collection of pre-Columbian art.', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop', category: 'museum' },
                { name: 'Barranco', description: 'Bohemian district with street art and nightlife.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', category: 'neighborhood' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Lima Culture & Cuisine', days: [
                        { title: 'Historic Lima', activities: 'Plaza Mayor, Cathedral, Government Palace, San Francisco Monastery' },
                        { title: 'Museums & Culture', activities: 'Larco Museum, Gold Museum, Pueblo Libre district' },
                        { title: 'Modern Lima', activities: 'Miraflores, Larcomar shopping, Pacific Ocean views' },
                        { title: 'Food & Barranco', activities: 'Culinary tour, ceviche tasting, Barranco street art, nightlife' }
                    ]
                }
            ],
            tips: {
                budget: ['Set lunch menus are very affordable', 'Public transport is cheap but can be crowded', 'Many churches and plazas are free to visit', 'Street food is delicious and inexpensive'],
                cultural: ['Peruvians are warm and family-oriented', 'Try ceviche and pisco sour - national specialties', 'Tipping 10% is appreciated', 'Spanish phrases are helpful - English less common']
            }
        }
    },
    morocco: {
        marrakech: {
            id: 'marrakech-morocco',
            name: 'Marrakech',
            country: 'Morocco',
            countryCode: 'morocco',
            cityCode: 'marrakech',
            airportCode: 'RAK',
            tagline: 'The Red City where ancient traditions meet vibrant souks',
            description: 'Marrakech is a sensory feast of colors, sounds, and aromas. This ancient imperial city captivates with its bustling medina, stunning palaces, vibrant souks, and the famous Jemaa el-Fnaa square that comes alive with storytellers, musicians, and food vendors.',
            heroImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&h=800&fit=crop',
            bestTime: 'October-April',
            climate: 'Hot semi-arid',
            currency: 'Moroccan Dirham (MAD)',
            language: 'Arabic, Berber, French',
            avgFlightPrice: '$580',
            coordinates: { lat: 31.6295, lng: -7.9811 },
            attractions: [
                { name: 'Jemaa el-Fnaa', description: 'Famous square with street performers and food stalls.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Bahia Palace', description: 'Stunning 19th-century palace with intricate decorations.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'palace' },
                { name: 'Majorelle Garden', description: 'Beautiful botanical garden with vibrant blue buildings.', image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=300&fit=crop', category: 'garden' },
                { name: 'Medina Souks', description: 'Labyrinthine markets selling crafts, spices, and textiles.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'market' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Marrakech Imperial Experience', days: [
                        { title: 'Medina & Souks', activities: 'Jemaa el-Fnaa, souk shopping, traditional crafts, mint tea' },
                        { title: 'Palaces & Gardens', activities: 'Bahia Palace, Saadian Tombs, Majorelle Garden, Menara Gardens' },
                        { title: 'Culture & Relaxation', activities: 'Ben Youssef Madrasa, traditional hammam, rooftop dining' },
                        { title: 'Atlas Mountains', activities: 'Day trip to Atlas Mountains, Berber villages, mountain views' }
                    ]
                }
            ],
            tips: {
                budget: ['Bargaining is essential in souks - start at 30% of asking price', 'Street food and local restaurants are very affordable', 'Shared taxis are cheap for longer distances', 'Many riads offer great value accommodation'],
                cultural: ['Dress modestly, especially in religious areas', 'Use your right hand for eating and greetings', 'Friday is the holy day - some shops may be closed', 'Learn basic Arabic or French phrases']
            }
        }
    },
    uae: {
        dubai: {
            id: 'dubai-uae',
            name: 'Dubai',
            country: 'United Arab Emirates',
            countryCode: 'uae',
            cityCode: 'dubai',
            airportCode: 'DXB',
            tagline: 'Futuristic oasis where luxury meets desert adventure',
            description: 'Dubai is a gleaming metropolis that rose from the desert to become a global hub of luxury, innovation, and ambition. From the world\'s tallest building to artificial islands, this cosmopolitan city offers unparalleled shopping, dining, and entertainment experiences.',
            heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop',
            bestTime: 'November-March',
            climate: 'Hot desert',
            currency: 'UAE Dirham (AED)',
            language: 'Arabic, English',
            avgFlightPrice: '$750',
            coordinates: { lat: 25.2048, lng: 55.2708 },
            attractions: [
                { name: 'Burj Khalifa', description: 'World\'s tallest building with observation decks.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Dubai Mall', description: 'One of the world\'s largest shopping malls.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'shopping' },
                { name: 'Palm Jumeirah', description: 'Artificial island with luxury resorts and beaches.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'island' },
                { name: 'Dubai Creek', description: 'Historic waterway with traditional dhow boats.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'waterfront' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Dubai Luxury & Adventure', days: [
                        { title: 'Modern Dubai', activities: 'Burj Khalifa, Dubai Mall, Dubai Fountain, luxury shopping' },
                        { title: 'Beach & Islands', activities: 'Palm Jumeirah, Atlantis resort, beach clubs, water sports' },
                        { title: 'Desert Adventure', activities: 'Desert safari, camel riding, Bedouin camp, dune bashing' },
                        { title: 'Traditional Dubai', activities: 'Dubai Creek, Gold Souk, Spice Souk, dhow cruise dinner' }
                    ]
                }
            ],
            tips: {
                budget: ['Happy hours at hotels offer better drink prices', 'Food courts in malls are more affordable', 'Public transport is modern and air-conditioned', 'Many beaches and parks are free to enjoy'],
                cultural: ['Dubai is very international and English-friendly', 'Dress modestly in public areas', 'Alcohol is available but expensive', 'Tipping 10-15% is appreciated']
            }
        }
    },
    israel: {
        'tel-aviv': {
            id: 'tel-aviv-israel',
            name: 'Tel Aviv',
            country: 'Israel',
            countryCode: 'israel',
            cityCode: 'tel-aviv',
            airportCode: 'TLV',
            tagline: 'The Mediterranean city that never stops',
            description: 'Tel Aviv is Israel\'s vibrant cultural and economic center, known for its beautiful beaches, world-class nightlife, innovative cuisine, and Bauhaus architecture. This cosmopolitan city offers a perfect blend of ancient history and modern innovation along the Mediterranean coast.',
            heroImage: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=1200&h=800&fit=crop',
            bestTime: 'April-June, September-November',
            climate: 'Mediterranean',
            currency: 'Israeli Shekel (ILS)',
            language: 'Hebrew, Arabic, English',
            avgFlightPrice: '$680',
            coordinates: { lat: 32.0853, lng: 34.7818 },
            attractions: [
                { name: 'Tel Aviv Beach', description: 'Beautiful Mediterranean beaches with vibrant beach culture.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'beach' },
                { name: 'Jaffa Old City', description: 'Ancient port city with narrow alleys and art galleries.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop', category: 'historical' },
                { name: 'Carmel Market', description: 'Bustling market with fresh produce, spices, and street food.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', category: 'market' },
                { name: 'White City', description: 'UNESCO World Heritage Bauhaus architecture district.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'architecture' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Tel Aviv Beach & Culture', days: [
                        { title: 'Beach & Promenade', activities: 'Tel Aviv beaches, promenade walk, beach volleyball, sunset drinks' },
                        { title: 'Jaffa & History', activities: 'Jaffa Old City, flea market, ancient port, art galleries' },
                        { title: 'Food & Markets', activities: 'Carmel Market, food tour, hummus crawl, local cuisine' },
                        { title: 'Culture & Nightlife', activities: 'Bauhaus architecture tour, museums, famous nightlife scene' }
                    ]
                }
            ],
            tips: {
                budget: ['Beach access is free and well-maintained', 'Lunch specials are much cheaper than dinner', 'Public transport stops on Shabbat (Friday evening to Saturday evening)', 'Happy hour at beach bars 4-7 PM'],
                cultural: ['Tel Aviv is very secular and liberal', 'Hebrew and English are widely spoken', 'Tipping 12-18% is standard', 'City shuts down for Shabbat but nightlife is world-famous']
            }
        }
    },
    new_zealand: {
        auckland: {
            id: 'auckland-new-zealand',
            name: 'Auckland',
            country: 'New Zealand',
            countryCode: 'new-zealand',
            cityCode: 'auckland',
            airportCode: 'AKL',
            tagline: 'City of Sails surrounded by harbors and volcanic cones',
            description: 'Auckland is New Zealand\'s largest city, beautifully situated between two harbors and dotted with volcanic cones. This cosmopolitan city offers stunning natural beauty, Maori culture, world-class wine regions, and easy access to both beaches and adventure activities.',
            heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
            bestTime: 'December-March, September-November',
            climate: 'Temperate oceanic',
            currency: 'New Zealand Dollar (NZD)',
            language: 'English, Maori',
            avgFlightPrice: '$1,100',
            coordinates: { lat: -36.8485, lng: 174.7633 },
            attractions: [
                { name: 'Sky Tower', description: 'Iconic tower with bungee jumping and city views.', image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop', category: 'landmark' },
                { name: 'Waitemata Harbour', description: 'Beautiful harbor perfect for sailing and ferry rides.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'waterfront' },
                { name: 'Rangitoto Island', description: 'Volcanic island with hiking trails and city views.', image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=300&fit=crop', category: 'island' },
                { name: 'Auckland War Memorial Museum', description: 'Comprehensive museum with Maori and Pacific collections.', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec07f?w=400&h=300&fit=crop', category: 'museum' }
            ],
            itineraries: [
                {
                    duration: '4 Days', title: 'Auckland Nature & Culture', days: [
                        { title: 'City & Harbor', activities: 'Sky Tower, Viaduct Harbour, ferry rides, waterfront dining' },
                        { title: 'Islands & Nature', activities: 'Rangitoto Island hike, Waiheke Island wine tasting' },
                        { title: 'Culture & Museums', activities: 'Auckland Museum, Maori cultural performance, art galleries' },
                        { title: 'Adventure & Beaches', activities: 'West coast beaches, Waitakere Ranges, adventure activities' }
                    ]
                }
            ],
            tips: {
                budget: ['Many beaches and hiking trails are free', 'BYO restaurants save money on alcohol', 'Public transport day passes offer good value', 'Backpacker hostels are high quality and affordable'],
                cultural: ['New Zealanders (Kiwis) are friendly and laid-back', 'Maori culture is an integral part of New Zealand', 'Tipping is not expected but appreciated', 'Outdoor activities are a way of life']
            }
        }
    }
};

// Function to get destination data
export async function getDestinationData(country: string, city: string): Promise<Destination | null> {
    const countryData = destinationsData[country.toLowerCase()];
    if (!countryData) return null;

    const cityData = countryData[city.toLowerCase()];
    if (!cityData) return null;

    return cityData;
}

// Function to get all destinations
export async function getAllDestinations(): Promise<Destination[]> {
    const destinations: Destination[] = [];

    Object.values(destinationsData).forEach(country => {
        Object.values(country).forEach(city => {
            destinations.push(city);
        });
    });

    return destinations;
}

// Function to get destinations by country
export async function getDestinationsByCountry(country: string): Promise<Destination[]> {
    const countryData = destinationsData[country.toLowerCase()];
    if (!countryData) return [];

    return Object.values(countryData);
}

// Function to search destinations
export async function searchDestinations(query: string): Promise<Destination[]> {
    const allDestinations = await getAllDestinations();
    const searchTerm = query.toLowerCase();

    return allDestinations.filter(destination =>
        destination.name.toLowerCase().includes(searchTerm) ||
        destination.country.toLowerCase().includes(searchTerm) ||
        destination.description.toLowerCase().includes(searchTerm)
    );
}