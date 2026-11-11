import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

function loadDatabaseEnv(): void {
  if (process.env.MONGODB_URI) return;

  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '.env'),
    path.resolve(process.cwd(), '..', '..', '.env'),
  ];

  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      if (process.env.MONGODB_URI) return;
    }
  }

  dotenv.config();
}

export const connectDB = async (): Promise<void> => {
  loadDatabaseEnv();

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gtour';
  const usingFallback = !process.env.MONGODB_URI;

  if (usingFallback) {
    console.warn('⚠️ MONGODB_URI is not set; falling back to mongodb://localhost:27017/gtour');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ MongoDB connection error: ${message}`);
    console.error('   Check: MONGODB_URI, MongoDB service/Atlas cluster status, network access/IP allowlist, credentials, and DNS/SRV support.');
    process.exit(1);
  }
};

export default mongoose;