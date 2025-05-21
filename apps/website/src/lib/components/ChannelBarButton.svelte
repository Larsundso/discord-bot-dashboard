<script lang="ts">
	const {
		href,
		text,
		icon,
		active = false,
	}: {
		href: string;
		text: string;
		icon?:
			| 'roles'
			| 'emojis'
			| 'stickers'
			| 'sounds'
			| 'members'
			| 'invites'
			| 'bans'
			| 'audit-logs';
		active?: boolean;
	} = $props();
</script>

<a
	{href}
	class="flex flex-row gap-1 justify-start items-center hover:bg-main-dark p-1 rounded-md w-full"
	class:bg-main-light={active}
>
	{#if icon}
		<i
			class="block w-6 h-6 color-alt-text"
			class:i-tabler-tag-filled={icon === 'roles'}
			class:i-tabler-mood-smile-filled={icon === 'emojis'}
			class:i-tabler-file-smile-filled={icon === 'stickers'}
			class:i-tabler-device-speaker-filled={icon === 'sounds'}
			class:i-tabler-user-filled={icon === 'members'}
			class:i-tabler-link={icon === 'invites'}
			class:i-tabler-hammer={icon === 'bans'}
			class:i-tabler-logs={icon === 'audit-logs'}
		></i>
	{/if}
	{text}
</a>
