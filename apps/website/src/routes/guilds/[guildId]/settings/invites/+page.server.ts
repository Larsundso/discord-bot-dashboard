import type { RInvite } from '$lib/scripts/RTypes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
	invites: await event
		.fetch(`/api/guilds/${event.params.guildId}/invites`)
		.then((r) => r.json() as Promise<{ invites: RInvite[] }>)
		.then((r) => r.invites),
});
