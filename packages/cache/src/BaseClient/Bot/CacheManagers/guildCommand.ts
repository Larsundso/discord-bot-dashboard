import type { APIApplicationCommand } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';
import type { MakeRequired } from './sticker.js';
import type { ChainableCommander } from 'ioredis';

export type RGuildCommand = MakeRequired<APIApplicationCommand, 'guild_id'>;

export const RGuildCommandKeys = [
 'id',
 'type',
 'application_id',
 'name',
 'name_localizations',
 'name_localized',
 'description',
 'description_localizations',
 'description_localized',
 'options',
 'default_member_permissions',
 'dm_permission',
 'default_permission',
 'nsfw',
 'integration_types',
 'contexts',
 'version',
 'handler',
 'guild_id',
] as const;

export default class GuildCommandCache extends Cache<
 APIApplicationCommand & { guild_id: string },
 true
> {
 public keys = RGuildCommandKeys;

 constructor(redis: Redis) {
  super(redis, 'commands');
 }

 async set(
  pipeline: ChainableCommander | undefined,
  data: APIApplicationCommand & { guild_id: string },
 ) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.id], undefined, pipeline);
  return true;
 }

 apiToR(data: APIApplicationCommand & { guild_id: string }) {
  if (!data.guild_id) return false;
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key as (typeof this.keys)[number]),
  );
  keysNotToCache.forEach((k) => delete data[k]);

  return structuredClone(data) as unknown as RGuildCommand;
 }
}
