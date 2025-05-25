<script lang="ts">
	import type { RGuild, RMember, RRole, RUser } from '$lib/scripts/RTypes';
	import getHighestHoistedRole from '$lib/scripts/util/getHighestHoistedRole';
	import getOrderedRoles from '$lib/scripts/util/getOrderedRoles';

	type ExtendedMember = RMember & { user: RUser | undefined | null };
	const { members, roles, guild }: { guild: RGuild; roles: RRole[]; members: ExtendedMember[] } =
		$props();

	const rolesMap = $derived.by(() => {
		const map: { role: RRole; members: ExtendedMember[] }[] = [];
		members.forEach((m) => {
			const highestRole = getHighestHoistedRole(m, guild, roles);
			const existingMap = map.find((r) => r.role?.id === highestRole?.id);
			if (existingMap) existingMap.members.push(m);
			else map.push({ role: highestRole, members: [m] });
		});
		
		return map;
	});

	const getName = (m: ExtendedMember) => {
		const name = m.nick || m.user?.global_name || m.user?.username;
		return name ? name : 'Unknown';
	};
</script>

<div
	class="flex flex-col justify-start items-start w-60 h-100vh bg-main-darker of-y-auto of-x-hidden mt-10"
>
	<div class="h-10"></div>
	{#each rolesMap as role}
		<span class="color-alt-text text-xs pl-3 sm:pl-4 md:pl-5 mt-3 sm:mt-4 md:mt-5"
			>{role.role?.name || 'Unknown role'}</span
		>
		{#each role.members.sort((a, b) => getName(a).localeCompare(getName(b))) as member}
			<div
				class="flex flex-row justify-start items-center p-1 pl-3 sm:pl-4 md:pl-5 gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm"
				id={member.user_id}
			>
				<img
					src={member.avatar_url || member.user?.avatar_url}
					alt=""
					class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full"
     loading="lazy"
     decoding="async"
				/>
				<span
					class="truncate max-w-30 sm:max-w-36 md:max-w-42 xl:max-w-full truncate"
					style={`color: #${
						getOrderedRoles(member, roles)
							.reverse()
							.find((r) => r.color)
							?.color.toString(16)
							.padStart(6, '0') || '000000'
					}`}
				>
					{getName(member)}
				</span>
			</div>
		{/each}
	{/each}
</div>
