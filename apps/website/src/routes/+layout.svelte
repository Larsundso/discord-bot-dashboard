<script lang="ts">
	import './main.css';

	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="bg-main w-full h-full">
	{@render children()}
</div>
