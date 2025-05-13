<script lang="ts">
	import type { RChannel, RRole, RUser } from '$lib/scripts/RTypes';
	import Option from './Option.svelte';
	type TOption = RUser | RChannel | RRole | string;

	const {
		expanded,
		options,
		single,
		required,
		selectedOptions,
		optionClick,
		selectSearch,
	}: {
		expanded: boolean;
		options: TOption[];
		single: boolean;
		required: boolean;
		selectedOptions: TOption[];
		optionClick: (opt: TOption) => void;
		selectSearch: string;
	} = $props();

	const filter = (o: TOption) => {
		if (typeof o === 'string') return o.toLowerCase().includes(selectSearch);

		return true;
	};
</script>

{#if expanded}
	<div
		class="absolute top-full right-1/2 translate-x-1/2 bg-main-dark b-1px b-solid b-main-darkest w-full z-100 rounded-md max-h-50 scroll-auto of-x-hidden select-none"
	>
		{#each required ? options.filter(filter) : ['Clear selection', ...options.filter(filter)] as opt, i}
			<Option {i} {required} opt={opt as TOption} {single} {selectedOptions} {optionClick} />
		{/each}
	</div>
{/if}
