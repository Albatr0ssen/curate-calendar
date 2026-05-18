import { randomString } from './utils';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const User = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	username: text('username').unique().notNull(),
	password: text('password').notNull()
});

export const Session = sqliteTable('sessions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.references(() => User.id)
		.notNull()
});

export const defaultCalendarBehaviorEnum = ['exclude', 'include'] as const;
export type DefaultCalendarBehavior = (typeof defaultCalendarBehaviorEnum)[number];

export const Calendar = sqliteTable('calendars', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	pid: text('pid')
		.primaryKey()
		.unique()
		.$defaultFn(() => randomString(32)),
	userId: text('user_id')
		.references(() => User.id)
		.notNull(),
	name: text('name').notNull(),
	url: text('url').notNull(),
	defaultBehavior: text('default_behavior', { enum: defaultCalendarBehaviorEnum })
		.default('exclude')
		.notNull()
});

export const Event = sqliteTable('events', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	calendarId: text('calendar_id')
		.references(() => Calendar.id)
		.notNull(),
	eventUid: text('event_uid').notNull()
});
