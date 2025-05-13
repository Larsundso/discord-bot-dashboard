<script lang="ts">
	import type { RChannel, RRole, RUser } from '$lib/scripts/RTypes';
	import OptionDisplay from './OptionDisplay.svelte';

	const {
		optionClick,
		required,
		opt,
		single,
		selectedOptions,
		i,
	}: {
		i: number;
		selectedOptions: (string | RUser | RRole | RChannel)[];
		required: boolean;
		opt: string | RUser | RRole | RChannel;
		single: boolean;
		optionClick: (opt: string | RUser | RRole | RChannel) => void;
	} = $props();
</script>

<div
	onclick={() => optionClick(opt)}
	onkeydown={(e) => (e.key === 'Enter' ? optionClick(opt) : undefined)}
	role="button"
	tabindex="0"
	class="text-left px-2 py-2 hover:bg-main-dark-hover relative"
	class:bg-main-dark-hover={selectedOptions.includes(opt)}
	class:color-white:50={!required && !i}
	aria-label="Toggle Select"
>
	<span>
		<OptionDisplay option={opt} />
	</span>
	{#if !single}
		<div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
			{#if selectedOptions.includes(opt) && (!!i || required)}
				<span class="i-tabler-checkbox select-none block"></span>
			{:else if !!i || required}
				<span class="i-tabler-square-dashed select-none block"></span>
			{/if}
		</div>
	{:else if selectedOptions.includes(opt)}
		<div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
			<span class="i-tabler-circle-check select-none block"></span>
		</div>
	{/if}
</div>
