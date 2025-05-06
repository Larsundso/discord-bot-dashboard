import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const findInParents = (element: HTMLElement, id: string) => {
	while (element.parentElement) {
		if (element.id === id) return element;
		element = element.parentElement;
	}
	return null;
};

export const numberWithCommas = (x: number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
