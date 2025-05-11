/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayEntitlementCreateDispatchData,
 type GatewayEntitlementDeleteDispatchData,
 type GatewayEntitlementUpdateDispatchData,
} from 'discord-api-types/v10';

export default {
 [GatewayDispatchEvents.EntitlementCreate]: (_: GatewayEntitlementCreateDispatchData) => undefined,

 [GatewayDispatchEvents.EntitlementDelete]: (_: GatewayEntitlementDeleteDispatchData) => undefined,

 [GatewayDispatchEvents.EntitlementUpdate]: (_: GatewayEntitlementUpdateDispatchData) => undefined,
} as const;
