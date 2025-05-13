import { loggedIn } from './login.js';
import type Client from '../../Bot/Client.js';

export default async (...args: [string]) => {
 loggedIn?.broadcastEval(
  // @ts-expect-error
  async (cl: typeof Client, { guildId }: { guildId: string }) => {
   const guild = await cl.api.guilds.get(guildId, { with_counts: true });
   cl.cache.guilds.set(guild);
  },
  { context: { guildId: args[0] }, cluster: 0 },
 );
};
