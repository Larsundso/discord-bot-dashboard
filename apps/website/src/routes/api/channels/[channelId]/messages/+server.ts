import { api } from '$lib/server';
import { listeners } from '$lib/server/Events/messageCreate';
import type { RequestHandler } from '@sveltejs/kit';
import type { RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
import { produce } from 'sveltekit-sse';

export const GET: RequestHandler = async (event) => {
	return produce(async ({ emit }) => {
		if (listeners.has(event.params.channelId!)) listeners.get(event.params.channelId!)?.push(emit);
		else listeners.set(event.params.channelId!, [emit]);
	});
};

export const POST: RequestHandler = async (event) => {
	const body = (await event.request.json()) as RESTPostAPIChannelMessageJSONBody;

	api.channels.createMessage(event.params.channelId!, body);

	return new Response(null, { status: 204 });
};
