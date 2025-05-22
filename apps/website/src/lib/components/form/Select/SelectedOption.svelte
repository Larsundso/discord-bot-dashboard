<script lang="ts">
	import Channel from '$lib/components/mentions/Channel.svelte';
	import Role from '$lib/components/mentions/Role.svelte';
	import User from '$lib/components/mentions/User.svelte';
	import type { RChannel, RRole, RUser } from '$lib/scripts/RTypes';

	type Option = string | RRole | RChannel | RUser;

	const {
		single,
		optionClick,
		opt,
	}: { single: boolean; optionClick: (opt: Option) => void; opt: Option } = $props();
</script>

{#if single}
	<div
		class="relative w-full"
		onclick={(e) => optionClick(opt)}
		onkeydown={(e) => (e.key === 'Enter' ? optionClick(opt) : undefined)}
		role="button"
		tabindex="0"
		aria-label="Toggle Select"
	>
		<span>
			{#if typeof opt === 'string'}
				{opt}
			{:else if 'username' in opt}
				<User id={opt.id} />
			{:else if 'color' in opt}
				<Role id={opt.id} />
			{:else if 'name' in opt}
				<Channel id={opt.id} />
			{/if}
		</span>
	</div>
{:else}
	<div
		class="px-2 py-1 bg-neutral-800 rounded-md flex flex-row justify-between items-center gap-2"
		onclick={() => optionClick(opt)}
		onkeydown={(e) => (e.key === 'Enter' ? optionClick(opt) : undefined)}
		role="button"
		tabindex="0"
		aria-label="Remove Select"
	>
		<span>
			{#if typeof opt === 'string'}
				{opt}
			{:else if 'username' in opt}
				<User id={opt.id} />
			{:else if 'color' in opt}
				<Role id={opt.id} />
			{:else if 'name' in opt}
				<Channel id={opt.id} />
			{/if}
		</span>
		<div class="w-4">
			<span class="i-tabler-x block pointer-events-none select-none"></span>
		</div>
	</div>
{/if}
