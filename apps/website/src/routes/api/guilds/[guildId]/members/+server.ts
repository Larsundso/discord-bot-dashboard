import { publisher } from '$lib/server';
import { WebsiteEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = (event) => {
	publisher.publish(WebsiteEvents.FETCH_GUILD_MEMBERS, event.params.guildId);
 publisher.publish(WebsiteEvents.FETCH_COUNTS, event.params.guildId);

	return new Response(null, { status: 202 });
};
