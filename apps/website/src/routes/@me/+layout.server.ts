import { redis } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import type { APIUser } from 'discord-api-types/v10';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const selfS = await redis.get('self');
	if (!selfS) redirect(302, '/');

	const self = JSON.parse(selfS) as APIUser;

	return { self };
};
