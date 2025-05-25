<script lang="ts">
	import SettingsBar from '$lib/components/SettingsBar.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData, LayoutParentData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData & LayoutParentData } = $props();
</script>

<section
	class="fixed w-100vw h-100vh bg-main-dark left-0 top-0 z-50 flex flex-row justify-start items-start  of-hidden"
>
	<SettingsBar guild={data.guild} />

	<div class="flex-grow of-y-auto of-x-hidden h-full" style="max-height: 100vh;">
		{@render children()}
	</div>
</section>
