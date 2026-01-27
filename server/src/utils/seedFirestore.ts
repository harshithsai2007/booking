import { db, admin } from '../firestore';
import path from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const hotels = [
    {
        name: "Taj Falaknuma Palace",
        description: "Experience the royal grandeur of the Nizams at this enchanting palace hotel, perched 2,000 feet above Hyderabad.",
        location: {
            address: "Engine Bowli, Falaknuma",
            city: "Hyderabad",
            district: "Hyderabad",
            state: "Telangana",
            pinCode: "500053",
            coordinates: { lat: 17.3317, lng: 78.4711 }
        },
        starRating: 5,
        amenities: ["WiFi", "Pool", "Spa", "Dining", "Heritage Walk", "Library"],
        regionalAmenities: ["Heritage Tours", "Nizami Cuisine", "Qawwali Nights"],
        featured: true,
        priceRange: { min: 35000, max: 75000 },
        images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000"]
    },
    {
        name: "Novotel Visakhapatnam Varun Beach",
        description: "Luxury beachfront hotel overlooking the Bay of Bengal, perfect for business and leisure travelers.",
        location: {
            address: "Beach Road, Maharani Peta",
            city: "Visakhapatnam",
            district: "Visakhapatnam",
            state: "Andhra Pradesh",
            pinCode: "530002",
            coordinates: { lat: 17.7142, lng: 83.3235 }
        },
        starRating: 5,
        amenities: ["WiFi", "Infinity Pool", "Gym", "Sea View Rooms", "Spa"],
        regionalAmenities: ["Beach Activities", "Araku Coffee", "Port Visit"],
        featured: true,
        priceRange: { min: 8000, max: 20000 },
        images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1000"]
    },
    {
        name: "Grand Vijayawada",
        description: "Modern luxury in the heart of Vijayawada, close to Kanaka Durga Temple.",
        location: {
            address: "MG Road, Benz Circle",
            city: "Vijayawada",
            district: "NTR",
            state: "Andhra Pradesh",
            pinCode: "520010",
            coordinates: { lat: 16.5062, lng: 80.6480 }
        },
        starRating: 4,
        amenities: ["WiFi", "Restaurant", "Conference Hall", "Gym"],
        regionalAmenities: ["Temple Visit Arrangements", "Andhra Thali"],
        featured: false,
        priceRange: { min: 4000, max: 10000 },
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"]
    },
    {
        name: "Haritha Kakatiya Hotel",
        description: "Comfortable stay near the historic Warangal Fort and Thousand Pillar Temple.",
        location: {
            address: "Hanamkonda",
            city: "Warangal",
            district: "Warangal",
            state: "Telangana",
            pinCode: "506001",
            coordinates: { lat: 18.0000, lng: 79.5800 }
        },
        starRating: 3,
        amenities: ["WiFi", "Parking", "Restaurant", "Garden"],
        regionalAmenities: ["Fort Tours", "Kakatiya Heritage"],
        featured: false,
        priceRange: { min: 2500, max: 5000 },
        images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1000"]
    },
    {
        name: "Marigold Hotel",
        description: "A 5-star luxury hotel in Greenlands, Begumpet, offering world-class hospitality.",
        location: {
            address: "Greenlands, Begumpet",
            city: "Hyderabad",
            district: "Hyderabad",
            state: "Telangana",
            pinCode: "500016",
            coordinates: { lat: 17.4357, lng: 78.4578 }
        },
        starRating: 5,
        amenities: ["WiFi", "Pool", "Spa", "Fine Dining", "Gym"],
        regionalAmenities: ["IT Hub Proximity", "Shopping Malls"],
        featured: true,
        priceRange: { min: 7000, max: 15000 },
        images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000"]
    },
    {
        name: "Araku Valley Resort",
        description: "Nestled in the Eastern Ghats, a perfect retreat for nature lovers.",
        location: {
            address: "Araku Valley",
            city: "Araku",
            district: "Alluri Sitharama Raju",
            state: "Andhra Pradesh",
            pinCode: "531149",
            coordinates: { lat: 18.3273, lng: 82.8775 }
        },
        starRating: 3,
        amenities: ["Campfire", "Trekking", "Restaurant", "Cottages"],
        regionalAmenities: ["Coffee Plantation Tour", "Tribal Museum Visit"],
        featured: true,
        priceRange: { min: 3000, max: 6000 },
        images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=1000"]
    },
    {
        name: "Fortune Select Grand Ridge",
        description: "Upscale hotel in Tirupati featuring views of the Tirumala Hills.",
        location: {
            address: "Shilparamam, Tiruchanur Road",
            city: "Tirupati",
            district: "Tirupati",
            state: "Andhra Pradesh",
            pinCode: "517501",
            coordinates: { lat: 13.6288, lng: 79.4192 }
        },
        starRating: 5,
        amenities: ["WiFi", "Vegetarian Dining", "Pool", "Travel Desk"],
        regionalAmenities: ["Darshan Booking Assistance", "Temple Drop/Pickup"],
        featured: true,
        priceRange: { min: 5000, max: 12000 },
        images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=1000"]
    },
    {
        name: "Punnami Ghat Hotel",
        description: "Riverside stay offering panoramic views of the Krishna River.",
        location: {
            address: "Bhavani Island",
            city: "Vijayawada",
            district: "NTR",
            state: "Andhra Pradesh",
            pinCode: "520012",
            coordinates: { lat: 16.5193, lng: 80.6115 }
        },
        starRating: 3,
        amenities: ["Boating", "Restaurant", "AC Rooms", "Garden"],
        regionalAmenities: ["River Cruise", "Island Activities"],
        featured: false,
        priceRange: { min: 2000, max: 4500 },
        images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000"]
    },
    {
        name: "Minerva Grand",
        description: "Business class hotel in the commercial hub of Secunderabad.",
        location: {
            address: "SD Road",
            city: "Secunderabad",
            district: "Hyderabad",
            state: "Telangana",
            pinCode: "500003",
            coordinates: { lat: 17.4399, lng: 78.4983 }
        },
        starRating: 4,
        amenities: ["WiFi", "Business Center", "Gym", "Restaurant"],
        regionalAmenities: ["City Tours", "Shopping"],
        featured: false,
        priceRange: { min: 4500, max: 9000 },
        images: ["https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&q=80&w=1000"]
    },
    {
        name: "Dolphin Hotel",
        description: "Iconic hotel in Visakhapatnam known for its hospitality and fine dining.",
        location: {
            address: "Daba Gardens",
            city: "Visakhapatnam",
            district: "Visakhapatnam",
            state: "Andhra Pradesh",
            pinCode: "530020",
            coordinates: { lat: 17.7205, lng: 83.3033 }
        },
        starRating: 4,
        amenities: ["WiFi", "Pool", "3 Restaurants", "Bar"],
        regionalAmenities: ["Araku Packages", "Local Cuisine"],
        featured: false,
        priceRange: { min: 5000, max: 10000 },
        images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=1000"]
    }
];

const seedFirestore = async () => {
    try {
        console.log('🚀 Starting Firestore Seeding...');

        // Use batch for better performance (though only 10 hotels here)
        const batch = db.batch();

        // Clear existing hotels (Note: Firestore doesn't provide a delete collection method, we must delete docs)
        const existingHotels = await db.collection('hotels').get();
        existingHotels.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log('🗑️ Cleared existing hotels');

        for (const hotel of hotels) {
            const hotelRef = db.collection('hotels').doc();
            await hotelRef.set({
                ...hotel,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Add rooms in a subcollection
            const rooms = [
                {
                    type: 'Deluxe Room',
                    pricePerNight: Math.floor(hotel.priceRange.min * 1.1),
                    capacity: { adults: 2, children: 1 },
                    amenities: ['AC', 'WiFi', 'TV'],
                    count: 10
                },
                {
                    type: 'Suite',
                    pricePerNight: Math.floor(hotel.priceRange.max * 0.9),
                    capacity: { adults: 2, children: 2 },
                    amenities: ['AC', 'WiFi', 'TV', 'Bathtub', 'Balcony'],
                    count: 5
                }
            ];

            for (const room of rooms) {
                await hotelRef.collection('rooms').add(room);
            }
        }

        console.log(`✅ Successfully seeded ${hotels.length} hotels with rooms!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedFirestore();
