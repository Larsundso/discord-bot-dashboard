import {
	CacheEvents,
	type Message,
} from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import type { Emitter } from 'sveltekit-sse';
import { cache as Cache } from '..';

const event = CacheEvents.guildUpdate;
export const listeners: Emitter[] = [];

export default async (cache: typeof Cache, message: string) => {
	if (!listeners.length) return;

	const payload = JSON.parse(message) as Message<typeof event>;

	const guildData = await cache.guilds.get(payload.id);
	if (!guildData) return;

	listeners.forEach((emit) => emit(event, JSON.stringify(guildData)));
};
