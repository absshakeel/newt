// Validation schemas for Global Tourism Platform

import { z } from 'zod';
import { UserRole, BookingStatus, PaymentStatus, AccountStatus } from '@gtour/shared-types';

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).optional().default(UserRole.TOURIST),
  account_status: z.nativeEnum(AccountStatus).optional().default(AccountStatus.PENDING_VERIFICATION)
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  preferred_language: z.string().optional(),
  travel_preferences: z.array(z.string()).optional(),
  profile_image: z.string().url('Invalid image URL').optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional()
});

// Destination validation schemas
export const createDestinationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  estimated_budget: z.number().positive('Budget must be positive').optional(),
  best_visit_season: z.string().optional(),
  category_id: z.string().min(1, 'Category ID is required'),
  location_id: z.string().min(1, 'Location ID is required')
});

export const updateDestinationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').optional(),
  estimated_budget: z.number().positive('Budget must be positive').optional(),
  best_visit_season: z.string().optional(),
  category_id: z.string().min(1, 'Category ID is required').optional(),
  location_id: z.string().min(1, 'Location ID is required').optional()
});

// Hotel validation schemas
export const createHotelSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  rating: z.number().min(0).max(5).optional(),
  destination_id: z.string().min(1, 'Destination ID is required')
});

export const updateHotelSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').optional(),
  rating: z.number().min(0).max(5).optional(),
  destination_id: z.string().min(1, 'Destination ID is required').optional()
});

// Room validation schemas
export const createRoomSchema = z.object({
  hotel_id: z.string().min(1, 'Hotel ID is required'),
  room_type: z.string().min(2, 'Room type must be at least 2 characters'),
  bed_type: z.string().min(2, 'Bed type must be at least 2 characters'),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
  price_per_night: z.number().positive('Price must be positive'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  images: z.array(z.string().url()).min(1, 'At least one image is required')
});

export const updateRoomSchema = z.object({
  room_type: z.string().min(2, 'Room type must be at least 2 characters').optional(),
  bed_type: z.string().min(2, 'Bed type must be at least 2 characters').optional(),
  capacity: z.number().int().positive('Capacity must be a positive integer').optional(),
  price_per_night: z.number().positive('Price must be positive').optional(),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required').optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').optional()
});

// Booking validation schemas
export const createBookingSchema = z.object({
  booking_type: z.enum(['hotel', 'photography', 'vehicle']),
  start_date: z.string().datetime('Invalid start date'),
  end_date: z.string().datetime('Invalid end date'),
  guest_count: z.number().int().positive('Guest count must be a positive integer'),
  total_amount: z.number().positive('Total amount must be positive'),
  special_requests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
  user_id: z.string().min(1, 'User ID is required'),
  // Polymorphic references
  hotel_room_id: z.string().optional(),
  photography_service_id: z.string().optional(),
  vehicle_id: z.string().optional()
}).refine(
  (data) => {
    // Exactly one of the polymorphic references must be provided
    const hasReference = !!data.hotel_room_id || !!data.photography_service_id || !!data.vehicle_id;
    return hasReference;
  },
  { message: 'One of hotel_room_id, photography_service_id, or vehicle_id must be provided' }
);

export const updateBookingSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  special_requests: z.string().max(500, 'Special requests must be less than 500 characters').optional()
});

// Payment validation schemas
export const createPaymentSchema = z.object({
  booking_id: z.string().min(1, 'Booking ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters').optional().default('USD'),
  payment_method: z.string().min(1, 'Payment method is required'),
  transaction_reference: z.string().optional()
});

export const updatePaymentSchema = z.object({
  payment_status: z.nativeEnum(PaymentStatus).optional(),
  transaction_reference: z.string().optional()
});

// Photographer validation schemas
export const createPhotographerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  profile_image: z.string().url('Invalid image URL').optional(),
  destination_id: z.string().optional(),
  rating: z.number().min(0).max(5).optional()
});

export const updatePhotographerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  profile_image: z.string().url('Invalid image URL').optional(),
  destination_id: z.string().optional(),
  rating: z.number().min(0).max(5).optional()
});

// Photography Service validation schemas
export const createPhotographyServiceSchema = z.object({
  photographer_id: z.string().min(1, 'Photographer ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price_per_session: z.number().positive('Price must be positive'),
  duration_hours: z.number().positive('Duration must be positive'),
  images: z.array(z.string().url()).min(1, 'At least one image is required')
});

export const updatePhotographyServiceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  price_per_session: z.number().positive('Price must be positive').optional(),
  duration_hours: z.number().positive('Duration must be positive').optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').optional()
});

// Vehicle validation schemas
export const createVehicleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.string().min(2, 'Type must be at least 2 characters'),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
  price_per_day: z.number().positive('Price must be positive'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  provider_id: z.string().min(1, 'Provider ID is required')
});

export const updateVehicleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  type: z.string().min(2, 'Type must be at least 2 characters').optional(),
  capacity: z.number().int().positive('Capacity must be a positive integer').optional(),
  price_per_day: z.number().positive('Price must be positive').optional(),
  features: z.array(z.string()).min(1, 'At least one feature is required').optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').optional(),
  provider_id: z.string().min(1, 'Provider ID is required').optional()
});

// Vehicle Provider validation schemas
export const createVehicleProviderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  rating: z.number().min(0).max(5).optional()
});

export const updateVehicleProviderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  rating: z.number().min(0).max(5).optional()
});

// Availability validation schemas
export const createRoomAvailabilitySchema = z.object({
  room_id: z.string().min(1, 'Room ID is required'),
  date: z.string().datetime('Invalid date'),
  available_rooms: z.number().int().nonnegative('Available rooms must be non-negative'),
  price_override: z.number().positive('Price override must be positive').optional(),
  status: z.enum(['available', 'unavailable', 'partial']).optional()
});

export const createVehicleAvailabilitySchema = z.object({
  vehicle_id: z.string().min(1, 'Vehicle ID is required'),
  date: z.string().datetime('Invalid date'),
  available_units: z.number().int().nonnegative('Available units must be non-negative'),
  status: z.enum(['available', 'unavailable', 'partial']).optional()
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Location validation schemas
export const createLocationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  region: z.string().optional(),
  description: z.string().optional(),
  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
});

export const updateLocationSchema = createLocationSchema.partial();

// Search and filter schemas

/**
 * Query strings always arrive as strings, so numeric query filters need
 * coercion before validation. Blank values are treated as "not provided" so an
 * empty filter input does not fail the request.
 */
const queryNumber = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }
    return value;
  }, schema);

export const destinationSearchSchema = z.object({
  page: queryNumber(z.number().int().positive().optional().default(1)),
  limit: queryNumber(z.number().int().positive().max(100).optional().default(20)),
  category_id: z.string().optional(),
  location_id: z.string().optional(),
  min_rating: queryNumber(z.number().min(0).max(5).optional()),
  max_budget: queryNumber(z.number().positive().optional()),
  search: z.string().optional(),
  sort_by: z.enum(['rating', 'views', 'name', 'created_at']).optional().default('rating'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc')
});

export const hotelSearchSchema = z.object({
  page: queryNumber(z.number().int().positive().optional().default(1)),
  limit: queryNumber(z.number().int().positive().max(100).optional().default(20)),
  destination_id: z.string().optional(),
  min_rating: queryNumber(z.number().min(0).max(5).optional()),
  min_price: queryNumber(z.number().positive().optional()),
  max_price: queryNumber(z.number().positive().optional()),
  search: z.string().optional(),
  sort_by: z.enum(['rating', 'price', 'name', 'created_at']).optional().default('rating'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc')
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;
export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type CreatePhotographerInput = z.infer<typeof createPhotographerSchema>;
export type UpdatePhotographerInput = z.infer<typeof updatePhotographerSchema>;
export type CreatePhotographyServiceInput = z.infer<typeof createPhotographyServiceSchema>;
export type UpdatePhotographyServiceInput = z.infer<typeof updatePhotographyServiceSchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type CreateVehicleProviderInput = z.infer<typeof createVehicleProviderSchema>;
export type UpdateVehicleProviderInput = z.infer<typeof updateVehicleProviderSchema>;
export type CreateRoomAvailabilityInput = z.infer<typeof createRoomAvailabilitySchema>;
export type CreateVehicleAvailabilityInput = z.infer<typeof createVehicleAvailabilitySchema>;
export type DestinationSearchInput = z.infer<typeof destinationSearchSchema>;
export type HotelSearchInput = z.infer<typeof hotelSearchSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;