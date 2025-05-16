import {
	CacheEvents,
	type Message,
} from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import type { Emitter } from 'sveltekit-sse';
import { cache as Cache } from '..';

const event = CacheEvents.messageDelete;
export const listeners: Map<string, Emitter[]> = new Map();

export default async (cache: typeof Cache, message: string) => {
	if (!cache.listeners.length) return;

	const payload = JSON.parse(message) as Message<typeof event>;

	cache.listeners.forEach((emit) => emit(event, JSON.stringify({ id: payload.id })));
};
