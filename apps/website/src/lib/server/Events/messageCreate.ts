import {
	CacheEvents,
	type Message,
} from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import { cache as Cache } from '..';
import type { Emitter } from 'sveltekit-sse';

export const listeners: Map<string, Emitter[]> = new Map();

export default async (cache: typeof Cache, message: string) => {
	const payload = JSON.parse(message) as Message<CacheEvents.messageCreate>;

	const channelListeners = listeners.get(payload.channel_id);
	if (!channelListeners) return;

	const messageData = await cache.messages.get(payload.channel_id, payload.id);
	if (!messageData) return;

	const author = await cache.users.get(messageData.author_id);
	if (!author) return;

	const member = await cache.members.get(messageData.guild_id, messageData.author_id);
	if (!member) return;

	channelListeners.forEach((emit) =>
		emit(CacheEvents.messageCreate, JSON.stringify({ ...messageData, author, member })),
	);
};
