import type { APIApplicationCommand } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RCommand = Omit<APIApplicationCommand, 'guild_id'>;

export const RCommandKeys = [
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
] as const;

export default class CommandCache extends Cache<APIApplicationCommand> {
 public keys = RCommandKeys;

 constructor(redis: Redis) {
  super(redis, 'commands');
 }

 async set(data: APIApplicationCommand) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [], [rData.id]);
  return true;
 }

 apiToR(data: APIApplicationCommand) {
  if (!data.guild_id) return false;

  const keysNotToCache = Object.keys(data).filter(
   (key) => !this.keys.includes(key as (typeof this.keys)[number]),
  );

  keysNotToCache.forEach((k) => delete (data as unknown as Record<string, unknown>)[k]);

  return structuredClone(data) as RCommand;
 }
}
