import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	throw redirect(302, `/guilds/${event.params.guildId}/settings/roles/${event.params.guildId}`);
};
