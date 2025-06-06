import type { APIApplicationCommandPermission } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';
import type { ChainableCommander } from 'ioredis';

export type RCommandPermission = APIApplicationCommandPermission & { guild_id: string };

export const RCommandPermissionKeys = ['id', 'type', 'permission', 'guild_id'] as const;

export default class CommandPermissionCache extends Cache<APIApplicationCommandPermission> {
 public keys = RCommandPermissionKeys;

 constructor(redis: Redis) {
  super(redis, 'commandPermissions');
 }

 async set(
  pipeline: ChainableCommander | undefined,
  data: APIApplicationCommandPermission,
  guildId: string,
 ) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.id], undefined, pipeline);
  return true;
 }

 apiToR(data: APIApplicationCommandPermission, guildId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key as (typeof this.keys)[number]),
  );

  const rData = structuredClone(data) as unknown as RCommandPermission;
  rData.guild_id = guildId;

  keysNotToCache.forEach((k) => delete (rData as unknown as Record<string, unknown>)[k as string]);

  return structuredClone(rData);
 }
}
