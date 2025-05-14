<script lang="ts">
	import type { RGuild } from '$lib/scripts/RTypes';
	import { parse } from 'discord-markdown-parser';
	import AstTree from './astTree.svelte';

	const { content, guild }: { content: string | null; guild?: RGuild } = $props();

	const parsed = $derived(content ? parse(content, 'extended') : null);
</script>

{#if parsed}
	<div class="whitespace-nowrap">
		{#each parsed as parse}
			<AstTree {parse} {guild} />
		{/each}
	</div>
{/if}
