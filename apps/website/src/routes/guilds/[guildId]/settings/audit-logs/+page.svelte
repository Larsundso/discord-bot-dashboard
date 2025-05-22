<script lang="ts">
	import { page } from '$app/state';
	import Channel from '$lib/components/mentions/Channel.svelte';
	import User from '$lib/components/mentions/User.svelte';
	import { AuditLogEvent, type RESTGetAPIAuditLogQuery } from 'discord-api-types/v10';
	import { onMount } from 'svelte';
	import type { PageServerParentData } from '../../$types';
	import type { GETResponse } from '../../../../api/guilds/[guildId]/audit-logs/+server';
	import { strings, TargetType, targetTypes } from '$lib/scripts/util/AuditLogMaps';
	import Role from '$lib/components/mentions/Role.svelte';
	import AutoMod from '$lib/components/mentions/AutoMod.svelte';
	import type { RUser } from '$lib/scripts/RTypes';
	import Select from '$lib/components/form/Select.svelte';
	import Button from '$lib/components/form/Button.svelte';

	const { data }: { data: PageServerParentData } = $props();
	let logs: GETResponse | null = $state(null);

	let userOptions = $state<RUser[]>([]);
	let selectedOptions = $state<RUser[]>([]);
	let isLoading = $state(false);

	const search = async (v: string) => {
		if (!v.length) {
			userOptions = [];
			return;
		}

		if (/\d{17,19}/g.test(v)) {
			userOptions = [
				{
					global_name: 'Add by ID',
					username: v,
					id: v,
					discriminator: '0',
					avatar_url: null,
					banner_url: null,
				},
			];
			return;
		}

		isLoading = true;

		const res = await fetch(`/api/users/search?query=${v}`)
			.then((r) => (r.ok ? (r.json() as Promise<RUser[]>) : []))
			.catch(() => []);

		isLoading = false;
		userOptions = res || [];
	};

	const get = async () => {
		const url = `/api/guilds/${page.params.guildId}/audit-logs?user_id=${
			selectedOptions[0]?.id || ''
		}&action_type=${''}`;
		console.log(url);

		const res = await fetch(url);
		if (!res.ok) return;

		logs = await res.json();
	};

	onMount(() => {
		get();
	});
</script>

<div
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins h-100vh w-full"
>
	<section class="bg-main-light h-full w-20%">
		<Select
			maxOpts={1}
			label="Filter by user"
			options={userOptions}
			searchable={true}
			ontyping={(e) => search(e)}
			required={false}
			minOpts={0}
			bind:selectedOptions
		/>

		<Button text="Refresh" style="secondary" emoji={{ id: '勒' }} onclick={() => get()} />
	</section>

	<div class="flex-grow of-y-auto of-x-hidden h-full">
		<section class="flex flex-col justify-center items-center gap-2">
			{#if logs}
				{#each logs.audit_log_entries as entry}
					{@const targetType = targetTypes[entry.action_type]}
					{@const addedRoles = entry.changes?.find((c) => c.key === '$add')?.new_value || []}
					{@const removedRoles = entry.changes?.find((c) => c.key === '$remove')?.new_value || []}

					<div class="bg-main-darker p-2 rounded-xl mx-5 w-95%">
						<div class="flex flex-col">
							<div class="flex flex-row justify-start items-start">
								{#if entry.user_id}
									<User id={entry.user_id} />
								{/if}

								{strings[entry.action_type]}

								{#if targetType === TargetType.Channel}
									<Channel guild={data.guild} id={entry.target_id!} />
								{:else if targetType === TargetType.User}
									<User id={entry.target_id!} />
								{:else if targetType === TargetType.Role}
									<Role id={entry.target_id!} />
								{:else if targetType === TargetType.AutoMod}
									<AutoMod id={entry.target_id!} />
								{:else if targetType === TargetType.None}{:else}
									<span>
										Unhandled target type {TargetType[targetType]} for {AuditLogEvent[entry.action_type]}
									</span>
								{/if}
							</div>

							<span>Reason: {entry.reason || 'None provided'}</span>

							{#each (entry.changes || []).filter((c) => (typeof c.new_value === 'string' && c.new_value.length) || (typeof c.old_value === 'string' && c.old_value.length)) as change}
								<span>
									{change.key}

									{#if change.new_value && change.old_value}
										- Changed from
									{:else}
										- Changed to
									{/if}

									{#if change.old_value}
										{change.old_value}
									{/if}

									{#if change.new_value && change.old_value}
										to
									{/if}

									{#if change.new_value}
										{change.new_value}
									{/if}
								</span>
							{/each}

							{#if addedRoles.length}
								Added roles:
								<div class="flex flex-row justify-start items-center flex-wrap gap-1">
									{#each addedRoles as addedRole}
										<Role id={addedRole.id} />
									{/each}
								</div>
							{/if}

							{#if removedRoles.length}
								Removed roles:
								<div class="flex flex-row justify-start items-center flex-wrap gap-1">
									{#each removedRoles as removedRole}
										<Role id={removedRole.id} />
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</section>
	</div>
</div>
