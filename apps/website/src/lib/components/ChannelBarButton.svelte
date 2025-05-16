<script lang="ts">
	const {
		href,
		text,
		icon,
	}: {
		href: string;
		text: string;
		icon?:
			| 'settings'
			| 'roles'
			| 'emojis'
			| 'stickers'
			| 'sounds'
			| 'members'
			| 'invites'
			| 'integrations'
			| 'bans'
			| 'audit-logs';
	} = $props();
</script>

<a {href} class="flex flex-row gap-1 justify-start items-center hover:bg-main-dark p-1 rounded-md">
	{#if icon}
		<i
			class="block w-6 h-6 color-alt-text"
			class:i-tabler-settings-filled={icon === 'settings'}
			class:i-tabler-tag-filled={icon === 'roles'}
			class:i-tabler-mood-smile-filled={icon === 'emojis'}
			class:i-tabler-file-smile-filled={icon === 'stickers'}
			class:i-tabler-device-speaker-filled={icon === 'sounds'}
			class:i-tabler-user-filled={icon === 'members'}
			class:i-tabler-link={icon === 'invites'}
			class:i-tabler-robot={icon === 'integrations'}
			class:i-tabler-hammer={icon === 'bans'}
			class:i-tabler-logs={icon === 'audit-logs'}
		></i>
	{/if}
	{text}
</a>
