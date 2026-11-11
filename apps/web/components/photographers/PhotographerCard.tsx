import Image from 'next/image';
import { Badge, RatingBadge } from '@gtour/ui';
import { cn } from '@gtour/utils';
import { serviceImage } from '@/lib/service-image';
import { refName, type PhotographerDto } from '@gtour/utils';

/**
 * Photographer card. Deliberately not a link: photographer profile routes are
 * not part of the current API surface, and §5 forbids controls that lead
 * nowhere.
 */
export function PhotographerCard({
  photographer,
  className,
}: {
  photographer: PhotographerDto;
  className?: string;
}) {
  const image = serviceImage('photographer', photographer);
  const destination = refName(photographer.destination_id);

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-card border border-ink-100 bg-white shadow-soft',
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <RatingBadge value={photographer.rating} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sea-600">
            {destination ?? 'Available for travel'}
          </p>
          <h3 className="mt-1.5 font-display text-xl font-semibold text-ink-900">
            {photographer.name}
          </h3>
        </div>

        {photographer.bio ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-ink-500">{photographer.bio}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Badge tone="neutral">Photography</Badge>
          {destination ? <Badge tone="neutral">{destination}</Badge> : null}
        </div>
      </div>
    </article>
  );
}