import { getRequestEvent } from '$app/server';
import { db } from './db';
import { Calendar } from './db/schema';
import { error } from '@sveltejs/kit';

export const SESSION_COOKIE_NAME = 'yep';

export type SessionData = {
	userId: string;
	username: string;
	calendars: (typeof Calendar.$inferSelect)[];
};

export async function createSession(userId: string) {}

export async function getSessionData(sessionId: string | undefined) {
	if (sessionId == undefined) return;

	const session = await db.query.Session.findFirst({
		with: {
			user: true,
			calendars: true
		},
		where: {
			id: sessionId
		}
	});

	if (session == undefined || session.user == undefined) return;

	const sessionData: SessionData = {
		userId: session.userId,
		username: session.user.username,
		calendars: session.calendars
	};

	return sessionData;
}

export function getSession() {
	const { locals } = getRequestEvent();
	if (locals.session == undefined) error(401);
	return locals.session;
}
