<script lang="ts">
	import type { RChannel, RRole, RUser } from '$lib/scripts/RTypes';
	import SelectedOption from './SelectedOption.svelte';

	const {
		selectedOptions,
		single,
		label,
		optionClick,
	}: {
		selectedOptions: (string | RUser | RChannel | RRole)[];
		single: boolean;
		label: string;
		optionClick: (opt: string | RUser | RChannel | RRole) => void;
	} = $props();
</script>

{#if selectedOptions.length}
	<div class="flex flex-row flex-wrap gap-1 items-center">
		{#each selectedOptions as opt, j (j)}
			<SelectedOption {single} {optionClick} {opt} />
		{/each}

		{#if !single}
			<div class="color-neutral-500 select-none pointer-events-none">{label}</div>
		{/if}
	</div>
{:else}
	<div class="color-neutral-500 select-none pointer-events-none">{label}</div>
{/if}
