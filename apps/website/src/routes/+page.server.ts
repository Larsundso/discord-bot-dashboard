import validateToken from '$lib/scripts/util/validateToken';
import { publisher, redis, setAPI } from '$lib/server';
import { WebsiteEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import { fail, type Actions } from '@sveltejs/kit';

const tester = /[a-zA-Z0-9]{20,26}\..{6}\..{38}/gm;

export const actions = {
	login: async (event) => {
		const data = await event.request.formData();
		const token = data.get('token') as string;

		if (!token) return fail(400, { message: 'No token provided', missing: true });
		if (!token.match(tester)) return fail(400, { message: 'Invalid token (1)', incorrect: true });

		const self = await validateToken(token);
		if (!self) return fail(400, { message: 'Invalid token (2)', incorrect: true });

		redis.set('self', JSON.stringify(self));
		publisher.publish(WebsiteEvents.LOGIN, token);
		event.cookies.set('sessionStart', String(Date.now()), {
			httpOnly: true,
			sameSite: 'strict',
			path: '/',
		});
		setAPI(token);

		return { success: true };
	},
} satisfies Actions;
