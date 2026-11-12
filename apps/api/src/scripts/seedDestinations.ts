import mongoose from 'mongoose';
import { loadEnv } from '../config/env';
import Category from '../models/Category';
import Location from '../models/Location';
import Destination from '../models/Destination';

loadEnv();

const categoriesData = [
  { name: 'Beach & Island', description: 'Sun, sand, turquoise waters, and island escapes.' },
  { name: 'Cultural & Heritage', description: 'Historic cities, traditions, and cultural landmarks.' },
  { name: 'Mountain & Nature', description: 'Mountains, forests, lakes, and natural wonders.' },
  { name: 'Winter Sports', description: 'Ski resorts, snow adventures, and alpine towns.' },
  { name: 'Adventure', description: 'Thrilling outdoor activities and wild landscapes.' },
  { name: 'City Break', description: 'Vibrant urban destinations full of life and sights.' },
  { name: 'Wildlife & Safari', description: 'National parks, safaris, and wildlife encounters.' },
  { name: 'Wellness & Retreat', description: 'Relaxing retreats, spas, and peaceful getaways.' },
];

const locationsData = [
  { name: 'Bali Province', country: 'Indonesia', region: 'Bali' },
  { name: 'Phuket', country: 'Thailand', region: 'Southern Thailand' },
  { name: 'Maldives', country: 'Maldives', region: 'Indian Ocean' },
  { name: 'Santorini', country: 'Greece', region: 'Cyclades' },
  { name: 'Maui', country: 'United States', region: 'Hawaii' },
  { name: 'Kyoto', country: 'Japan', region: 'Kansai' },
  { name: 'Rome', country: 'Italy', region: 'Lazio' },
  { name: 'Cairo', country: 'Egypt', region: 'Cairo Governorate' },
  { name: 'Istanbul', country: 'Turkey', region: 'Marmara' },
  { name: 'Cusco', country: 'Peru', region: 'Cusco Region' },
  { name: 'Swiss Alps', country: 'Switzerland', region: 'Valais' },
  { name: 'Banff', country: 'Canada', region: 'Alberta' },
  { name: 'Kathmandu Valley', country: 'Nepal', region: 'Bagmati' },
  { name: 'Queenstown', country: 'New Zealand', region: 'Otago' },
  { name: 'Patagonia', country: 'Argentina', region: 'Santa Cruz' },
  { name: 'Whistler', country: 'Canada', region: 'British Columbia' },
  { name: 'Aspen', country: 'United States', region: 'Colorado' },
  { name: 'Zermatt', country: 'Switzerland', region: 'Valais' },
  { name: 'Niseko', country: 'Japan', region: 'Hokkaido' },
  { name: 'Chamonix', country: 'France', region: 'Auvergne-Rhône-Alpes' },
  { name: 'Dubai', country: 'United Arab Emirates', region: 'Dubai' },
  { name: 'Paris', country: 'France', region: 'Île-de-France' },
  { name: 'New York City', country: 'United States', region: 'New York' },
  { name: 'Singapore', country: 'Singapore', region: 'Southeast Asia' },
  { name: 'Cape Town', country: 'South Africa', region: 'Western Cape' },
  { name: 'Barcelona', country: 'Spain', region: 'Catalonia' },
  { name: 'Serengeti', country: 'Tanzania', region: 'Mara Region' },
  { name: 'Kruger', country: 'South Africa', region: 'Mpumalanga' },
  { name: 'Masai Mara', country: 'Kenya', region: 'Narok County' },
  { name: 'Amazon Basin', country: 'Brazil', region: 'Amazonas' },
  { name: 'Ubud', country: 'Indonesia', region: 'Bali' },
  { name: 'Sedona', country: 'United States', region: 'Arizona' },
  { name: 'Kerala Backwaters', country: 'India', region: 'Kerala' },
  { name: 'Tulum', country: 'Mexico', region: 'Quintana Roo' },
  { name: 'Reykjavik', country: 'Iceland', region: 'Capital Region' },
  { name: 'Interlaken', country: 'Switzerland', region: 'Bernese Oberland' },
  { name: 'Amalfi Coast', country: 'Italy', region: 'Campania' },
  { name: 'Hoi An', country: 'Vietnam', region: 'Quảng Nam' },
  { name: 'Petra', country: 'Jordan', region: 'Ma’an Governorate' },
  { name: 'Marrakech', country: 'Morocco', region: 'Marrakesh-Safi' },
];

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

type SeedDest = {
  name: string;
  category: string;
  location: string;
  description: string;
  estimated_budget: number;
  best_visit_season: string;
  average_rating: number;
  views: number;
  images: string[];
};

const destinationsData: SeedDest[] = [
  // Beach & Island (8)
  { name: 'Phuket Paradise Shores', category: 'Beach & Island', location: 'Phuket', description: 'Golden beaches, crystal-clear Andaman waters, island-hopping adventures, and vibrant coastal nightlife make Phuket a classic tropical escape.', estimated_budget: 1100, best_visit_season: 'November to April', average_rating: 4.6, views: 420, images: [u('photo-1589394815804-964ed0be2eb5'), u('photo-1507525428034-b723cf961d3e')] },
  { name: 'Maldives Overwater Escape', category: 'Beach & Island', location: 'Maldives', description: 'Iconic overwater villas, turquoise lagoons, coral reefs, and serene sunsets define this luxurious island paradise.', estimated_budget: 3200, best_visit_season: 'November to April', average_rating: 4.9, views: 980, images: [u('photo-1514282401047-d79a71a590e8'), u('photo-1573843981267-be1999ff37cd')] },
  { name: 'Santorini Caldera Views', category: 'Beach & Island', location: 'Santorini', description: 'Whitewashed villages perched above a volcanic caldera, blue-domed churches, and unforgettable Aegean sunsets.', estimated_budget: 1800, best_visit_season: 'April to October', average_rating: 4.8, views: 860, images: [u('photo-1613395877344-13d4a8e0d49e'), u('photo-1570077188670-e3a8d69ac5ff')] },
  { name: 'Maui Coastal Dreams', category: 'Beach & Island', location: 'Maui', description: 'Lush valleys, volcanic landscapes, world-class beaches, and the scenic Road to Hana on Hawaii’s beloved island.', estimated_budget: 2400, best_visit_season: 'April to October', average_rating: 4.7, views: 610, images: [u('photo-1542259009477-d625272157b7'), u('photo-1507876466758-bc54f384809c')] },
  { name: 'Amalfi Coast Seaside Charm', category: 'Beach & Island', location: 'Amalfi Coast', description: 'Dramatic cliffs, pastel villages, lemon groves, and sparkling Mediterranean waters along Italy’s iconic coastline.', estimated_budget: 2100, best_visit_season: 'May to September', average_rating: 4.8, views: 740, images: [u('photo-1533587851505-d119e13fa0d7'), u('photo-1612698093158-e07ac200d44e')] },
  { name: 'Tulum Beach & Ruins', category: 'Beach & Island', location: 'Tulum', description: 'Caribbean beaches meet ancient Mayan ruins, cenotes, and a relaxed bohemian atmosphere on Mexico’s Riviera Maya.', estimated_budget: 1300, best_visit_season: 'November to April', average_rating: 4.5, views: 530, images: [u('photo-1504730655501-24c39ac53f0e'), u('photo-1518638150340-f706e86654de')] },
  { name: 'Hoi An Riverside & Coast', category: 'Beach & Island', location: 'Hoi An', description: 'Lantern-lit ancient streets, nearby beaches, and rich culinary traditions in one of Vietnam’s most charming towns.', estimated_budget: 800, best_visit_season: 'February to August', average_rating: 4.7, views: 490, images: [u('photo-1559592413-7cec4d0cae2b'), u('photo-1528127269322-539801943592')] },
  { name: 'Bali Island Highlights', category: 'Beach & Island', location: 'Bali Province', description: 'A blend of pristine beaches, terraced rice fields, temples, and vibrant culture across Bali’s diverse landscapes.', estimated_budget: 1200, best_visit_season: 'April to October', average_rating: 4.8, views: 1200, images: [u('photo-1537996194471-e657df975ab4'), u('photo-1555400038-63f5ba517a47')] },

  // Cultural & Heritage (7)
  { name: 'Kyoto Temples & Traditions', category: 'Cultural & Heritage', location: 'Kyoto', description: 'Ancient temples, serene bamboo groves, traditional tea houses, and seasonal beauty in Japan’s cultural heart.', estimated_budget: 1700, best_visit_season: 'March to May, October to November', average_rating: 4.9, views: 910, images: [u('photo-1493976040374-85c8e12f0c0e'), u('photo-1478436127897-769e1b3f0f36')] },
  { name: 'Rome Eternal City', category: 'Cultural & Heritage', location: 'Rome', description: 'Walk through millennia of history among the Colosseum, Roman Forum, Vatican treasures, and timeless piazzas.', estimated_budget: 1600, best_visit_season: 'April to June, September to October', average_rating: 4.8, views: 1050, images: [u('photo-1552832230-c0197dd311b5'), u('photo-1529260830199-42c24126f198')] },
  { name: 'Cairo Pyramids & Nile', category: 'Cultural & Heritage', location: 'Cairo', description: 'Home to the Great Pyramids of Giza, the Sphinx, and the treasures of ancient Egypt along the Nile.', estimated_budget: 1200, best_visit_season: 'October to April', average_rating: 4.6, views: 700, images: [u('photo-1539650116574-8efeb43e2750'), u('photo-1503177119275-0aa32b3a9368')] },
  { name: 'Istanbul Crossroads of Cultures', category: 'Cultural & Heritage', location: 'Istanbul', description: 'A city straddling Europe and Asia, rich with Ottoman palaces, Byzantine wonders, bazaars, and Bosphorus views.', estimated_budget: 1100, best_visit_season: 'April to May, September to November', average_rating: 4.7, views: 780, images: [u('photo-1524231757912-21f4fe3a7200'), u('photo-1541432901042-2d8bd64b4a9b')] },
  { name: 'Cusco & Sacred Valley', category: 'Cultural & Heritage', location: 'Cusco', description: 'Gateway to Machu Picchu, Cusco blends Incan heritage, colonial architecture, and Andean culture.', estimated_budget: 1400, best_visit_season: 'May to September', average_rating: 4.8, views: 650, images: [u('photo-1526392060635-9d6019884377'), u('photo-1587595431973-160d0d94add1')] },
  { name: 'Petra Rose City', category: 'Cultural & Heritage', location: 'Petra', description: 'Discover the breathtaking rock-cut architecture and ancient Nabataean city carved into rose-red cliffs.', estimated_budget: 1500, best_visit_season: 'March to May, September to November', average_rating: 4.9, views: 720, images: [u('photo-1579606032821-4e6161c81bd3'), u('photo-1548786811-dd6e453ccca7')] },
  { name: 'Marrakech Medina & Souks', category: 'Cultural & Heritage', location: 'Marrakech', description: 'Vibrant souks, ornate palaces, aromatic cuisine, and the lively atmosphere of Jemaa el-Fnaa.', estimated_budget: 1000, best_visit_season: 'March to May, September to November', average_rating: 4.6, views: 560, images: [u('photo-1597212618440-806262de4f6b'), u('photo-1489749798305-4fea3ae63d43')] },

  // Mountain & Nature (7)
  { name: 'Swiss Alps Alpine Trails', category: 'Mountain & Nature', location: 'Swiss Alps', description: 'Majestic peaks, emerald valleys, scenic rail journeys, and pristine alpine villages in Switzerland.', estimated_budget: 2600, best_visit_season: 'June to September', average_rating: 4.9, views: 830, images: [u('photo-1531366936337-7c912a4589a7'), u('photo-1506905925346-21bda4d32df4')] },
  { name: 'Banff National Park', category: 'Mountain & Nature', location: 'Banff', description: 'Turquoise glacial lakes, towering Rockies, abundant wildlife, and year-round outdoor adventures.', estimated_budget: 1900, best_visit_season: 'June to September', average_rating: 4.9, views: 890, images: [u('photo-1501785888041-af3ef285b470'), u('photo-1464822759023-fed622ff2c3b')] },
  { name: 'Kathmandu Himalayan Gateway', category: 'Mountain & Nature', location: 'Kathmandu Valley', description: 'A cultural and spiritual gateway to the Himalayas, with ancient temples, stupas, and mountain vistas.', estimated_budget: 900, best_visit_season: 'October to November, March to April', average_rating: 4.6, views: 470, images: [u('photo-1544735716-392fe2489ffa'), u('photo-1585016495481-91613a3ab1bc')] },
  { name: 'Queenstown Adventure & Lakes', category: 'Mountain & Nature', location: 'Queenstown', description: 'Dramatic alpine scenery, Lake Wakatipu, and endless outdoor adventures in New Zealand’s south.', estimated_budget: 2200, best_visit_season: 'December to February, June to August', average_rating: 4.8, views: 640, images: [u('photo-1507699622108-4be3abd695ad'), u('photo-1469521669194-babb45599def')] },
  { name: 'Patagonia Wild Frontier', category: 'Mountain & Nature', location: 'Patagonia', description: 'Glaciers, jagged peaks, vast steppe, and raw wilderness at the edge of the world.', estimated_budget: 2800, best_visit_season: 'November to March', average_rating: 4.9, views: 520, images: [u('photo-1519681393784-d120267933ba'), u('photo-1531804055935-76f44d7c3621')] },
  { name: 'Interlaken Lakes & Peaks', category: 'Mountain & Nature', location: 'Interlaken', description: 'Nestled between two lakes and surrounded by the Jungfrau region, perfect for nature and adventure lovers.', estimated_budget: 2300, best_visit_season: 'June to September', average_rating: 4.8, views: 510, images: [u('photo-1527668752968-14dc70a27c95'), u('photo-1508264165352-258db2ebd59b')] },
  { name: 'Reykjavik & Icelandic Nature', category: 'Mountain & Nature', location: 'Reykjavik', description: 'Northern lights, geothermal wonders, waterfalls, and dramatic volcanic landscapes from Iceland’s capital base.', estimated_budget: 2400, best_visit_season: 'June to August, September to March', average_rating: 4.8, views: 680, images: [u('photo-1504829857797-ddff29c27927'), u('photo-1476610182048-b716b8518aae')] },

  // Winter Sports (6)
  { name: 'Whistler Snow Resort', category: 'Winter Sports', location: 'Whistler', description: 'World-renowned ski terrain, snowboarding, alpine villages, and year-round mountain activities.', estimated_budget: 2100, best_visit_season: 'December to March', average_rating: 4.8, views: 590, images: [u('photo-1551524559-8af4e6624178'), u('photo-1486496146582-9ffcd0b2b2b7')] },
  { name: 'Aspen Alpine Getaway', category: 'Winter Sports', location: 'Aspen', description: 'Premier ski slopes, charming mountain town vibes, and upscale winter experiences in Colorado.', estimated_budget: 2700, best_visit_season: 'December to March', average_rating: 4.7, views: 540, images: [u('photo-1605540436563-5bca919ae766'), u('photo-1454496522488-7a8e488e8606')] },
  { name: 'Zermatt Matterhorn Skiing', category: 'Winter Sports', location: 'Zermatt', description: 'Ski beneath the iconic Matterhorn with breathtaking alpine scenery and car-free village charm.', estimated_budget: 2900, best_visit_season: 'December to April', average_rating: 4.9, views: 610, images: [u('photo-1483921020237-2ff51e8e4b22'), u('photo-1519659528534-7fd733a832a0')] },
  { name: 'Niseko Powder Paradise', category: 'Winter Sports', location: 'Niseko', description: 'Famous for legendary powder snow, onsens, and a unique blend of Japanese culture and winter sports.', estimated_budget: 2300, best_visit_season: 'December to March', average_rating: 4.8, views: 480, images: [u('photo-1548777123-e216912df7d8'), u('photo-1517483000871-1dbf64a6e1c6')] },
  { name: 'Chamonix Mont Blanc', category: 'Winter Sports', location: 'Chamonix', description: 'A legendary alpine destination offering skiing, mountaineering, and stunning views of Mont Blanc.', estimated_budget: 2200, best_visit_season: 'December to March', average_rating: 4.8, views: 560, images: [u('photo-1486870591958-9b9d0d1dda99'), u('photo-1418985991508-e47386d96a71')] },
  { name: 'Banff Winter Wonderland', category: 'Winter Sports', location: 'Banff', description: 'Snowy peaks, frozen lakes, and cozy mountain lodges make Banff a magical winter sports destination.', estimated_budget: 2000, best_visit_season: 'December to March', average_rating: 4.7, views: 430, images: [u('photo-1482192505345-5655af888cc4'), u('photo-1519681393784-d120267933ba')] },

  // Adventure (6)
  { name: 'Queenstown Extreme Adventures', category: 'Adventure', location: 'Queenstown', description: 'Bungee jumping, jet boating, skydiving, and alpine thrills in the adventure capital of the world.', estimated_budget: 2100, best_visit_season: 'December to February', average_rating: 4.9, views: 770, images: [u('photo-1504280390367-361c6d9f38f4'), u('photo-1530789253388-582c481c54b0')] },
  { name: 'Patagonia Trekking Expedition', category: 'Adventure', location: 'Patagonia', description: 'Epic hikes, glacier treks, and remote landscapes for serious adventure seekers.', estimated_budget: 3000, best_visit_season: 'November to March', average_rating: 4.9, views: 460, images: [u('photo-1469474968028-56623f02e42e'), u('photo-1500530855697-b586d89ba3ee')] },
  { name: 'Interlaken Paragliding & Canyons', category: 'Adventure', location: 'Interlaken', description: 'Paragliding over turquoise lakes, canyoning, and adrenaline-filled alpine adventures.', estimated_budget: 2200, best_visit_season: 'May to September', average_rating: 4.8, views: 520, images: [u('photo-1476611338391-6f395a0ebc7b'), u('photo-1441974231531-c6227db76b6e')] },
  { name: 'Maui Volcano & Ocean Adventures', category: 'Adventure', location: 'Maui', description: 'Snorkeling, surfing, and sunrise hikes at Haleakalā for unforgettable island adventures.', estimated_budget: 2300, best_visit_season: 'April to October', average_rating: 4.7, views: 450, images: [u('photo-1500375592092-40eb2168fd21'), u('photo-1468413253725-0d5181091126')] },
  { name: 'Cape Town Mountain & Sea', category: 'Adventure', location: 'Cape Town', description: 'Hike Table Mountain, dive with sharks, and explore dramatic coastlines around Cape Town.', estimated_budget: 1700, best_visit_season: 'November to March', average_rating: 4.8, views: 690, images: [u('photo-1580060839134-75a5edca2e99'), u('photo-1576485290814-1c72aa4bbb8e')] },
  { name: 'Sedona Red Rock Adventures', category: 'Adventure', location: 'Sedona', description: 'Red rock formations, scenic trails, jeep tours, and stargazing in Arizona’s desert landscape.', estimated_budget: 1400, best_visit_season: 'March to May, September to November', average_rating: 4.7, views: 410, images: [u('photo-1469854523086-cc02fe5d8800'), u('photo-1474044159687-1ee9f3a51722')] },

  // City Break (6)
  { name: 'Dubai Modern Metropolis', category: 'City Break', location: 'Dubai', description: 'Futuristic skyline, luxury shopping, desert experiences, and world-class entertainment.', estimated_budget: 2000, best_visit_season: 'November to March', average_rating: 4.7, views: 940, images: [u('photo-1512453979798-5ea266f8880c'), u('photo-1518684079-3c830dcef090')] },
  { name: 'Paris City of Lights', category: 'City Break', location: 'Paris', description: 'Iconic landmarks, art, cuisine, and romantic streets in one of the world’s most beloved cities.', estimated_budget: 1900, best_visit_season: 'April to June, September to October', average_rating: 4.8, views: 1150, images: [u('photo-1502602898657-3e91760cbb34'), u('photo-1499856871958-5b9627545d1a')] },
  { name: 'New York City Highlights', category: 'City Break', location: 'New York City', description: 'Skyscrapers, Broadway, world-class museums, diverse neighborhoods, and nonstop urban energy.', estimated_budget: 2200, best_visit_season: 'April to June, September to November', average_rating: 4.7, views: 1080, images: [u('photo-1496442226666-8d4d0e62e6e9'), u('photo-1522083165195-3424ed129620')] },
  { name: 'Singapore Urban Oasis', category: 'City Break', location: 'Singapore', description: 'A clean, green, and futuristic city known for Gardens by the Bay, food culture, and vibrant districts.', estimated_budget: 1800, best_visit_season: 'February to April', average_rating: 4.8, views: 760, images: [u('photo-1525625293386-3f8f99389edd'), u('photo-1508964942454-1a56651d54ac')] },
  { name: 'Barcelona Art & Coast', category: 'City Break', location: 'Barcelona', description: 'Gaudí architecture, Mediterranean beaches, lively markets, and rich Catalan culture.', estimated_budget: 1600, best_visit_season: 'May to June, September', average_rating: 4.7, views: 840, images: [u('photo-1583422409516-2895a77efded'), u('photo-1464790719320-516ecd75af6c')] },
  { name: 'Istanbul City Discovery', category: 'City Break', location: 'Istanbul', description: 'Historic mosques, bustling bazaars, waterfront views, and a dynamic blend of old and new.', estimated_budget: 1200, best_visit_season: 'April to May, September to November', average_rating: 4.7, views: 670, images: [u('photo-1527838832700-5059252407fa'), u('photo-1524231757912-21f4fe3a7200')] },

  // Wildlife & Safari (5)
  { name: 'Serengeti Safari Experience', category: 'Wildlife & Safari', location: 'Serengeti', description: 'Witness the Great Migration and incredible wildlife across Tanzania’s iconic savannah.', estimated_budget: 3500, best_visit_season: 'June to October', average_rating: 4.9, views: 580, images: [u('photo-1516426122078-c23e76319801'), u('photo-1547471080-7cc2caa01a7e')] },
  { name: 'Kruger National Park Safari', category: 'Wildlife & Safari', location: 'Kruger', description: 'One of Africa’s largest game reserves, home to the Big Five and diverse ecosystems.', estimated_budget: 2800, best_visit_season: 'May to September', average_rating: 4.8, views: 520, images: [u('photo-1493246507139-91e8fad9978e'), u('photo-1549366021-9f761d450615')] },
  { name: 'Masai Mara Wildlife Plains', category: 'Wildlife & Safari', location: 'Masai Mara', description: 'Renowned for abundant wildlife, big cats, and breathtaking savannah landscapes in Kenya.', estimated_budget: 3200, best_visit_season: 'July to October', average_rating: 4.9, views: 540, images: [u('photo-1534177616072-ef7dc120449d'), u('photo-1547970810-dc1eac37d174')] },
  { name: 'Amazon Rainforest Expedition', category: 'Wildlife & Safari', location: 'Amazon Basin', description: 'Explore unparalleled biodiversity, river journeys, and lush rainforest ecosystems in the Amazon.', estimated_budget: 2600, best_visit_season: 'June to November', average_rating: 4.7, views: 390, images: [u('photo-1516026672322-bc52d61a55d5'), u('photo-1441974231531-c6227db76b6e')] },
  { name: 'Cape Town Wildlife & Coast', category: 'Wildlife & Safari', location: 'Cape Town', description: 'Combine coastal beauty with nearby reserves for penguins, marine life, and safari day trips.', estimated_budget: 1900, best_visit_season: 'November to March', average_rating: 4.6, views: 430, images: [u('photo-1502082553048-f009c37129b9'), u('photo-1473448912268-2022ce9509d8')] },

  // Wellness & Retreat (5)
  { name: 'Ubud Wellness Retreat', category: 'Wellness & Retreat', location: 'Ubud', description: 'Lush jungles, yoga retreats, holistic spas, and tranquil rice terraces in Bali’s cultural heart.', estimated_budget: 1300, best_visit_season: 'April to October', average_rating: 4.8, views: 620, images: [u('photo-1544161515-4ab6ce6db874'), u('photo-1506126613408-eca07ce68773')] },
  { name: 'Sedona Spiritual Escape', category: 'Wellness & Retreat', location: 'Sedona', description: 'A serene desert retreat known for red rocks, wellness experiences, and restorative landscapes.', estimated_budget: 1500, best_visit_season: 'March to May, September to November', average_rating: 4.7, views: 360, images: [u('photo-1469474968028-56623f02e42e'), u('photo-1500534314209-a25ddb2bd429')] },
  { name: 'Kerala Backwaters Retreat', category: 'Wellness & Retreat', location: 'Kerala Backwaters', description: 'Peaceful houseboat journeys, Ayurvedic wellness, and lush waterways in southern India.', estimated_budget: 1100, best_visit_season: 'September to March', average_rating: 4.7, views: 400, images: [u('photo-1602216056096-3b40cc0c9944'), u('photo-1593693397690-362cb9666fc2')] },
  { name: 'Maldives Serenity Retreat', category: 'Wellness & Retreat', location: 'Maldives', description: 'Private island relaxation, spa experiences, and calm turquoise lagoons for total rejuvenation.', estimated_budget: 3400, best_visit_season: 'November to April', average_rating: 4.9, views: 500, images: [u('photo-1540202404-a2f29016b523'), u('photo-1559827260-dc66d52bef19')] },
  { name: 'Phuket Wellness & Beaches', category: 'Wellness & Retreat', location: 'Phuket', description: 'Beachfront relaxation, wellness resorts, and tropical scenery for a restorative getaway.', estimated_budget: 1200, best_visit_season: 'November to April', average_rating: 4.6, views: 340, images: [u('photo-1519046904884-53103b34b206'), u('photo-1506953823976-52e1fdc0149a')] },
];

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gtour';
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected to MongoDB');

  const categoryMap = new Map<string, mongoose.Types.ObjectId>();
  for (const c of categoriesData) {
    const doc = await Category.findOneAndUpdate(
      { name: c.name },
      { $setOnInsert: { name: c.name, description: c.description } },
      { upsert: true, new: true }
    );
    // if existed without description, keep as-is; ensure in map
    const existing = await Category.findOne({ name: c.name });
    categoryMap.set(c.name, (existing!._id as mongoose.Types.ObjectId));
  }
  console.log(`Categories ready: ${categoryMap.size}`);

  const locationMap = new Map<string, mongoose.Types.ObjectId>();
  for (const l of locationsData) {
    const existing = await Location.findOne({ name: l.name, country: l.country });
    if (existing) {
      locationMap.set(`${l.name}|${l.country}`, existing._id as mongoose.Types.ObjectId);
    } else {
      const doc = await Location.create(l);
      locationMap.set(`${l.name}|${l.country}`, doc._id as mongoose.Types.ObjectId);
    }
  }
  console.log(`Locations ready: ${locationMap.size}`);

  let created = 0;
  let skipped = 0;
  for (const d of destinationsData) {
    const exists = await Destination.findOne({ name: d.name });
    if (exists) { skipped++; continue; }
    const categoryId = categoryMap.get(d.category);
    const loc = locationsData.find((l) => l.name === d.location);
    const locationId = loc ? locationMap.get(`${loc.name}|${loc.country}`) : undefined;
    if (!categoryId || !locationId) {
      console.warn(`Skipping ${d.name}: missing category/location mapping`);
      continue;
    }
    await Destination.create({
      name: d.name,
      description: d.description,
      images: d.images,
      estimated_budget: d.estimated_budget,
      best_visit_season: d.best_visit_season,
      average_rating: d.average_rating,
      views: d.views,
      category_id: categoryId,
      location_id: locationId,
      archived_at: null,
    });
    created++;
  }

  const total = await Destination.countDocuments({ archived_at: null });
  console.log(`Seed complete. Created: ${created}, Skipped (existing): ${skipped}, Total active destinations: ${total}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Seed failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
