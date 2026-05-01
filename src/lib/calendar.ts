import type { SessionData } from './server/auth';
import { db } from './server/db';
import { Calendar } from './server/db/schema';
import { convertIcsCalendar, generateIcsCalendar, type IcsCalendar } from 'ts-ics';

const ICS_CALENDAR_CACHE_TIMEOUT_MS = 10 * 60 * 60 * 1000;
const icsCalendarCache = new Map<string, IcsCalendar>();

export async function getUserCalendar(calendars: SessionData['calendars'], calendarId: string) {
	return calendars.find((calendar) => calendar.id == calendarId);
}

export async function getIcsCalendar(calendar: typeof Calendar.$inferSelect) {
	let icsCalendar = icsCalendarCache.get(calendar.id);
	if (icsCalendar != undefined) {
		console.log('Using cache!');
		return icsCalendar;
	}

	const response = await fetch(calendar.url);
	console.log(response);
	const icsCalendarContent = await response.text();
	icsCalendar = convertIcsCalendar(undefined, icsCalendarContent);
	if (icsCalendar.events == undefined) icsCalendar.events = [];
	icsCalendar.events = icsCalendar.events.sort(
		(a, b) => a.start.date.getTime() - b.start.date.getTime()
	);

	icsCalendarCache.set(calendar.id, icsCalendar);
	setTimeout(() => {
		icsCalendarCache.delete(calendar.id);
	}, ICS_CALENDAR_CACHE_TIMEOUT_MS);
	return icsCalendar;
}

export async function getFilteredCalendar(calendarPid: string) {
	const calendar = await db.query.Calendar.findFirst({
		with: {
			events: true
		},
		where: {
			pid: calendarPid
		}
	});
	if (calendar == undefined) return undefined;

	const includedUids = new Set<string>();
	calendar.events.forEach((icsEvent) => {
		includedUids.add(icsEvent.eventUid);
	});

	const icsCalendar = await getIcsCalendar(calendar);

	if (icsCalendar.events != undefined) {
		icsCalendar.events = icsCalendar.events.filter((icsEvent) => includedUids.has(icsEvent.uid));
	}

	return generateIcsCalendar(icsCalendar);
}
