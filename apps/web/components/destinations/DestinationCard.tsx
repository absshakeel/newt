import Image from 'next/image';
import Link from 'next/link';
import { RatingBadge } from '@gtour/ui';
import { destinationImage } from '@/lib/destination-image';
import { locationLabel, refName, type DestinationDto } from '@gtour/utils';
import { cn } from '@gtour/utils';

/**
 * Editorial destination tile. The image treatment is configurable so the same
 * card can serve as a large feature or a compact companion tile.
 */
export function DestinationCard({
  destination,
  priority = false,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  className,
  imageClassName = 'aspect-[4/5]',
  compact = false,
}: {
  destination: DestinationDto;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  compact?: boolean;
}) {
  const image = destinationImage(destination);
  const region = locationLabel(destination.location_id);
  const category = refName(destination.category_id);

  return (
    <article
      className={cn(
        'group relative isolate overflow-hidden rounded-card bg-ink-900 shadow-soft transition-shadow duration-300 ease-premium hover:shadow-lift',
        className
      )}
    >
      <div className={cn('relative w-full overflow-hidden', imageClassName)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-ink-veil" aria-hidden="true" />
      </div>

      <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
        <RatingBadge value={destination.average_rating} />
        {category ? (
          <span className="rounded-pill bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-ink-700">
            {category}
          </span>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sand-300">
          {region ?? 'Destination'}
        </p>
        <h3
          className={cn(
            'mt-1.5 font-display font-semibold text-white',
            compact ? 'text-lg' : 'text-2xl sm:text-3xl'
          )}
        >
          <Link href={`/destinations/${destination._id}`} className="focus:outline-none">
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {destination.name}
          </Link>
        </h3>
        {!compact ? (
          <p className="mt-2 line-clamp-2 max-w-sm text-sm leading-relaxed text-sand-200/90">
            {destination.description}
          </p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          Explore
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 stroke-current transition-transform duration-300 ease-premium group-hover:translate-x-1"
            fill="none"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </article>
  );
}

/** Photo-forward tile used for travel-style categories. */
export function StyleTile({
  href,
  label,
  caption,
  src,
  alt,
  className,
}: {
  href: string;
  label: string;
  caption: string;
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative isolate flex overflow-hidden rounded-card bg-ink-900 focus:outline-none',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-ink-veil" aria-hidden="true" />
      <div className="relative mt-auto w-full p-5">
        <p className="font-display text-xl font-semibold text-white">{label}</p>
        <p className="mt-1 text-xs text-sand-200/85">{caption}</p>
      </div>
    </Link>
  );
}