import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const letters = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function randomString(length: number) {
	let str: string = '';
	for (let i = 0; i < length; i++) {
		str += letters.charAt(Math.floor(Math.random() * letters.length));
	}
	return str;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
