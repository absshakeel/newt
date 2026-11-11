import Image from 'next/image';
import { Badge } from '@gtour/ui';
import { cn } from '@gtour/utils';
import { images } from '@/lib/images';
import type { RoomDto } from '@gtour/utils';

const ROOM_FALLBACKS = [images.stays.room, images.stays.resort, images.stays.terrace];

function roomImage(room: RoomDto) {
  const candidate = room.images?.find((image) => typeof image === 'string' && image.trim());
  if (candidate) return candidate;
  return ROOM_FALLBACKS[room.room_type.length % ROOM_FALLBACKS.length].src;
}

export function formatCurrency(value?: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Room listing card. Prices come from the server (`price_per_night`), never from
 * the client, and `onSelect` is only wired when a booking panel is present.
 */
export function RoomCard({
  room,
  selected = false,
  onSelect,
  className,
}: {
  room: RoomDto;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}) {
  const price = formatCurrency(room.price_per_night);
  const amenities = (room.amenities ?? []).filter(Boolean).slice(0, 5);

  const content = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
        <Image
          src={roomImage(room)}
          alt={`${room.room_type} room photography`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-900">{room.room_type}</h3>
            <p className="mt-1 text-sm text-ink-500">
              {room.bed_type} · sleeps {room.capacity}
            </p>
          </div>
          {price ? (
            <p className="shrink-0 text-right">
              <span className="font-display text-xl font-semibold text-ink-900">{price}</span>
              <span className="block text-xs text-ink-400">per night</span>
            </p>
          ) : null}
        </div>

        {amenities.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <li key={amenity}>
                <Badge tone="neutral">{amenity}</Badge>
              </li>
            ))}
          </ul>
        ) : null}

        {onSelect ? (
          <p className="mt-auto pt-2 text-xs font-semibold uppercase tracking-[0.16em] text-sea-700">
            {selected ? 'Selected for booking' : 'Select this room'}
          </p>
        ) : null}
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          'group flex h-full w-full flex-col overflow-hidden rounded-card border bg-white text-left shadow-soft transition-all duration-300 ease-premium hover:shadow-lift',
          selected ? 'border-sea-500 ring-2 ring-sea-500/30' : 'border-ink-100',
          className
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-card border border-ink-100 bg-white shadow-soft',
        className
      )}
    >
      {content}
    </article>
  );
}

export { roomImage as resolveRoomImage };