<script lang="ts">
	import type { RGuild, RMember, RRole, RUser } from '$lib/scripts/RTypes';

	type ExtendedMember = RMember & { user: RUser | undefined | null };
	const { members, roles, guild }: { guild: RGuild; roles: RRole[]; members: ExtendedMember[] } =
		$props();

	const orderRoles = (m: ExtendedMember) =>
		roles.filter((r) => m.roles.includes(r.id)).sort((a, b) => a.position - b.position);

	const getHighestHoisted = (m: ExtendedMember) =>
		orderRoles(m)
			.filter((r) => r.hoist)
			.at(-1) || roles.find((r) => r.id === guild.id)!;

	const rolesMap: { role: RRole; members: ExtendedMember[] }[] = [];

	members.forEach((m) => {
		const highestRole = getHighestHoisted(m);
		const map = rolesMap.find((r) => r.role?.id === highestRole?.id);
		if (map) map.members.push(m);
		else rolesMap.push({ role: highestRole, members: [m] });
	});

	const getName = (m: ExtendedMember) => {
		const name = m.nick || m.user?.global_name || m.user?.username;
		return name ? name : 'Unknown';
	};
</script>

<div
	class="flex flex-col justify-start items-start w-60 h-full bg-main-darker of-y-auto of-x-hidden"
>
	{#each rolesMap as role}
		<span class="color-alt-text text-xs pl-5 mt-5">{role.role?.name || 'Unknown role'}</span>
		{#each role.members.sort((a, b) => getName(a).localeCompare(getName(b))) as member}
			<div class="flex flex-row justify-start items-center p-1 pl-5 gap-2 text-sm" id={member.user_id}>
				<img src={member.avatar_url || member.user?.avatar_url} alt="" class="w-8 h-8 rounded-full" />
				<span
					style={`color: #${
						orderRoles(member)
							.reverse()
							.find((r) => r.color)
							?.color.toString(16)
							.padStart(6, '0') || '000000'
					}`}
				>
					{getName(member)?.slice(0, 20)}
				</span>
			</div>
		{/each}
	{/each}
</div>
