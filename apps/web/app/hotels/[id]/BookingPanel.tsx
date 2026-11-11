'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '@gtour/ui';
import { Field, Input, Select, Textarea } from '@gtour/ui';
import { apiClient, getApiErrorMessage } from '@gtour/utils';
import { dateInputToIso, formatCurrency, nightsBetween, toDateInputValue } from '@/lib/format';
import { readToken, readUser } from '@gtour/utils';
import type { AuthUserDto, RoomDto } from '@gtour/utils';

interface BookingResponse {
  success: boolean;
  booking: {
    _id: string;
    booking_reference: string;
    status: string;
    total_amount: number;
    start_date: string;
    end_date: string;
  };
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : DATE_FORMAT.format(date);
}

/**
 * Hotel booking panel. Availability and pricing are decided by the server, so
 * the panel only shows an estimate and never claims a booking is confirmed
 * until `POST /bookings` returns.
 */
export default function BookingPanel({ rooms }: { rooms: RoomDto[] }) {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [roomId, setRoomId] = useState(rooms[0]?._id ?? '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<BookingResponse['booking'] | null>(null);

  const today = useMemo(() => toDateInputValue(new Date()), []);

  useEffect(() => {
    setSignedIn(Boolean(readToken()));
    setUser(readUser());
  }, []);

  const room = rooms.find((item) => item._id === roomId) ?? rooms[0];
  const nights = nightsBetween(startDate, endDate);
  const estimate = room && nights ? room.price_per_night * nights : undefined;
  const maxGuests = room?.capacity ?? 1;
  const canSubmit = signedIn === true && Boolean(user);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError('Sign in to send a booking request.');
      return;
    }
    if (!room) {
      setError('Select a room type to continue.');
      return;
    }
    if (!nights) {
      setError('Choose a check-in and check-out date; check-out must be after check-in.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await apiClient.post<BookingResponse>(
        '/bookings',
        {
          booking_type: 'hotel',
          hotel_room_id: room._id,
          start_date: dateInputToIso(startDate),
          end_date: dateInputToIso(endDate),
          guest_count: Number(guestCount) || 1,
          total_amount: room.price_per_night * nights,
          special_requests: specialRequests.trim() || undefined,
          // The API replaces this with the authenticated user; the request
          // schema still requires the field, so the signed-in id is sent.
          user_id: user?.id ?? '',
        },
        { headers: { Authorization: `Bearer ${readToken() ?? ''}` } }
      );

      setConfirmed(data.booking);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="rounded-panel border border-sea-200 bg-sea-100/60 p-6">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sea-700">
          Booking recorded
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900">
          Reference {confirmed.booking_reference}
        </h2>
        <dl className="mt-5 space-y-2 text-sm text-ink-700">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Room</dt>
            <dd className="font-medium">{room?.room_type ?? '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Dates</dt>
            <dd className="font-medium">
              {formatDate(confirmed.start_date)} → {formatDate(confirmed.end_date)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Recorded price</dt>
            <dd className="font-medium">{formatCurrency(confirmed.total_amount) ?? '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Status</dt>
            <dd className="font-medium capitalize">{confirmed.status}</dd>
          </div>
        </dl>
        <p className="mt-5 text-xs leading-relaxed text-ink-500">
          No card details are collected here — payment is arranged separately. Keep this reference
          for support.
        </p>
        <div className="mt-5 flex flex-wrap gap-5">
          <Link
            href="/destinations"
            className="text-sm font-semibold text-sea-700 underline-offset-4 hover:underline"
          >
            Keep exploring destinations
          </Link>
          <button
            type="button"
            onClick={() => {
              setConfirmed(null);
              setStartDate('');
              setEndDate('');
              setSpecialRequests('');
            }}
            className="text-sm font-semibold text-ink-600 underline-offset-4 hover:underline"
          >
            Book another room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-panel border border-ink-100 bg-white p-6 shadow-soft">
      <h2 className="font-display text-xl font-semibold text-ink-900">Check availability</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        Send a booking request for this stay. Availability is verified on the server against room
        inventory before the booking is recorded.
      </p>

      {signedIn === false ? (
        <div className="mt-5 rounded-2xl border border-sea-200 bg-sea-100/50 p-4 text-sm">
          <p className="font-semibold text-ink-900">Sign in to book</p>
          <p className="mt-1 text-ink-600">
            Bookings are tied to your account so you can manage them later.
          </p>
          <p className="mt-4 flex flex-wrap gap-5 font-semibold">
            <Link href="/login" className="text-sea-700 underline-offset-4 hover:underline">
              Sign in
            </Link>
            <Link href="/register" className="text-sea-700 underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-terracotta-200 bg-terracotta-100/60 px-4 py-3 text-sm text-terracotta-700"
          >
            {error}
          </div>
        ) : null}

        <Field label="Room type" htmlFor="booking-room">
          <Select
            id="booking-room"
            value={roomId}
            onChange={(event) => {
              setRoomId(event.target.value);
              setGuestCount('1');
            }}
          >
            {rooms.map((item) => {
              const price = formatCurrency(item.price_per_night);
              return (
                <option key={item._id} value={item._id}>
                  {item.room_type} — {item.bed_type}, sleeps {item.capacity}
                  {price ? ` · ${price}/night` : ''}
                </option>
              );
            })}
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Check-in" htmlFor="booking-start">
            <Input
              id="booking-start"
              type="date"
              min={today}
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </Field>
          <Field label="Check-out" htmlFor="booking-end">
            <Input
              id="booking-end"
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Guests"
          htmlFor="booking-guests"
          hint={`This room sleeps up to ${maxGuests}.`}
        >
          <Input
            id="booking-guests"
            type="number"
            min={1}
            max={maxGuests}
            value={guestCount}
            onChange={(event) => setGuestCount(event.target.value)}
          />
        </Field>

        <Field
          label="Special requests"
          htmlFor="booking-notes"
          hint="Optional — arrival times, accessibility needs, or room preferences."
        >
          <Textarea
            id="booking-notes"
            maxLength={500}
            value={specialRequests}
            onChange={(event) => setSpecialRequests(event.target.value)}
            placeholder="Late arrival, cot requested, high floor..."
          />
        </Field>

        <div className="rounded-2xl bg-sand-100 px-4 py-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-ink-600">
              {nights ? `${nights} night${nights === 1 ? '' : 's'}` : 'Select dates'}
            </span>
            <span className="font-display text-lg font-semibold text-ink-900">
              {formatCurrency(estimate) ?? '—'}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-500">
            Estimate only. Availability and the final price are confirmed by the server.
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting || rooms.length === 0}
        >
          {submitting ? 'Sending request...' : 'Request this room'}
        </Button>
        {signedIn === false ? (
          <p className="text-center text-xs text-ink-500">
            You will be asked to sign in before the request is sent.
          </p>
        ) : null}
      </form>
    </div>
  );
}