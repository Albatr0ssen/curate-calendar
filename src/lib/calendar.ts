import { getDate, getTime } from './date';
import type { SessionData } from './server/auth';
import { db } from './server/db';
import { Calendar, Event } from './server/db/schema';
import { convertIcsCalendar, generateIcsCalendar, type IcsCalendar } from 'ts-ics';

export type CalendarEventView = {
	uid: string;
	summary: string;
	start: Date;
	end?: Date;
	location: string;
	curated: boolean;
};

const ICS_CALENDAR_CACHE_TIMEOUT_MS = 10 * 60 * 1000;
const icsCalendarCache = new Map<string, IcsCalendar>();

export async function getUserCalendar(calendars: SessionData['calendars'], calendarId: string) {
	return calendars.find((calendar) => calendar.id == calendarId);
}

export function getCuratedUids(calendarEvents: (typeof Event.$inferSelect)[]) {
	const curatedUids = new Set<string>();
	calendarEvents.forEach((calEvent) => {
		curatedUids.add(calEvent.eventUid);
	});
	return curatedUids;
}

export async function getIcsCalendar(calendar: typeof Calendar.$inferSelect) {
	let icsCalendar = icsCalendarCache.get(calendar.id);
	if (icsCalendar != undefined) {
		console.log(`Using cache! (${calendar.id})`);
	} else {
		const response = await fetch(calendar.url);
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
	}
	return structuredClone(icsCalendar);
}

export async function getCalendarEventViews(calendarId: string) {
	const calendar = await db.query.Calendar.findFirst({
		with: {
			events: true
		},
		where: {
			id: calendarId
		}
	});
	if (calendar == undefined) return undefined;

	const icsCalendar = await getIcsCalendar(calendar);
	const calendarEventViews: CalendarEventView[] = [];
	const curatedUids = getCuratedUids(calendar.events);

	(icsCalendar.events ?? []).forEach((icsEvent) => {
		calendarEventViews.push({
			uid: icsEvent.uid,
			summary: icsEvent.summary,
			start: icsEvent.start.date,
			end: icsEvent.end?.date,
			location: icsEvent.location ?? '',
			curated: curatedUids.has(icsEvent.uid)
		});
	});

	return calendarEventViews;
}

export async function getCuratedCalendar(calendarPid: string) {
	const calendar = await db.query.Calendar.findFirst({
		with: {
			events: true
		},
		where: {
			pid: calendarPid
		}
	});
	if (calendar == undefined) return undefined;

	const icsCalendar = await getIcsCalendar(calendar);
	const curatedUids = getCuratedUids(calendar.events);

	icsCalendar.name = calendar.name;

	if (icsCalendar.events != undefined) {
		icsCalendar.events = icsCalendar.events.filter((icsEvent) => curatedUids.has(icsEvent.uid));
	}

	return generateIcsCalendar(icsCalendar);
}
