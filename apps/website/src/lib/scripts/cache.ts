import type { RChannel, RRole, RUser } from '$lib/scripts/RTypes';
import { CacheEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import { source, type Source, type SourceSelected } from 'sveltekit-sse';

interface CacheHandler<T> {
	cache: Map<string, T>;
	requests: Map<string, Promise<T>>;
	get: (id: string) => Promise<T>;
}

const cache: {
	users: CacheHandler<RUser>;
	channels: CacheHandler<RChannel>;
	roles: CacheHandler<RRole>;

	emitter: Map<CacheEvents, ReturnType<Source['select']>>;
} = {
	users: {
		cache: new Map<string, RUser>(),
		requests: new Map<string, Promise<RUser>>(),
		get: async (id: string) => {
			const cached = cache.users.cache.get(id);
			if (cached) return Promise.resolve(cached);

			const request = cache.users.requests.get(id);
			if (request) return request;

			const newRequest = fetch(`/api/users/${id}`)
				.then((res) => {
					if (res.status === 200) return res.json();
					else throw new Error(`Failed to fetch user: ${res.status}`);
				})
				.then((user: RUser) => {
					cache.users.cache.set(id, user);
					cache.users.requests.delete(id);
					return user;
				})
				.catch((error) => {
					cache.users.requests.delete(id);
					throw error;
				});
			cache.users.requests.set(id, newRequest);
			return newRequest;
		},
	},

	channels: {
		cache: new Map<string, RChannel>(),
		requests: new Map<string, Promise<RChannel>>(),
		get: async (id: string) => {
			const cached = cache.channels.cache.get(id);
			if (cached) return Promise.resolve(cached);

			const request = cache.channels.requests.get(id);
			if (request) return request;

			const newRequest = fetch(`/api/channels/${id}`)
				.then((res) => {
					if (res.status === 200) return res.json();
					else throw new Error(`Failed to fetch channel: ${res.status}`);
				})
				.then((channel: RChannel) => {
					cache.channels.cache.set(id, channel);
					cache.channels.requests.delete(id);
					return channel;
				})
				.catch((error) => {
					cache.channels.requests.delete(id);
					throw error;
				});
			cache.channels.requests.set(id, newRequest);
			return newRequest;
		},
	},

	roles: {
		cache: new Map<string, RRole>(),
		requests: new Map<string, Promise<RRole>>(),
		get: async (id: string) => {
			const cached = cache.roles.cache.get(id);
			if (cached) return Promise.resolve(cached);

			const request = cache.roles.requests.get(id);
			if (request) return request;

			const newRequest = fetch(`/api/roles/${id}`)
				.then((res) => {
					if (res.status === 200) return res.json();
					else throw new Error(`Failed to fetch role: ${res.status}`);
				})
				.then((role: RRole) => {
					cache.roles.cache.set(id, role);
					cache.roles.requests.delete(id);
					return role;
				})
				.catch((error) => {
					cache.roles.requests.delete(id);
					throw error;
				});
			cache.roles.requests.set(id, newRequest);
			return newRequest;
		},
	},

	emitter: (() => {
		const connection = source('/api/gateway', { options: { method: 'GET' } });

		const map = new Map<CacheEvents, ReturnType<(typeof connection)['select']>>();
		Object.keys(CacheEvents).forEach((event) =>
			map.set(event as CacheEvents, connection.select(event)),
		);

		return map;
	})(),
};

export default cache;
