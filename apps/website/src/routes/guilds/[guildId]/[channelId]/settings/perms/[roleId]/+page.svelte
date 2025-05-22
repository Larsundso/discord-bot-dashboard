<script lang="ts">
	import { page } from '$app/state';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import {
		PermissionsBitField,
		type PermissionsString,
	} from '$lib/scripts/util/PermissionsBitField';
	import type { PageServerParentData } from '../../../$types';

	const { data }: { data: PageServerParentData } = $props();
	let query = $state('');
	const channel = $derived.by(() => data.channels.find((c) => c.id === page.params.channelId)!);
	const overwrite = $derived.by(() => {
		const ow = (channel.permission_overwrites || []).find((ow) => ow.id === page.params.roleId);
		return ow;
	});

	const allowed = $derived(new PermissionsBitField(BigInt(overwrite?.allow || '0')));
	const denied = $derived(new PermissionsBitField(BigInt(overwrite?.deny || '0')));

	const makePascalHumanReadable = (str: string) => {
		return str
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, (str) => str.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/-/g, ' ');
	};
</script>

<div class="flex flex-row justify-center items-center m-auto w-50% mt-3">
	<TextInput required={false} label="Permission filter" bind:val={query} />
</div>

<section
	class="w-100% m-auto flex flex-col justify-start gap-3 pt-6 pb-6 max-h-99.9vh overflow-y-auto px-4"
>
	{#each Object.keys(allowed.serialize()).filter((k) => makePascalHumanReadable(k)
			.toLowerCase()
			.includes(query.toLowerCase())) as perm}
		{@const permAllowed = allowed.toArray().includes(perm as PermissionsString)}
		{@const permDenied = denied.toArray().includes(perm as PermissionsString)}
		{@const isNull = !permAllowed && !permDenied}

		<div
			class="flex flex-row justify-between items-center bg-main-lighter hover:bg-main-light transition-colors duration-200 rounded-lg px-4 py-3 border border-dark"
		>
			<span class="font-medium text-surface-900">
				{makePascalHumanReadable(perm)}
			</span>

			<div class="flex items-center gap-2">
				{#if isNull}
					<div class="w-2 h-2 rounded-full bg-gray-400"></div>
					<span class="text-sm text-gray-500 font-medium">Not Set</span>
				{:else if permAllowed}
					<div class="w-2 h-2 rounded-full bg-green-500"></div>
					<span class="text-sm text-green-600 font-medium">Allowed</span>
				{:else if permDenied}
					<div class="w-2 h-2 rounded-full bg-red-500"></div>
					<span class="text-sm text-red-600 font-medium">Denied</span>
				{/if}
			</div>
		</div>
	{/each}
</section>
