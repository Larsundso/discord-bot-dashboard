import type { RChannel, RRole, RUser } from '$lib/scripts/RTypes';

interface CacheHandler<T> {
	cache: Map<string, T>;
	requests: Map<string, Promise<T>>;
	get: (id: string) => Promise<T>;
}

const cache: {
	users: CacheHandler<RUser>;
	channels: CacheHandler<RChannel>;
	roles: CacheHandler<RRole>;
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
};

export default cache;
