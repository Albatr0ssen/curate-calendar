import type { RequestHandler } from './$types';
import { SESSION_COOKIE_NAME } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = ({ cookies }) => {
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
	redirect(307, '/login');
};
