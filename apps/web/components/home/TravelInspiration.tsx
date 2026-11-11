import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@gtour/ui';
import { images } from '@/lib/images';
import { destinationImage } from '@/lib/destination-image';
import { locationLabel } from '@gtour/utils';
import type { DestinationDto } from '@gtour/utils';

/** Section 5 — Travel Inspiration: immersive editorial spread. */
export default function TravelInspiration({
  destination,
}: {
  destination?: DestinationDto;
}) {
  const image = destination
    ? destinationImage(destination)
    : { src: images.inspiration.src, alt: images.inspiration.alt };

  const href = destination ? `/destinations/${destination._id}` : '/destinations';
  const region = destination ? locationLabel(destination.location_id) : 'Northern latitudes';

  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative min-h-[30rem] w-full sm:min-h-[34rem] lg:min-h-[38rem]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,19,31,0.9)_0%,rgba(8,19,31,0.62)_45%,rgba(8,19,31,0.15)_100%)]"
          aria-hidden="true"
        />

        <div className="gtour-container relative flex min-h-[30rem] flex-col justify-end py-14 sm:min-h-[34rem] sm:py-16 lg:min-h-[38rem] lg:py-20">
          <Reveal className="max-w-xl">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sand-300">
              Travel inspiration
            </p>
            <h2 className="mt-4 text-balance font-display text-display-sm font-semibold text-white">
              {destination
                ? `Go slowly through ${destination.name}.`
                : 'Some places are worth the long way round.'}
            </h2>
            <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-sand-200/90">
              {destination?.description ??
                'Editorial notes on where to go, when to go, and how to make the most of the quiet hours in between.'}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href={href}
                className="inline-flex h-11 items-center rounded-pill bg-white px-6 text-sm font-semibold text-ink-900 transition-transform duration-200 ease-premium hover:-translate-y-0.5"
              >
                {destination ? `Explore ${destination.name}` : 'Browse destinations'}
              </Link>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-300">
                {region}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}