import {
	CacheEvents,
	type Message,
} from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import type { Emitter } from 'sveltekit-sse';
import { cache as Cache } from '..';

const event = CacheEvents.messageDelete;
export const listeners: Map<string, Emitter[]> = new Map();

export default async (_: typeof Cache, message: string) => {
	const payload = JSON.parse(message) as Message<typeof event>;

	const channelListeners = listeners.get(payload.channel_id);
	if (!channelListeners) return;

 channelListeners.forEach((emit) => emit(event, JSON.stringify({ id: payload.id })));
};
