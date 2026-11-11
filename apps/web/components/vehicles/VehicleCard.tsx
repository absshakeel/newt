import Image from 'next/image';
import { Badge } from '@gtour/ui';
import { cn } from '@gtour/utils';
import { formatCurrency } from '@/lib/format';
import { serviceImage } from '@/lib/service-image';
import { refName, type VehicleDto } from '@gtour/utils';

/**
 * Vehicle card. Pricing is real (`price_per_day`) — vehicle listings are
 * ordered cheapest first by the API.
 */
export function VehicleCard({ vehicle, className }: { vehicle: VehicleDto; className?: string }) {
  const image = serviceImage('vehicle', vehicle);
  const provider = refName(vehicle.provider_id);
  const price = formatCurrency(vehicle.price_per_day);

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-card border border-ink-100 bg-white shadow-soft',
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-pill bg-white/95 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-ink-800">
          {vehicle.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-900">{vehicle.name}</h3>
            <p className="mt-1 text-sm text-ink-500">
              Seats {vehicle.capacity}
              {provider ? ` · provided by ${provider}` : ''}
            </p>
          </div>
          {price ? (
            <p className="shrink-0 text-right">
              <span className="font-display text-xl font-semibold text-ink-900">{price}</span>
              <span className="block text-xs text-ink-400">per day</span>
            </p>
          ) : null}
        </div>

        {vehicle.features && vehicle.features.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {vehicle.features.slice(0, 5).map((feature) => (
              <li key={feature}>
                <Badge tone="neutral">{feature}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}