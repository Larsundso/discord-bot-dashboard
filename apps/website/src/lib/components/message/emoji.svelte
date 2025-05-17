<script lang="ts">
	const {
		id,
		animated = false,
		name,
		small,
	}: { id: string; animated: boolean; name: string; small: boolean } = $props();
</script>

<div
	class="relative inline-block align-text-bottom flex flex-row justify-center items-center"
	class:w-6={small}
	class:h-6={small}
	class:w-10={!small}
	class:h-10={!small}
	role="tooltip"
>
	<img
		src={`https://cdn.discordapp.com/emojis/${id}${animated ? '.gif' : '.png'}?v=1`}
		alt={name}
		class="relative"
		class:inline={small}
		class:block={!small}
		loading="lazy"
		decoding="async"
	/>
</div>
