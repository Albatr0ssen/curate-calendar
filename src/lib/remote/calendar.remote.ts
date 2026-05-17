import { convertIcsCalendar, generateIcsCalendar } from 'ts-ics';
import { command, form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/db';
import { Calendar, Event } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { getSession } from '$lib/server/auth';
import { getCalendarEventViews, getIcsCalendar, getUserCalendar } from '$lib/calendar';
import { timed } from '$lib';
import { defaultCalendarBehaviorEnum } from '$lib/server/db/schema';

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
		calendarUrl: v.pipe(v.string(), v.minLength(1)),
		calendarBehavior: v.picklist(defaultCalendarBehaviorEnum)
	}),
	async ({ calendarName, calendarUrl, calendarBehavior }) => {
		const { locals } = getRequestEvent();
		if (locals.session == undefined) error(401);

		await db.insert(Calendar).values({
			userId: locals.session.userId,
			name: calendarName,
			url: calendarUrl,
			defaultBehavior: calendarBehavior
		});
	}
);

export const deleteCalendar = command(v.string(), async (calendarId) => {
	const { calendars } = getSession();
	const calendar = await getUserCalendar(calendars, calendarId);
	if (calendar == undefined) error(403);

	await db.delete(Calendar).where(eq(Calendar.id, calendarId));
	getCalendars().refresh();
});

export const getCalendarEvents = query(v.string(), async (calendarId) => {
	const { calendars } = getSession();
	const calendar = await getUserCalendar(calendars, calendarId);
	if (calendar == undefined) error(403);
	return {
		calendarId: calendar.id,
		calendarPid: calendar.pid,
		calendarEvents: await getCalendarEventViews(calendarId)
	};
});

export const curateCalendarEvent = command(
	v.object({
		calendarId: v.string(),
		eventUid: v.string(),
		becomeCurated: v.boolean()
	}),
	async ({ calendarId, eventUid, becomeCurated }) => {
		console.log('\nCurate calendar event start');
		const { calendars } = getSession();
		const calendar = await getUserCalendar(calendars, calendarId);
		if (calendar == undefined) error(403);

		const insert =
			(calendar.defaultBehavior == 'include' && !becomeCurated) ||
			(calendar.defaultBehavior == 'exclude' && becomeCurated);

		if (insert) {
			await timed('insert event', async () => {
				await db.insert(Event).values({
					calendarId,
					eventUid
				});
			});
		} else {
			await timed('delete event', async () => {
				await db
					.delete(Event)
					.where(and(eq(Event.calendarId, calendarId), eq(Event.eventUid, eventUid)));
			});
		}

		await getCalendarEvents(calendarId).refresh();
		console.log('Curate calendar event end\n');
	}
);
