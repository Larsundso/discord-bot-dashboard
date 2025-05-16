<script lang="ts">
	import { page } from '$app/state';
	import type { RGuild, RRole } from '$lib/scripts/RTypes';
	import rgbaFromHex from '$lib/scripts/util/rgbaFromHex';

	const { roles, guild }: { roles: RRole[]; guild: RGuild } = $props();
</script>

<div
	class="flex flex-col justify-center items-start gap-2 text-sm of-y-auto of-x-hidden h-100lvh max-w-20% p-2"
>
	<div class="content-empty mt-1850"></div>

	{#each roles as role}
		{@const color = rgbaFromHex(role.color.toString(16).padStart(6, '0'))}
		<a
			class="flex flex-row justify-start items-center gap-2 p-2 color-alt-text w-full rounded-xl bg-[rgba(var(--bg-color-r),var(--bg-color-g),var(--bg-color-b),var(--bg-op))] max-h-10 min-h-10"
			style="--bg-color-r: {color[0]}; --bg-color-g: {color[1]}; --bg-color-b: {color[2]}; --bg-op: {page.url.pathname.includes(
				role.id,
			)
				? 0.6
				: 0.3}"
			href="/guilds/{guild.id}/settings/roles/{role.id}"
		>
			{#if role.icon_url}
				<img
					src={role.icon_url}
					class="h-auto max-h-8 w-auto max-w-8 rounded-full object-scale-down aspect-square object-center"
					alt=""
				/>
			{:else if role.unicode_emoji}
				<span class="w-8 h-auto">{role.unicode_emoji}</span>
			{/if}

			<span class="line-clamp-1">{role.name}</span>
		</a>
	{/each}
</div>
