export interface LicensedImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const img = (src: string, alt: string, width = 1600, height = 1067): LicensedImage => ({
  src,
  alt,
  width,
  height,
});

/**
 * Curated local photography. Assets were downloaded from Wikimedia Commons with
 * verifiable free licences; per-file attribution lives in
 * `public/images/CREDITS.json` (see prompts/15 §9).
 */
export const images = {
  hero: img(
    '/images/hero.jpg',
    'Aerial view of a turquoise lagoon and beach at a tropical island resort',
    1920,
    1097
  ),
  inspiration: img(
    '/images/inspiration.jpg',
    'Northern lights glowing green over a snowy Icelandic landscape',
    1600,
    900
  ),
  auth: img('/images/auth.jpg', 'View over the clouds from an aeroplane window at sunset', 1600, 1067),
  destinations: {
    santorini: img(
      '/images/santorini.jpg',
      'Whitewashed houses and blue domes above the Santorini caldera, Greece'
    ),
    kyoto: img('/images/kyoto.jpg', 'Rows of vermilion torii gates along a wooded shrine path in Kyoto, Japan'),
    alps: img('/images/alps.jpg', 'Snow-capped Alpine peaks reflected in a still mountain lake'),
    bali: img('/images/bali.jpg', 'Terraced green rice fields in the Bali highlands, Indonesia'),
    marrakech: img(
      '/images/marrakech.jpg',
      'Rooftops and minarets of the Marrakech medina in warm afternoon light, Morocco'
    ),
  },
  styles: {
    mountains: img('/images/style-mountains.jpg', 'Jagged mountain ridgeline lit by sunrise in the Dolomites'),
    beaches: img('/images/style-beaches.jpg', 'Palm trees leaning over a white sand beach and clear turquoise water'),
    history: img('/images/style-history.jpg', 'Ancient stone amphitheatre arches in warm afternoon light'),
    adventure: img('/images/style-adventure.jpg', 'Hiker with a backpack walking a high mountain trail'),
    culture: img('/images/style-culture.jpg', 'Colourful stalls and crowds in a traditional market street'),
    city: img('/images/style-city.jpg', 'City skyline glowing at dusk seen from above the rooftops'),
  },
  stays: {
    resort: img('/images/stay-resort.jpg', 'Swimming pool and sun loungers at a resort looking out to sea'),
    room: img('/images/stay-room.jpg', 'Bright hotel suite with a large bed and soft natural light'),
    terrace: img('/images/stay-terrace.jpg', 'Hotel terrace with seating overlooking a calm bay'),
  },
  services: {
    hotel: img('/images/service-hotel.jpg', 'Warmly lit hotel lobby and reception desk'),
    photographer: img('/images/service-photographer.jpg', 'Photographer holding a camera while shooting outdoors'),
    vehicle: img('/images/service-vehicle.jpg', 'Camper van parked beside a scenic mountain road'),
  },
} as const;
