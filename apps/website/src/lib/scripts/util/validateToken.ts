import { api } from '$lib/server/index';

export default async (token: string) => {
	const botId = Buffer.from(token.split('.')[0], 'base64').toString();

	const worked = await api.users.get(botId).catch((r) => false);

	return worked;
};
