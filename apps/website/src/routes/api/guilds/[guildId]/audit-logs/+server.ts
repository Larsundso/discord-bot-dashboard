import { api, cache } from '$lib/server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { APIAuditLog, APIThreadChannel } from 'discord-api-types/v10';
import type { RIntegration, RThread, RUser, RWebhook } from '$lib/scripts/RTypes';
import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';

export const GET: RequestHandler = async (event) => {
	const actionType = event.url.searchParams.get('action_type');
	const limit = event.url.searchParams.get('limit');

	const res = await api.guilds
		.getAuditLogs(event.params.guildId, {
			action_type: actionType ? Number(actionType) : undefined,
			before: event.url.searchParams.get('before') || undefined,
			after: event.url.searchParams.get('after') || undefined,
			limit: limit ? Number(limit) : 100,
			user_id: event.url.searchParams.get('user_id') || undefined,
		})
		.catch((e) => {
			console.log(e);
			return null;
		});
	if (!res) return new Response(null, { status: 404 });

	res.users.forEach((u) => cache.users.set(u));
	res.integrations.forEach((i) => cache.integrations.set(i, event.params.guildId));
	res.threads.forEach((t) => cache.threads.set(t as APIThreadChannel));
	res.webhooks.forEach((w) => cache.webhooks.set(w));

	return json({
		...res,
		audit_log_entries: res.audit_log_entries.sort(
			(b, a) => getTimestampFromID(a.id) - getTimestampFromID(b.id),
		),
		users: res.users.map((u) => cache.users.apiToR(u)),
		integrations: res.integrations.map((i) => cache.integrations.apiToR(i, event.params.guildId)),
		threads: res.threads.map((t) => cache.threads.apiToR(t as APIThreadChannel)),
		webhooks: res.webhooks.map((w) => cache.webhooks.apiToR(w)),
	} as GETResponse);
};

export type GETResponse = APIAuditLog & {
	users: RUser[];
	integrations: RIntegration[];
	threads: RThread[];
	webhooks: RWebhook[];
};
