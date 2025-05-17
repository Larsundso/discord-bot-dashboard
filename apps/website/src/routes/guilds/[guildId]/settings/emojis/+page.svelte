<script lang="ts">
	import { page } from '$app/state';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Role from '$lib/components/mentions/Role.svelte';
	import Emoji from '$lib/components/message/emoji.svelte';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();
	let query = $state('');
	let selected: null | string = $state(null);
</script>

<div class="w-50% m-auto py-2">
	<TextInput id="query" required={false} label="Search Emojis" bind:val={query} />
</div>

{#if selected}
	{@const emoji = data.emojis.find((e) => e.id === selected)!}

	<span class="flex flex-row w-max m-auto py-2 gap-1 flex-wrap">
		<Emoji animated={emoji.animated || false} id={emoji.id} name={emoji.name!} small={true} />
		can be used by
		{#if !emoji?.roles?.length}
			<Role id={page.params.guildId} />
		{:else}
			{#each emoji.roles as role}
				<Role id={role} />
			{/each}
		{/if}
	</span>
{/if}

<div class="flex w-full flex-row justify-evenly flex-wrap items-center gap-2">
	{#each data.emojis
		.filter((e) => e.name?.toLowerCase().includes(query.toLowerCase()))
		.sort((a, b) => a.name!.localeCompare(b.name!)) as emoji}
		<button
			class="w-15% flex flex-row justify-center items-center gap-2 hover:bg-main-light duration-100 transition-all ease-in-out rounded-xl p-2"
			class:bg-main-lighter={selected === emoji.id}
			onclick={() => (selected = emoji.id)}
			onkeydown={(e) => {
				if (e.key === 'Enter') selected = emoji.id;
			}}
		>
			<Emoji animated={emoji.animated!} id={emoji.id} name={emoji.name!} small={false} />

			<TextInput
				disabled={true}
				label="Emoji Name"
				id={emoji.id}
				maxLen={32}
				minLen={2}
				required={true}
				size="short"
				val={emoji.name!}
			/>
		</button>
	{/each}
</div>
