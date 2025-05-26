/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayAutoModerationActionExecutionDispatchData,
 type GatewayAutoModerationRuleCreateDispatchData,
 type GatewayAutoModerationRuleUpdateDispatchData,
} from 'discord-api-types/v10';
import { cache as redis } from '../Redis.js';

export default {
 [GatewayDispatchEvents.AutoModerationActionExecution]: (
  _: GatewayAutoModerationActionExecutionDispatchData,
 ) => undefined,

 [GatewayDispatchEvents.AutoModerationRuleCreate]: (
  data: GatewayAutoModerationRuleCreateDispatchData,
 ) => redis.automods.set(undefined, data),

 [GatewayDispatchEvents.AutoModerationRuleDelete]: (
  data: GatewayAutoModerationRuleCreateDispatchData,
 ) => redis.automods.del(undefined, data.id),

 [GatewayDispatchEvents.AutoModerationRuleUpdate]: (
  data: GatewayAutoModerationRuleUpdateDispatchData,
 ) => redis.automods.set(undefined, data),
} as const;
