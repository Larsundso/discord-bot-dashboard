import { listeners as createListeners } from '$lib/server/Events/guildCreate';
import { listeners as deleteListeners } from '$lib/server/Events/guildDelete';
import { listeners as updateListeners } from '$lib/server/Events/guildUpdate';
import type { RequestHandler } from './$types';
import { produce } from 'sveltekit-sse';

export const POST: RequestHandler = () => {
	return produce(({ emit }) => {
		createListeners.push(emit);
	});
};

export const DELETE: RequestHandler = () => {
	return produce(({ emit }) => {
		deleteListeners.push(emit);
	});
};

export const PATCH: RequestHandler = () => {
	return produce(({ emit }) => {
		updateListeners.push(emit);
	});
};
