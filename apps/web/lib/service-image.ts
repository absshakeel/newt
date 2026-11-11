import { images } from './images';

const PHOTOGRAPHER_FALLBACKS = [images.services.photographer, images.styles.culture, images.styles.city];
const VEHICLE_FALLBACKS = [images.services.vehicle, images.styles.adventure, images.styles.mountains];

function pick(list: readonly { src: string; alt: string }[], seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return list[Math.abs(hash) % list.length];
}

/**
 * Resolves display photography for records that may not have uploaded images
 * yet. Returns real alt text in every branch so screen readers never announce
 * a bare file name.
 */
export function serviceImage(
  kind: 'photographer' | 'vehicle',
  record: { name: string; images?: string[]; profile_image?: string }
): { src: string; alt: string } {
  const gallery = (record.images ?? []).filter(
    (image): image is string => typeof image === 'string' && image.trim().length > 0
  );
  const candidate = record.profile_image && record.profile_image.trim() ? record.profile_image : gallery[0];

  if (candidate) {
    return { src: candidate, alt: `${record.name} — ${kind} photography` };
  }

  const fallback =
    kind === 'photographer'
      ? pick(PHOTOGRAPHER_FALLBACKS, record.name)
      : pick(VEHICLE_FALLBACKS, record.name);

  return { src: fallback.src, alt: `${record.name} — ${kind} photography` };
}
