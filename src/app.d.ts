// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SessionData } from '$lib/server/auth';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: SessionData;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
