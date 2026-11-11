import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { authenticate } from '../src/middleware/auth.middleware';
import { registerSchema } from '@gtour/validation';

describe('auth validation and middleware', () => {
  it('rejects weak registration payloads', () => {
    expect(() => registerSchema.parse({
      email: 'user@example.com',
      password: 'short',
      name: 'A',
    })).toThrow();
  });

  it('accepts a valid token for protected routes', async () => {
    process.env.JWT_SECRET = 'test-secret';

    const app = express();
    app.use(express.json());
    app.get('/profile', authenticate, (_req, res) => {
      res.status(200).json({ ok: true });
    });

    const token = jwt.sign({ userId: 'user-123', role: 'tourist' }, process.env.JWT_SECRET!);

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});
