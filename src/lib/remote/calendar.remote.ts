import { convertIcsCalendar, generateIcsCalendar } from 'ts-ics';
import { form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/db';
import { Calendar } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { getSession } from '$lib/server/auth';
import { getIcsCalendar, getUserCalendar } from '$lib/calendar';

export const getCalendars = query(async () => {
	const { locals } = getRequestEvent();
	if (locals.session == undefined) error(401);

	const calendars = await db
		.select()
		.from(Calendar)
		.where(eq(Calendar.userId, locals.session.userId));

	return calendars;
});

export const createCalendar = form(
	v.object({
		calendarName: v.pipe(v.string(), v.minLength(1)),
		calendarUrl: v.pipe(v.string(), v.minLength(1))
	}),
	async ({ calendarName, calendarUrl }) => {
		const { locals } = getRequestEvent();
		if (locals.session == undefined) error(401);

		await db.insert(Calendar).values({
			userId: locals.session.userId,
			name: calendarName,
			url: calendarUrl
		});
	}
);

export const getCalendarEvents = query(v.string(), async (calendarId) => {
	const { calendars } = getSession();
	const calendar = await getUserCalendar(calendars, calendarId);
	if (calendar == undefined) error(403);
	const icsCalendar = await getIcsCalendar(calendar);
	return { calendarPid: calendar.pid, calendarEvents: icsCalendar.events };
});
