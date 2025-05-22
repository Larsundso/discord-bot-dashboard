import { api, cache, publisher } from '$lib/server';
import { WebsiteEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	publisher.publish(WebsiteEvents.FETCH_GUILD_MEMBERS, event.params.guildId);

	const guild = await api.guilds.get(event.params.guildId, { with_counts: true }).catch(() => null);
	if (guild) cache.guilds.set(guild);

	const automods = await api.guilds.getAutoModerationRules(event.params.guildId).catch(() => []);
	automods.forEach((a) => cache.automods.set(a));

	return new Response(null, { status: 202 });
};
