import type { RGuild, RMember, RRole } from '../RTypes';
import getOrderedRoles from './getOrderedRoles';

export default (m: RMember, guild: RGuild, roles: RRole[]) =>
	getOrderedRoles(m, roles)
		.filter((r) => r.hoist)
		.at(-1) || roles.find((r) => r.id === guild.id)!;
