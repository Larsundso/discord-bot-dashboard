<script lang="ts">
	import GuildInfo from '$lib/components/GuildInfo.svelte';
	import type { LayoutData, PageData } from './$types';

	const { data }: { data: LayoutData & PageData } = $props();
	const { guild, roles, emojis, stickers, sounds } = $derived(data);
</script>

<GuildInfo {guild} {roles} {emojis} {stickers} {sounds} />
