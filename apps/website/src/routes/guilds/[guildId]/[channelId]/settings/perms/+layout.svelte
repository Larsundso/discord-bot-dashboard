<script lang="ts">
	import { page } from '$app/state';
	import { OverwriteType } from 'discord-api-types/v10';
	import type { PageServerParentData } from '../../$types';
	import User from '$lib/components/mentions/User.svelte';
	import Role from '$lib/components/mentions/Role.svelte';
	import type { Snippet } from 'svelte';

	const { data, children }: { data: PageServerParentData; children: Snippet } = $props();
	const channel = $derived.by(() => data.channels.find((c) => c.id === page.params.channelId)!);
	const roleOWs = $derived(
		(channel.permission_overwrites || [])
			.filter((ow) => ow.type === OverwriteType.Role)
			.filter((ow) => ow.id !== data.guild.id)
			.map((ow) => ({ ...ow, role: data.roles.find((r) => r.id === ow.id) }))
			.sort((b, a) => (a.role?.position || 0) - (b.role?.position || 0)),
	);
	const userOWs = $derived(
		(channel.permission_overwrites || []).filter((ow) => ow.type === OverwriteType.Member),
	);
	const everyoneOW = $derived(
		(channel.permission_overwrites || []).find(
			(ow) => ow.type === OverwriteType.Role && ow.id === data.guild.id,
		),
	);
</script>

<div class="flex flex-row justify-start items-start bg-main-dark relative h-100vh of-hidden w-full">
	<div class="flex flex-col justify-start items-center gap-2 pt-2 bg-main-light h-99.9vh p-1">
		{#each [...roleOWs, everyoneOW!, ...userOWs] as ow}
			{#if ow.id === data.guild.id}
				<hr class="content-empty w-full h-0.1 border-0px border-t-1px border-solid border-main-dark" />
			{/if}

			<a
				class=" hover:bg-main-dark transition-all duration-100 ease-in-out w-full p-1 rounded-lg"
				href="/guilds/{data.guild.id}/{channel.id}/settings/perms/{ow.id}"
				class:bg-main-darker={page.url.href.endsWith(ow.id)}
			>
				{#if ow.type === OverwriteType.Member}
					<User id={ow.id} />
				{:else}
					<Role id={ow.id} />
				{/if}
			</a>

			{#if ow.id === data.guild.id}
				<hr class="content-empty w-full h-0.1 border-0px border-t-1px border-solid border-main-dark" />
			{/if}
		{/each}
	</div>

	<div class="flex-grow of-y-auto of-x-hidden">
		{@render children()}
	</div>
</div>
