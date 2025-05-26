import getAllMembers from '$lib/scripts/util/getAllMembers';
import { cache, redis } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const guildId = event.params.guildId;

	const memberIds = await redis.zrangebyscore(`lists:members:${guildId}`, 0, 250, 'LIMIT', 0, 1000);
	const members =
		memberIds.length !== 1
			? await Promise.all(memberIds.map((id) => cache.members.get(guildId, id))).then((m) =>
					m.filter((r) => !!r),
				)
			: await getAllMembers(event.params.guildId);

	const users = await Promise.all(memberIds.map((id) => cache.users.get(id)));

	const roleKeys = await cache.roles.getKeystore(guildId).then((r) => Object.keys(r));
	const roles = await Promise.all(
		roleKeys.map((key) => cache.roles.get(key.split(/:/g).at(-1) || '')),
	).then((m) => m.filter((r) => !!r));

	return {
		members: members.map((m) => ({ ...m, user: users.find((u) => u?.id === m?.user_id) })),
		roles,
	};
};
