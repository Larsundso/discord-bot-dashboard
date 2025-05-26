import type { APIExtendedInvite, APIInvite } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';
import type { ChainableCommander } from 'ioredis';

export type RInvite = Omit<
 APIInvite | APIExtendedInvite,
 'guild' | 'channel' | 'inviter' | 'target_user' | 'guild_scheduled_event' | 'stage_instance'
> & {
 guild_id: string;
 channel_id: string | null;
 inviter_id: string | null;
 target_user_id: string | null;
 guild_scheduled_event_id: string | null;
 application_id: string | null;
 max_uses?: number;
 max_age?: number;
 created_at?: string;
 temporary?: boolean;
 uses?: number;
};

export const RInviteKeys = [
 'code',
 'target_type',
 'approximate_presence_count',
 'approximate_member_count',
 'expires_at',
 'type',
 'guild_id',
 'channel_id',
 'inviter_id',
 'target_user_id',
 'guild_scheduled_event_id',
 'application_id',
 'max_uses',
 'max_age',
 'created_at',
 'temporary',
 'uses',
] as const;

export default class InviteCache extends Cache<APIExtendedInvite | APIInvite> {
 public override keys = RInviteKeys as unknown as readonly (keyof RInvite)[];

 constructor(redis: Redis) {
  super(redis, 'invites');
 }

 async set(pipeline: ChainableCommander | undefined, data: APIExtendedInvite | APIInvite) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.code], undefined, pipeline);
  return true;
 }

 apiToR(data: APIExtendedInvite | APIInvite) {
  if (!data.guild) return false;

  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key as (typeof this.keys)[number]),
  );

  const rData = structuredClone(data) as unknown as RInvite;
  rData.guild_id = data.guild.id;
  rData.channel_id = data.channel?.id || null;
  rData.inviter_id = data.inviter?.id || null;
  rData.guild_scheduled_event_id = data.guild_scheduled_event?.id || null;
  rData.application_id = data.target_application?.id || null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
