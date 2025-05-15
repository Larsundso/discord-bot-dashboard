import { api } from '$lib/server';
import type { RequestHandler } from '@sveltejs/kit';
import type { RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';

export const POST: RequestHandler = async (event) => {
	const body = (await event.request.json()) as RESTPostAPIChannelMessageJSONBody;

	api.channels.createMessage(event.params.channelId!, body);

	return new Response(null, { status: 204 });
};
