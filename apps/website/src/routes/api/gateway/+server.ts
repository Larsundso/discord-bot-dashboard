import { cache } from '$lib/server';
import type { RequestHandler } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';

export const GET: RequestHandler = () =>
	produce(({ emit }) => {
		cache.listeners.push(emit);

		return () => {
			const index = cache.listeners.indexOf(emit);
			if (index > -1) cache.listeners.splice(index, 1);
		};
	});
