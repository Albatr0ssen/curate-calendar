import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
	Session: {
		user: r.one.User({
			from: r.Session.userId,
			to: r.User.id
		}),
		calendars: r.many.Calendar({
			from: r.Session.userId,
			to: r.Calendar.userId
		})
	}
}));
