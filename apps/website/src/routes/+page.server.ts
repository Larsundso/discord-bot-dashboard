import validateToken from '$lib/scripts/util/validateToken';
import { publisher, redis, setAPI } from '$lib/server';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	redis.flushdb();
};

const tester = /[a-zA-Z0-9]{20,26}\..{6}\..{38}/gm;

export const actions = {
	login: async (event) => {
		const data = await event.request.formData();
		const token = data.get('token') as string;

		if (!token) return fail(400, { message: 'No token provided', missing: true });
		if (!token.match(tester)) return fail(400, { message: 'Invalid token (1)', incorrect: true });

		const self = await validateToken(token);
		if (!self) return fail(400, { message: 'Invalid token (2)', incorrect: true });

		publisher.set('token', token);
		publisher.set('self', JSON.stringify(self));
		publisher.publish('login', 'login');
		event.cookies.set('sessionStart', String(Date.now()), {
			httpOnly: true,
			sameSite: 'strict',
			path: '/',
		});
		setAPI(token);

		return { success: true };
	},
} satisfies Actions;
