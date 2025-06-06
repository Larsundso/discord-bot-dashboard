import {
	CacheEvents,
	type Message,
} from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import { cache as Cache } from '..';

const event = CacheEvents.guildDelete;

export default async (cache: typeof Cache, message: string) => {
	if (!cache.listeners.length) return;

	const payload = JSON.parse(message) as Message<typeof event>;

	cache.listeners.forEach((emit) => emit(event, JSON.stringify(payload.id)));
};
