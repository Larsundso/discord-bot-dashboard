import {
	CacheEvents,
	type Message,
} from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import { cache as Cache } from '..';

const event = CacheEvents.guildCreate;

export default async (cache: typeof Cache, message: string) => {
	if (!cache.listeners.length) return;

	const payload = JSON.parse(message) as Message<typeof event>;

	const guildData = await cache.guilds.get(undefined, payload.id);
	if (!guildData) return;

	cache.listeners.forEach((emit) => emit(event, JSON.stringify(guildData)));
};
