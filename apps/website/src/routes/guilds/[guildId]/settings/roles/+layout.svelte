<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData, LayoutParentData } from './$types';
	import RolesBar from '$lib/components/RolesBar.svelte';

	const { data, children }: { children: Snippet; data: LayoutData & LayoutParentData } = $props();
</script>

<div
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins h-100vh of-hidden w-full"
>
	<RolesBar roles={data.roles} guild={data.guild} />

	<div class="flex-grow of-y-auto of-x-hidden">
		{@render children()}
	</div>
</div>
