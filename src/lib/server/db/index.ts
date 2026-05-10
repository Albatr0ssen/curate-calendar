import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { relations } from './relations';
import Database from 'better-sqlite3';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

console.log('Creating db client!');
const client = new Database(env.DATABASE_URL);

client.pragma('journal_mode = WAL');
client.pragma('synchronous = NORMAL');

export const db = drizzle({
	client,
	schema,
	relations
});

export function migrateDB() {
	migrate(db, {
		migrationsFolder: './drizzle'
	});
}
