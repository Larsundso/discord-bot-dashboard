<script lang="ts">
	import type { RChannel, RRole, RUser } from '$lib/scripts/RTypes';

	const {
		option,
	}: {
		option: string | RUser | RChannel | RRole;
	} = $props();

	let hasErrored = false;
	let replaceImage: null | string = $state(null);

	const handleError = () => {
		if (hasErrored) return;

		hasErrored = true;
		replaceImage = '/images/member.webp';
	};
</script>

<div class="flex flex-row items-center gap-2">
	{#if typeof option === 'string'}
		<span>{option}</span>
	{:else}
		{#if 'avatar_url' in option}
			<img
				src={replaceImage || option.avatar_url || '/images/member.webp'}
				alt=""
				height="32"
				width="32"
				class="rounded-full"
				onerror={handleError}
			/>
		{/if}

		{#if 'global_name' in option}
			<span>{option.global_name}</span>
		{/if}

		{#if 'username' in option}
			<span>({option.username})</span>
		{/if}
	{/if}
</div>
