<script lang="ts">
	import TextInput from '$lib/components/form/TextInput.svelte';
	import User from '$lib/components/mentions/User.svelte';
	import Emoji from '$lib/components/message/emoji.svelte';
	import Sound from '$lib/components/message/sound.svelte';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();
	let query = $state('');
</script>

<div class="w-50% m-auto py-2">
	<TextInput id="query" required={false} label="Search Stickers" bind:val={query} />
</div>

<div class="flex w-full flex-row justify-evenly flex-wrap items-center gap-2 mb-5">
	{#each data.sounds
		.filter((e) => e.name?.toLowerCase().includes(query.toLowerCase()))
		.sort((a, b) => a.name!.localeCompare(b.name!)) as sound, i}
		<div
			class="w-20% flex flex-col justify-center items-center gap-2 hover:bg-main-light duration-100 transition-all ease-in-out rounded-xl p-2"
			class:op-50={!sound.available}
		>
			<Sound sound={{ ...sound, name: '', emoji_id: '', emoji_name: '' }} />

			<div class="flex flex-row justify-start items-center gap-2 px-2">
				{#if sound.emoji_id || sound.emoji_name}
					<Emoji animated={false} id={sound.emoji_id} name={sound.emoji_name || ''} small={false} />
				{/if}

				<TextInput
					disabled={true}
					label="Emoji Name"
					id={sound.sound_id}
					maxLen={30}
					minLen={2}
					required={true}
					size="short"
					val={sound.name!}
				/>
			</div>
		</div>
	{/each}
</div>
