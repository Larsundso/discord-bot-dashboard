<script lang="ts">
	import GuildInfo from '$lib/components/GuildInfo.svelte';
	import type { LayoutParentData, PageServerData, PageParentData } from './$types';

	const { data }: { data: PageParentData & LayoutParentData & PageServerData } = $props();
	const { guild, roles, emojis, stickers, sounds } = $derived(data);
</script>

<GuildInfo {guild} {roles} {emojis} {stickers} {sounds} />
