import { env } from '$env/dynamic/private';
import { getSessionData, SESSION_COOKIE_NAME } from '$lib/server/auth';
import { db, migrateDB } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import type { ServerInit } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const init: ServerInit = async () => {
	if (env.NODE_ENV == 'production') {
		try {
			console.log('Migrating...');
			migrateDB();
			console.log('Successfully migrated!');
		} catch (err) {
			console.error('Failed to migrate');
			console.error(err);
		}
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, locals } = event;

	const sessionId = cookies.get(SESSION_COOKIE_NAME);
	const sessionData = await getSessionData(sessionId);
	if (sessionData != undefined) {
		locals.session = sessionData;
	}

	const response = await resolve(event);
	return response;
};
