import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { Session, User } from '$lib/server/db/schema';
import { SESSION_COOKIE_NAME } from '$lib/server/auth';
import * as argon2 from 'argon2';

export const login = form(
	v.object({
		username: v.pipe(v.string(), v.nonEmpty()),
		password: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ username, password }) => {
		const { cookies } = getRequestEvent();

		const [user] = await db.select().from(User).where(eq(User.username, username));
		if (user == undefined) error(401);

		if (!(await argon2.verify(user.password, password))) error(403);

		const [session] = await db
			.insert(Session)
			.values({
				userId: user.id
			})
			.returning({
				id: Session.id
			});
		if (session == undefined) error(500);

		cookies.set(SESSION_COOKIE_NAME, session.id, {
			path: '/'
		});

		redirect(307, `/`);
	}
);

export const signup = form(
	v.object({
		username: v.pipe(v.string(), v.nonEmpty()),
		password: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ username, password }) => {
		const [user] = await db.select().from(User).where(eq(User.username, username));
		if (user != undefined) error(400, 'User already exists');

		await db.insert(User).values({
			username,
			password: await argon2.hash(password)
		});

		redirect(307, `/login`);
	}
);
