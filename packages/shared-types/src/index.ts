// Shared types for Global Tourism Platform

export enum UserRole {
  TOURIST = 'tourist',
  HOTEL_OWNER = 'hotel_owner',
  PHOTOGRAPHER = 'photographer',
  VEHICLE_PROVIDER = 'vehicle_provider',
  ADMIN = 'admin'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export interface User {
  _id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  role: UserRole;
  account_status: AccountStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  _id: string;
  user_id: string;
  bio?: string;
  preferred_language?: string;
  travel_preferences?: string[];
  profile_image?: string;
  date_of_birth?: Date;
  address?: string;
}

export interface Location {
  _id: string;
  name: string;
  country: string;
  region?: string;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Destination {
  _id: string;
  name: string;
  description: string;
  images: string[];
  estimated_budget?: number;
  best_visit_season?: string;
  average_rating?: number;
  views: number;
  category_id: string;
  location_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Hotel {
  _id: string;
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  images: string[];
  rating?: number;
  destination_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Room {
  _id: string;
  hotel_id: string;
  room_type: string;
  bed_type: string;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  images: string[];
  created_at: Date;
  updated_at: Date;
}

export interface RoomAvailability {
  _id: string;
  room_id: string;
  date: Date;
  available_rooms: number;
  price_override?: number;
  status: 'available' | 'unavailable' | 'partial';
  created_at: Date;
  updated_at: Date;
}

export interface Booking {
  _id: string;
  booking_reference: string;
  booking_type: 'hotel' | 'photography' | 'vehicle';
  start_date: Date;
  end_date: Date;
  guest_count: number;
  total_amount: number;
  status: BookingStatus;
  special_requests?: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  _id: string;
  booking_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_reference?: string;
  payment_status: PaymentStatus;
  payment_date?: Date;
  refund_status?: PaymentStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Photographer {
  _id: string;
  name: string;
  bio?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  rating?: number;
  destination_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PhotographyService {
  _id: string;
  photographer_id: string;
  name: string;
  description: string;
  price_per_session: number;
  duration_hours: number;
  images: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Portfolio {
  _id: string;
  photographer_id: string;
  service_id: string;
  images: string[];
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Vehicle {
  _id: string;
  name: string;
  type: string;
  capacity: number;
  price_per_day: number;
  features: string[];
  images: string[];
  provider_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface VehicleProvider {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  rating?: number;
  created_at: Date;
  updated_at: Date;
}

export interface VehicleAvailability {
  _id: string;
  vehicle_id: string;
  date: Date;
  available_units: number;
  status: 'available' | 'unavailable' | 'partial';
  created_at: Date;
  updated_at: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Client types
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
}

export interface ApiClient {
  get<T>(url: string, config?: any): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: any): Promise<ApiResponse<T>>;
}