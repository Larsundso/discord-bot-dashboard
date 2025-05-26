import { cache } from '$lib/server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RRole } from '$lib/scripts/RTypes';

export const GET: RequestHandler = async (event) => {
	const roleId = event.params.roleId;

	const role = await cache.roles.get(undefined, roleId);
	if (!role) return error(404);

	return json(role as GETResponse);
};

export type GETResponse = RRole;
