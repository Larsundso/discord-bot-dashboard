<script lang="ts" generics="T extends 'user' | 'role' | 'channel'">
	import type { RGuild } from '$lib/scripts/RTypes';
	import Channel from './mentions/Channel.svelte';
	import Role from './mentions/Role.svelte';
	import User from './mentions/User.svelte';

	interface Props {
		type: T;
		id: string;
		guild?: T extends 'channel' ? RGuild : undefined;
	}

	const { type, id, guild }: Props = $props();
</script>

{#if type === 'user'}
	<User {id} />
{:else if type === 'role'}
	<Role {id} />
{:else if type === 'channel' && guild}
	<Channel {id} {guild} />
{/if}
