<script lang="ts">
	import type { RSoundboardSound } from '$lib/scripts/RTypes';
	import Emoji from './emoji.svelte';

	const { sound }: { sound: RSoundboardSound } = $props();
</script>

<figure class="flex flex-col items-center">
	<audio controls>
		<source src={sound.sound_url} type="audio/mp3" />
	</audio>
	<figcaption class="text-xs text-alt-text flex flex-row">
		{#if sound.emoji_id && sound.emoji_name}
			<Emoji animated={false} id={sound.emoji_id} name={sound.emoji_name} small={true} />
		{:else if sound.emoji_name}
			{sound.emoji_name}
		{/if}

		{sound.name}
	</figcaption>
</figure>
