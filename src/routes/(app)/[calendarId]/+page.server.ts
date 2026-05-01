import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserCalendar } from '$lib/calendar';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (locals.session == undefined) redirect(307, '/login');
	const calendar = await getUserCalendar(locals.session.calendars, params.calendarId);
	if (calendar == undefined) redirect(307, '/');
};
