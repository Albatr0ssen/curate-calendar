import { timed } from '$lib';
import { getDate, getTime } from './date';
import type { SessionData } from './server/auth';
import { db } from './server/db';
import { Calendar, Event, type DefaultCalendarBehavior } from './server/db/schema';
import { convertIcsCalendar, generateIcsCalendar, type IcsCalendar, type IcsEvent } from 'ts-ics';

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

export function getFilteredUids(calendarEvents: (typeof Event.$inferSelect)[]) {
	const filteredUids = new Set<string>();
	calendarEvents.forEach((calEvent) => {
		filteredUids.add(calEvent.eventUid);
	});
	return filteredUids;
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

export function isCurated(
	icsEvent: IcsEvent,
	filteredUids: Set<string>,
	defaultBehavior: DefaultCalendarBehavior
) {
	const hasUid = filteredUids.has(icsEvent.uid);
	const curated =
		(defaultBehavior == 'include' && !hasUid) || (defaultBehavior == 'exclude' && hasUid);
	return curated;
}

export async function getCalendarEventViews(calendarId: string) {
	const calendar = await timed('calendar event views', async () => {
		return await db.query.Calendar.findFirst({
			with: {
				events: true
			},
			where: {
				id: calendarId
			}
		});
	});

	if (calendar == undefined) return undefined;

	const icsCalendar = await getIcsCalendar(calendar);
	const calendarEventViews: CalendarEventView[] = [];
	const filteredUids = getFilteredUids(calendar.events);

	const icsEvents = icsCalendar.events ?? [];

	await timed('pusing calendar event views', async () => {
		icsEvents.forEach((icsEvent) => {
			calendarEventViews.push({
				uid: icsEvent.uid,
				summary: icsEvent.summary,
				start: icsEvent.start.date,
				end: icsEvent.end?.date,
				location: icsEvent.location ?? '',
				curated: isCurated(icsEvent, filteredUids, calendar.defaultBehavior)
			});
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
	const filteredUids = getFilteredUids(calendar.events);

	icsCalendar.name = calendar.name;

	if (icsCalendar.events != undefined) {
		icsCalendar.events = icsCalendar.events.filter((icsEvent) =>
			isCurated(icsEvent, filteredUids, calendar.defaultBehavior)
		);
	}

	return generateIcsCalendar(icsCalendar);
}
