/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayIntegrationCreateDispatchData,
 type GatewayIntegrationDeleteDispatchData,
 type GatewayIntegrationUpdateDispatchData,
} from 'discord-api-types/v10';
import { cache as redis } from '../Redis.js';

export default {
 [GatewayDispatchEvents.IntegrationCreate]: (data: GatewayIntegrationCreateDispatchData) =>
  redis.integrations.set(undefined, data, data.guild_id),

 [GatewayDispatchEvents.IntegrationDelete]: (data: GatewayIntegrationDeleteDispatchData) =>
  redis.integrations.del(undefined, data.id),

 [GatewayDispatchEvents.IntegrationUpdate]: (data: GatewayIntegrationUpdateDispatchData) =>
  redis.integrations.set(undefined, data, data.guild_id),
} as const;
