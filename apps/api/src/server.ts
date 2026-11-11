import 'dotenv/config';
import path from 'path';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import destinationRoutes from './routes/destination.routes';
import hotelRoutes from './routes/hotel.routes';
import roomRoutes from './routes/room.routes';
import photographerRoutes from './routes/photographer.routes';
import photographyServiceRoutes from './routes/photographyService.routes';
import vehicleRoutes from './routes/vehicle.routes';
import vehicleProviderRoutes from './routes/vehicleProvider.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import categoryRoutes from './routes/category.routes';
import locationRoutes from './routes/location.routes';
import uploadRoutes from './routes/upload.routes';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB when running the server directly.
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Security middleware
app.use(helmet());

// CORS configuration (supports web + admin apps and multiple origins)
const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  ...(process.env.CORS_ORIGINS?.split(',') ?? []),
]
  .map((origin) => origin?.trim())
  .filter((origin): origin is string => Boolean(origin));

// Always include local dev defaults so adding FRONTEND_URL doesn't accidentally block the admin app.
const allowedOrigins = new Set(
  configuredOrigins.length > 0 ? [...defaultOrigins, ...configuredOrigins] : defaultOrigins
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients/tools with no Origin header (curl, server-to-server, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Static uploads (legacy/local fallback for previously uploaded images)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/destinations', destinationRoutes);
app.use('/api/v1/hotels', hotelRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/photographers', photographerRoutes);
app.use('/api/v1/photography-services', photographyServiceRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/vehicle-providers', vehicleProviderRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/uploads', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling
app.use(errorHandler);

// Start server when running directly.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;