import { convertIcsCalendar, generateIcsCalendar } from 'ts-ics';

import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { Calendar } from '$lib/server/db/schema';

export const getCalendars = query(async () => {
	const calendars = await db.select().from(Calendar);
});

export const getCalendarEvents = query(async () => {
	const icalContent = '';
	const calendar = convertIcsCalendar(undefined, icalContent);
	if (calendar.events == undefined) return [];

	calendar.events = calendar.events
		.sort((a, b) => a.start.date.getTime() - b.start.date.getTime())
		.filter((icsEvent) => icsEvent.start.date > new Date('2026-05-20'));

	console.log(calendar.events);

	console.log(generateIcsCalendar(calendar));

	return calendar.events;
});
