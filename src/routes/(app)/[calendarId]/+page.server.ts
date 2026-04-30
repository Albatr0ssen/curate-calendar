import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const calendar =
		locals.session?.calendars.some((calendar) => calendar.id == params.calendarId) ?? false;
	if (!calendar) redirect(307, '/');
};
