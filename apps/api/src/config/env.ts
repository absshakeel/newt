import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

/**
 * Load environment variables from `.env` files.
 *
 * Candidates are ordered from the closest to the process cwd up to the repo
 * root, so the root `.env` documented in the README is picked up whether the
 * API is started from `apps/api` or from the repository root. `dotenv` never
 * overrides variables that are already defined, so real environment variables
 * always win and closer files take precedence over farther ones.
 */
export function loadEnv(): void {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '.env'),
    path.resolve(process.cwd(), '..', '..', '.env'),
    path.resolve(__dirname, '../../../../.env'),
  ];

  let loaded = false;

  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    dotenv.config({ path: envPath });
    loaded = true;
  }

  if (!loaded) dotenv.config();
}

export default loadEnv;
