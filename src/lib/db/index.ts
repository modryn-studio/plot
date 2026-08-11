// Server-only DB client. `event` is append-only — the app never UPDATE/DELETEs it
// (a DB trigger enforces this); erasure runs through a separate privileged path.
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from '@/lib/env';
import * as schema from './schema';

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });

export * from './schema';
