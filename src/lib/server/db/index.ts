import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { relations } from './relations';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const db = drizzle({
	connection: { source: env.DATABASE_URL },
	schema,
	relations
});

export function migrateDB() {
	migrate(db, {
		migrationsFolder: './drizzle'
	});
}
