import type { RMember, RRole } from '../RTypes';

export default (m: RMember, roles: RRole[]) =>
	roles.filter((r) => m.roles.includes(r.id)).sort((a, b) => a.position - b.position);
