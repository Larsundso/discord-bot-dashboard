import { listeners as createListeners } from '$lib/server/Events/messageCreate';
import { listeners as deleteListeners } from '$lib/server/Events/messageDelete';
import { listeners as updateListeners } from '$lib/server/Events/messageUpdate';
import type { RequestHandler } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';

export const POST: RequestHandler = async (event) => {
	return produce(async ({ emit }) => {
		if (createListeners.has(event.params.channelId!)) {
			createListeners.get(event.params.channelId!)?.push(emit);
		} else createListeners.set(event.params.channelId!, [emit]);
	});
};

export const DELETE: RequestHandler = async (event) => {
	return produce(async ({ emit }) => {
		if (deleteListeners.has(event.params.channelId!)) {
			deleteListeners.get(event.params.channelId!)?.push(emit);
		} else deleteListeners.set(event.params.channelId!, [emit]);
	});
};

export const PATCH: RequestHandler = async (event) => {
	return produce(async ({ emit }) => {
		if (updateListeners.has(event.params.channelId!)) {
			updateListeners.get(event.params.channelId!)?.push(emit);
		} else updateListeners.set(event.params.channelId!, [emit]);
	});
};
