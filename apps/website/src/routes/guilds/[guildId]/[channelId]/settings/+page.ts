import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = (event) => {
	throw redirect(302, `/guilds/${event.params.guildId}/${event.params.channelId}/settings/perms`);
};
