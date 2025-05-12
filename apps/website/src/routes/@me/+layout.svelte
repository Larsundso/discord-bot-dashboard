<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutServerData, LayoutServerParentData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutServerData & LayoutServerParentData } =
		$props();
</script>

{@render children()}
