import type { RequestHandler } from './$types';
import { error, text } from '@sveltejs/kit';
import { getCuratedCalendar } from '$lib/calendar';

export const GET: RequestHandler = async ({ params }) => {
	const calendarPid = params.calendarPid;
	if (calendarPid == undefined) error(400);
	const filteredCalendar = await getCuratedCalendar(calendarPid);
	if (filteredCalendar == undefined) error(404);
	console.log(`${new Date().toISOString()}: Getting ${calendarPid}`);
	return text(filteredCalendar);
};
