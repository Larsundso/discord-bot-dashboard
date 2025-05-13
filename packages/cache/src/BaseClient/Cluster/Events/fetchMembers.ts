import { loggedIn } from './login.js';
import { type GatewayRequestGuildMembers } from 'discord.js';
import type Client from '../../Bot/Client.js';

export default async (...args: [string]) => {
 loggedIn?.broadcastEval(
  // @ts-expect-error
  async (cl: typeof Client, { guildId }: { guildId: string }) => {
   const info = (await import('discord-hybrid-sharding')).getInfo();

   cl.gateway.send(info.FIRST_SHARD_ID, {
    op: 8, // GatewayOpcodes.RequestGuildMembers
    d: { guild_id: guildId, limit: 0, query: '', presences: true },
   } as GatewayRequestGuildMembers);
  },
  { context: { guildId: args[0] }, cluster: 0 },
 );
};
