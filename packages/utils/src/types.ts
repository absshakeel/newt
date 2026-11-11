import type { ApiResponse } from '@gtour/shared-types';

export type { ApiResponse };

export interface PopulatedCategory {
  _id: string;
  name: string;
  icon?: string;
}

export interface PopulatedLocation {
  _id: string;
  name: string;
  country: string;
  region?: string;
}

export interface DestinationDto {
  _id: string;
  name: string;
  description: string;
  images: string[];
  estimated_budget?: number;
  best_visit_season?: string;
  average_rating?: number;
  views: number;
  category_id: PopulatedCategory | string;
  location_id: PopulatedLocation | string;
  created_at: string;
  updated_at: string;
}

export interface DestinationsResponse {
  success: boolean;
  destinations: DestinationDto[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DestinationFiltersResponse {
  success: boolean;
  categories: PopulatedCategory[];
  locations: PopulatedLocation[];
}

export interface DestinationResponse {
  success: boolean;
  destination: DestinationDto;
}

export interface HotelDto {
  _id: string;
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  images: string[];
  rating?: number;
  destination_id: { _id: string; name: string } | string;
  created_at: string;
  updated_at: string;
}

export interface HotelsResponse {
  success: boolean;
  hotels: HotelDto[];
}

export interface RoomDto {
  _id: string;
  hotel_id: string;
  room_type: string;
  bed_type: string;
  capacity: number;
  price_per_night: number;
  amenities?: string[];
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface RoomsResponse {
  success: boolean;
  rooms: RoomDto[];
}

export interface PhotographerDto {
  _id: string;
  name: string;
  bio?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  rating?: number;
  destination_id?: { _id: string; name: string } | string;
  created_at: string;
  updated_at: string;
}

export interface PhotographersResponse {
  success: boolean;
  photographers: PhotographerDto[];
}

export interface PhotographyServiceDto {
  _id: string;
  photographer_id: string;
  service_type: string;
  description?: string;
  price: number;
  duration_hours?: number;
  images?: string[];
}

export interface VehicleDto {
  _id: string;
  name: string;
  type: string;
  capacity: number;
  price_per_day: number;
  features?: string[];
  images?: string[];
  provider_id: { _id: string; name: string } | string;
  created_at: string;
  updated_at: string;
}

export interface VehiclesResponse {
  success: boolean;
  vehicles: VehicleDto[];
}

export interface AuthUserDto {
  id: string;
  email: string;
  name: string;
  role: string;
  account_status: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: AuthUserDto;
    token: string;
  };
}

/** Narrow a possibly-populated reference to its display name. */
export function refName(value: { name?: string } | string | null | undefined): string | undefined {
  if (!value || typeof value === 'string') return undefined;
  return value.name;
}

/** Region + country label for a possibly-populated location reference. */
export function locationLabel(
  value: PopulatedLocation | string | null | undefined
): string | undefined {
  if (!value || typeof value === 'string') return undefined;
  return [value.region, value.country].filter(Boolean).join(', ') || value.name;
}
