import { API } from '@discordjs/core';
import { REST } from '@discordjs/rest';

export default async (token: string) => {
	const botId = Buffer.from(token.split('.')[0], 'base64').toString();

	const rest = new REST().setToken(token);
	const api = new API(rest);
	const worked = await api.users.get(botId).catch((r) => {
		console.log(r);
		false;
	});

	return worked;
};
