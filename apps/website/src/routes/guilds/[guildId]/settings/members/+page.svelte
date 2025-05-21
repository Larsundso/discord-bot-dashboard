<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/form/Button.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Timestamp from '$lib/components/form/Timestamp.svelte';
	import Role from '$lib/components/mentions/Role.svelte';
	import type { RMember, RRole, RUser } from '$lib/scripts/RTypes';
	import getHighestHoistedRole from '$lib/scripts/util/getHighestHoistedRole';
	import getOrderedRoles from '$lib/scripts/util/getOrderedRoles';
	import type { GETResponse } from '../../../../api/guilds/[guildId]/members/search/+server';
	import type { PageParentData, PageServerData } from './$types';

	type ExtendedMember = RMember & { user: RUser | undefined | null };
	const { data }: { data: PageServerData & PageParentData } = $props();
	let members = $derived([...data.members]);
	let rolesMap: { role: RRole; members: ExtendedMember[] }[] = $derived.by(() => {
		const deriveMap: typeof rolesMap = [];

		members.forEach((m) => {
			const highestRole = getHighestHoistedRole(m, data.guild, data.roles);
			const map = deriveMap.find((r) => r.role?.id === highestRole?.id);
			if (map) map.members.push(m);
			else deriveMap.push({ role: highestRole, members: [m] });
		});

		return deriveMap;
	});

	let fetching = $state(false);
	let query = $state('');
	const getQuery = async () => {
		if (!query || query.length < 2) {
			members = [...data.members];
			return;
		}

		fetching = true;
		const res = await fetch(`/api/guilds/${page.params.guildId}/members/search?query=${query}`);
		const searchResults = (await res.json()) as GETResponse;

		members = [...searchResults];

		fetching = false;
	};

	const getName = (member: ExtendedMember) =>
		(member.nick || member.user?.global_name || member.user?.username)!;
</script>

<div
	class="w-50% m-auto my-5"
	class:pointer-events-none={fetching}
	class:cursor-not-allowed={fetching}
>
	<div class="flex flex-row justify-center items-center gap-2">
		<TextInput
			required={false}
			maxLen={32}
			label="Search members"
			type="text"
			size="short"
			id="query"
			onkeydown={(e) => e.key === 'Enter' && !fetching && getQuery()}
			bind:val={query}
		/>
		<Button disabled={fetching} text="Search" onclick={() => (fetching ? null : getQuery())} />
	</div>

	{#if fetching}
		<div class="flex flex-row justify-center items-center gap-2 mt-2">
			<svg
				class="animate-spin h-5 w-5 color-alt-text"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm2.5-1h9a2.5 2.5 0 1 1-5 0h-4a2.5 2.5 0 0 1-4.5-1z"
				/>
			</svg>
			<span class="color-alt-text">Searching...</span>
		</div>
	{/if}
</div>

{#each rolesMap as role}
	<span class="color-alt-text text-md p-3">
		{role.role?.name || 'Unknown role'}
	</span>

	<div class="flex flex-row justify-start items-center gap-2 flex-wrap p-2">
		{#each role.members.sort((a, b) => getName(a).localeCompare(getName(b))) as member}
			{@const isMuted =
				member.communication_disabled_until &&
				new Date(member.communication_disabled_until).getTime() > Date.now()}
			{@const isPremium =
				member.premium_since && new Date(member.premium_since).getTime() < Date.now()}
			<div
				class="flex flex-col justify-between items-center p-3 text-sm rounded-lg gap-2 w-full bg-main-darker b-solid b-danger-hover"
				class:b-1px={isMuted}
			>
				<div class="flex flex-row justify-between items-center p-3 gap-2 w-full" id={member.user_id}>
					<div class="flex flex-row gap-2 justify-center items-center w-max">
						<img
							src={member.avatar_url || member.user?.avatar_url}
							alt=""
							class="w-10 h-10 rounded-full"
							decoding="async"
							loading="lazy"
						/>
						<span
							class="w-max text-lg"
							style={`color: #${
								getOrderedRoles(member, data.roles)
									.reverse()
									.find((r) => r.color)
									?.color.toString(16)
									.padStart(6, '0') || '000000'
							}`}
						>
							{getName(member)}
						</span>
					</div>

					{#if isMuted}
						<span class="color-alt-text">
							Timed-out until:
							<Timestamp time={new Date(member.communication_disabled_until!).getTime()} type="R" />
						</span>
					{/if}

					{#if isPremium}
						<span class="color-alt-text">
							Boosting since:
							<Timestamp time={new Date(member.premium_since!).getTime()} type="R" />
						</span>
					{/if}

					<span class="color-alt-text">
						Joined:
						<Timestamp time={new Date(member.joined_at!).getTime()} type="R" />
					</span>
				</div>

				<div class="flex flex-row justify-start items-center gap-2 w-full flex-wrap">
					{#each member.roles.sort((b, a) => Number(data.roles.find((r) => r.id === a)?.position) - Number(data.roles.find((r) => r.id === b)?.position)) as roleId}
						<span class="flex flex-row justify-start items-center gap-1 w-max max-w-60 truncate">
							<Role id={roleId} />
						</span>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/each}
