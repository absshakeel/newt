import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookingPanel from './BookingPanel';
import { RoomCard } from '@/components/hotels/RoomCard';
import { RatingBadge } from '@gtour/ui';
import { ButtonLink } from '@gtour/ui';
import { EmptyState } from '@gtour/ui';
import { Reveal } from '@gtour/ui';
import { formatNumber } from '@/lib/format';
import { images } from '@/lib/images';
import { fetchHotel, fetchRoomsByHotel } from '@/lib/server-api';
import { refName } from '@gtour/utils';

export const revalidate = 120;

type PageProps = { params: Promise<{ id: string }> };

const STAY_FALLBACKS = [images.stays.resort, images.stays.room, images.stays.terrace];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchHotel(id);

  if (!result.ok) return { title: 'Stay not found' };

  const hotel = result.data;

  return {
    title: hotel.name,
    description: hotel.description?.slice(0, 155) ?? `Stay at ${hotel.name} on GTour.`,
  };
}

export default async function HotelDetailPage({ params }: PageProps) {
  const { id } = await params;

  const result = await fetchHotel(id);
  if (!result.ok) notFound();

  const hotel = result.data;
  const roomsResult = await fetchRoomsByHotel(hotel._id);
  const rooms = roomsResult.ok ? roomsResult.data : [];

  const destination = refName(hotel.destination_id);
  const uploaded = (hotel.images ?? []).filter(
    (image): image is string => typeof image === 'string' && image.trim().length > 0
  );

  const gallery = uploaded.length > 0 ? uploaded.slice(0, 4) : [];
  const heroImage =
    gallery[0] ?? STAY_FALLBACKS[hotel.name.length % STAY_FALLBACKS.length].src;
  const heroAlt = `${hotel.name} — accommodation photography`;
  const supporting = gallery.filter((image) => image !== heroImage);

  const cheapestRoom = rooms
    .map((room) => room.price_per_night)
    .filter((price) => typeof price === 'number' && price > 0)
    .sort((a, b) => a - b)[0];

  return (
    <article>
      <header className="relative isolate min-h-[52vh] w-full overflow-hidden bg-ink-900">
        <Image src={heroImage} alt={heroAlt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink-veil" aria-hidden="true" />

        <div className="gtour-container relative flex min-h-[52vh] flex-col justify-end pb-12 pt-28">
          <nav aria-label="Breadcrumb" className="text-xs text-sand-200/85">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/hotels" className="hover:text-white">
                  Stays
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">
                {hotel.name}
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-pill bg-white/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-700">
              {destination ?? 'Stay'}
            </span>
            <RatingBadge value={hotel.rating} />
          </div>

          <h1 className="mt-4 max-w-3xl text-balance font-display text-display-sm font-semibold text-white sm:text-display">
            {hotel.name}
          </h1>

          {hotel.address ? (
            <p className="mt-3 max-w-2xl text-sm text-sand-200/90">{hotel.address}</p>
          ) : null}
        </div>
      </header>

      <section className="gtour-section">
        <div className="gtour-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="gtour-eyebrow">The property</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900">
              About this stay
            </h2>
            <p className="mt-6 whitespace-pre-line text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
              {hotel.description}
            </p>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-card border border-ink-100 bg-white/80 px-5 py-4">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
                  Rating
                </dt>
                <dd className="mt-1.5 font-display text-lg font-semibold text-ink-900">
                  {hotel.rating ? `${hotel.rating.toFixed(1)} / 5` : 'Not rated yet'}
                </dd>
              </div>
              <div className="rounded-card border border-ink-100 bg-white/80 px-5 py-4">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
                  Room types
                </dt>
                <dd className="mt-1.5 font-display text-lg font-semibold text-ink-900">
                  {formatNumber(rooms.length)}
                </dd>
              </div>
              <div className="rounded-card border border-ink-100 bg-white/80 px-5 py-4">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
                  From
                </dt>
                <dd className="mt-1.5 font-display text-lg font-semibold text-ink-900">
                  {typeof cheapestRoom === 'number'
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(cheapestRoom)
                    : 'On request'}
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-400">
                Contact
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-ink-700">
                {hotel.address ? (
                  <li>
                    <span className="text-ink-500">Address:</span> {hotel.address}
                  </li>
                ) : null}
                {hotel.phone ? (
                  <li>
                    <span className="text-ink-500">Phone:</span>{' '}
                    <a className="text-sea-700 underline-offset-4 hover:underline" href={`tel:${hotel.phone}`}>
                      {hotel.phone}
                    </a>
                  </li>
                ) : null}
                {hotel.email ? (
                  <li>
                    <span className="text-ink-500">Email:</span>{' '}
                    <a className="text-sea-700 underline-offset-4 hover:underline" href={`mailto:${hotel.email}`}>
                      {hotel.email}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>

            {supporting.length > 0 ? (
              <div className="mt-10">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-400">
                  Gallery
                </h3>
                <ul className="mt-4 grid grid-cols-2 gap-4">
                  {supporting.map((image, index) => (
                    <li key={`${image}-${index}`} className="gtour-media relative aspect-[4/3]">
                      <Image
                        src={image}
                        alt={`${hotel.name} — property photography ${index + 2}`}
                        fill
                        sizes="(min-width: 640px) 25vw, 50vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              {rooms.length > 0 ? (
                <BookingPanel rooms={rooms} />
              ) : (
                <div className="rounded-panel border border-ink-100 bg-white p-6 shadow-soft">
                  <h2 className="font-display text-xl font-semibold text-ink-900">
                    Booking not open yet
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {roomsResult.ok
                      ? 'This property has no published room types, so booking is not available yet.'
                      : roomsResult.message}
                  </p>
                  <div className="mt-5">
                    <ButtonLink href="/hotels" variant="outline">
                      Browse other stays
                    </ButtonLink>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="hotel-rooms" className="gtour-section bg-sand-100">
        <div className="gtour-container">
          <h2 id="hotel-rooms" className="font-display text-3xl font-semibold text-ink-900">
            Rooms at {hotel.name}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-500">
            Published room types with their nightly rate. Seasonal overrides and final availability
            are applied by the server at booking time.
          </p>

          {rooms.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No room types published yet"
                description={
                  roomsResult.ok
                    ? 'This property has not published its room inventory yet. Try another stay in the meantime.'
                    : roomsResult.message
                }
                action={
                  <ButtonLink href="/hotels" variant="outline">
                    Browse stays
                  </ButtonLink>
                }
              />
            </div>
          ) : (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, index) => (
                <li key={room._id}>
                  <Reveal delayMs={Math.min(index, 5) * 70}>
                    <RoomCard room={room} className="h-full" />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </article>
  );
}