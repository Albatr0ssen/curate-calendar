import { getSessionData, SESSION_COOKIE_NAME } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

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
