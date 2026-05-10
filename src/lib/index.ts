import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
	const start = performance.now();

	try {
		return await fn();
	} finally {
		const duration = performance.now() - start;
		console.log(`${label} took ${duration.toFixed(2)}ms`);
	}
}
