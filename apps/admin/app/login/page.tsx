import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to manage your GTour bookings, saved destinations and provider listings.',
};

export default function LoginPage() {
  return <LoginForm />;
}