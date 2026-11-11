import { StyleTile } from '@/components/destinations/DestinationCard';
import { Reveal } from '@gtour/ui';
import { images } from '@/lib/images';
import { Section, SectionHeading } from './Section';

/**
 * Section 2 — Explore Your Travel Style.
 * Categories map onto the `category_id` filter the destinations API already
 * supports, so each tile can pre-filter the listing once categories are seeded.
 */
const STYLES = [
  {
    label: 'Nature & mountains',
    caption: 'Ridgelines, lakes and quiet trails',
    src: images.styles.mountains.src,
    alt: images.styles.mountains.alt,
    href: '/destinations?search=mountain',
  },
  {
    label: 'Beaches',
    caption: 'Warm water and slow afternoons',
    src: images.styles.beaches.src,
    alt: images.styles.beaches.alt,
    href: '/destinations?search=beach',
  },
  {
    label: 'Historical places',
    caption: 'Old towns and ancient ruins',
    src: images.styles.history.src,
    alt: images.styles.history.alt,
    href: '/destinations?search=historical',
  },
  {
    label: 'Adventure',
    caption: 'Trails, climbs and long days out',
    src: images.styles.adventure.src,
    alt: images.styles.adventure.alt,
    href: '/destinations?search=adventure',
  },
  {
    label: 'Cultural experiences',
    caption: 'Markets, food and local craft',
    src: images.styles.culture.src,
    alt: images.styles.culture.alt,
    href: '/destinations?search=culture',
  },
  {
    label: 'City exploration',
    caption: 'Skylines and street corners',
    src: images.styles.city.src,
    alt: images.styles.city.alt,
    href: '/destinations?search=city',
  },
];

export default function TravelStyles() {
  return (
    <Section className="bg-sand-100">
      <SectionHeading
        eyebrow="Find your pace"
        title="Explore your travel style"
        description="Pick the kind of trip you are in the mood for and we will narrow the catalogue to match."
      />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STYLES.map((style, index) => (
          <Reveal as="li" key={style.label} delayMs={index * 70}>
            <StyleTile
              href={style.href}
              label={style.label}
              caption={style.caption}
              src={style.src}
              alt={style.alt}
              className="aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/3]"
            />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}