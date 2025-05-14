<script lang="ts">
	import type { RGuild } from '$lib/scripts/RTypes';
	import { parse } from 'discord-markdown-parser';
	import ASTree from './ASTree.svelte';

	const { content, guild }: { content: string | null; guild?: RGuild } = $props();

	const parsed = $derived(content ? parse(content, 'extended') : null);
</script>

{#if parsed}
	<div class="whitespace-nowrap">
		{#each parsed as parse}
			<ASTree {parse} {guild} useLargeEmojis={!parsed.find((p) => p.type !== 'emoji')} />
		{/each}
	</div>
{/if}
