import { images } from './images';
import type { DestinationDto } from '@gtour/utils';

const FALLBACKS: ReadonlyArray<{ src: string; alt: string }> = [
  images.destinations.santorini,
  images.destinations.kyoto,
  images.destinations.alps,
  images.destinations.bali,
  images.destinations.marrakech,
  images.styles.mountains,
  images.styles.beaches,
  images.styles.history,
  images.styles.adventure,
  images.styles.culture,
  images.styles.city,
];

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Destinations may reference photography hosted anywhere, and freshly created
 * records may not have images yet. This resolves the "hero" image for a
 * destination and always returns usable alt text.
 */
export function destinationImage(destination: DestinationDto): { src: string; alt: string } {
  const candidate = destination.images?.find((image) => typeof image === 'string' && image.trim());

  if (candidate) {
    return {
      src: candidate,
      alt: `${destination.name} — travel photography`,
    };
  }

  const fallback = FALLBACKS[hash(destination.name) % FALLBACKS.length];
  return { src: fallback.src, alt: `${destination.name} — travel photography` };
}

/** Supporting images for a destination gallery, excluding the hero image. */
export function destinationGallery(destination: DestinationDto): string[] {
  return (destination.images ?? []).filter((image) => typeof image === 'string' && image.trim());
}