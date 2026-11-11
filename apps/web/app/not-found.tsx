import { ButtonLink } from '@gtour/ui';

export default function NotFound() {
  return (
    <div className="gtour-section">
      <div className="gtour-container flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="gtour-eyebrow">404</p>
        <h1 className="mt-3 max-w-2xl text-balance font-display text-display-sm font-semibold text-ink-900">
          This route is not on our map
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-500">
          The page you were looking for has moved or was never published. Start from the destinations
          we have live today, or head back to the home page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/destinations">Browse destinations</ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}