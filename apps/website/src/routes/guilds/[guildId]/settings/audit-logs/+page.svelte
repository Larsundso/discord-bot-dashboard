<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/form/Button.svelte';
	import Select from '$lib/components/form/Select.svelte';
	import Timestamp from '$lib/components/form/Timestamp.svelte';
	import AutoMod from '$lib/components/mentions/AutoMod.svelte';
	import Channel from '$lib/components/mentions/Channel.svelte';
	import Role from '$lib/components/mentions/Role.svelte';
	import User from '$lib/components/mentions/User.svelte';
	import type { RUser } from '$lib/scripts/RTypes';
	import { strings, TargetType, targetTypes } from '$lib/scripts/util/AuditLogMaps';
	import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';
	import { AuditLogEvent } from 'discord-api-types/v10';
	import { onMount } from 'svelte';
	import type { PageServerParentData } from '../../$types';
	import type { GETResponse } from '../../../../api/guilds/[guildId]/audit-logs/+server';

	const { data }: { data: PageServerParentData } = $props();
	let logs: GETResponse | null = $state(null);

	let userOptions = $state<RUser[]>([]);
	let selectedUsers = $state<RUser[]>([]);
	let selectedActions = $state<string[]>([]);
	let isLoading = $state(false);
	let before: null | string = null;
	let after: null | string = null;

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

		const res = await fetch(`/api/users/search?query=${v}`)
			.then((r) => (r.ok ? (r.json() as Promise<RUser[]>) : []))
			.catch(() => []);

		userOptions = res || [];
	};

	const get = async () => {
		isLoading = true;

		const url = `/api/guilds/${page.params.guildId}/audit-logs?user_id=${
			selectedUsers[0]?.id || ''
		}&action_type=${
			selectedActions[0]
				? Object.entries(AuditLogEvent).find(
						([, v]) => selectedActions[0].replace(/\s/g, '') === String(v).replace(/_/g, ''),
					)?.[0]
				: ''
		}&before=${before || ''}&after=${after || ''}`;

		const res = await fetch(url);
		if (!res.ok) {
			console.error(`Audit log fetch failed: ${res.status}`);
			logs = null;
			return;
		}
		logs = await res.json();
		isLoading = false;
	};

	onMount(() => {
		get();
	});

	const next = async () => {
		const cursorId = logs?.audit_log_entries.at(-1)?.id;

		if (!cursorId) return;
		before = cursorId;

		await get();

		setTimeout(() => {
			before = null;
		}, 0);
	};

	const prev = async () => {
		const cursorId = logs?.audit_log_entries[0]?.id;

		if (!cursorId) return;
		after = cursorId;

		await get();

		setTimeout(() => {
			after = null;
		}, 0);
	};

	const pascalToReadable = (str: string) => {
		return str
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};
</script>

<div class="flex flex-row justify-start items-start bg-main-dark relative h-99.9lvh w-full">
	<section class="bg-main-light h-full w-20vw flex flex-col justify-center items-center p-2 gap-3">
		<Select
			maxOpts={1}
			label="Filter by user"
			options={userOptions}
			searchable={true}
			ontyping={(e) => search(e)}
			required={false}
			minOpts={0}
			bind:selectedOptions={selectedUsers}
		/>

		<Select
			maxOpts={1}
			label="Filter by action"
			options={Object.entries(AuditLogEvent)
				.filter(([, v]) => typeof v === 'string')
				.map(([, value]) => pascalToReadable(String(value)))}
			searchable={true}
			ontyping={(e) => search(e)}
			required={false}
			minOpts={0}
			bind:selectedOptions={selectedActions}
		/>

		{#if isLoading}
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
				<span class="color-alt-text">Loading...</span>
			</div>
		{:else}
			<Button text="Refresh" style="secondary" onclick={() => get()} />

			<div class="w-full flex flex-row justify-center items-center gap-5 mb-5">
				<Button
					emoji={{ animated: false, id: '◀️' }}
					text=""
					style="secondary-outline"
					onclick={() => prev()}
				/>
				<Button
					emoji={{ animated: false, id: '▶️' }}
					text=""
					style="secondary-outline"
					onclick={() => next()}
				/>
			</div>
		{/if}
	</section>

	<div class="flex-grow of-y-auto of-x-hidden h-full py-2">
		<section class="flex flex-col justify-center items-center gap-2">
			{#if logs}
				{#key logs}
					{#each logs.audit_log_entries as entry (entry.id)}
						{@const targetType = targetTypes[entry.action_type]}
						{@const addedRoles = entry.changes?.find((c) => c.key === '$add')?.new_value || []}
						{@const removedRoles = entry.changes?.find((c) => c.key === '$remove')?.new_value || []}

						<div class="bg-main-darker p-2 rounded-xl mx-5 w-95%">
							<div class="flex flex-col">
								<div class="flex flex-row justify-between items-start">
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
									<Timestamp time={getTimestampFromID(entry.id)} type="R" />
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
				{/key}
			{/if}
		</section>
	</div>
</div>
