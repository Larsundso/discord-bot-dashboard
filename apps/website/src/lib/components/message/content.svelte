<script lang="ts">
	import type { RGuild } from '$lib/scripts/RTypes';
	import { parse } from 'discord-markdown-parser';
	import ASTree from './ASTree.svelte';

	const {
		content,
		guild,
		inEmbed = false,
	}: { content: string | null; guild?: RGuild; inEmbed?: boolean } = $props();

	const parsed = $derived(content ? parse(content, 'extended') : null);
</script>

{#if parsed}
	<div class="whitespace-normal inline-block" class:max-w-520px={inEmbed}>
		{#each parsed as parse}
			<ASTree {parse} {guild} useLargeEmojis={!parsed.find((p) => p.type !== 'emoji')} />
		{/each}
	</div>
{/if}
