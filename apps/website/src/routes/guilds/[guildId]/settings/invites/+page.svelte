<script lang="ts">
	import { page } from '$app/state';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Timestamp from '$lib/components/form/Timestamp.svelte';
	import Channel from '$lib/components/mentions/Channel.svelte';
	import User from '$lib/components/mentions/User.svelte';
	import type { PageParentData, PageServerData } from './$types';

	const { data }: { data: PageServerData & PageParentData } = $props();
</script>

<div class="flex w-full flex-row justify-evenly flex-wrap items-center gap-2 mb-5 p-3">
	{#each data.invites.sort((a, b) => a.code!.localeCompare(b.code!)) as invite}
		<div
			class="w-33% flex flex-col justify-center items-start gap-2 hover:bg-main-light duration-100 transition-all ease-in-out rounded-xl p-2"
		>
			<TextInput
				disabled={true}
				label="Emoji Name"
				id={invite.code}
				maxLen={32}
				minLen={2}
				required={true}
				size="short"
				val={invite.code!}
			/>

			<div class="flex flex-row justify-start items-center gap-2 truncate w-full flex-wrap">
				{#if invite.channel_id}
					<span class="b-l-2px b-main-darker rounded-lg b-solid pl-2">
						Created in:
						<Channel guild={data.guild} id={invite.channel_id} />
					</span>
				{/if}

				{#if invite.inviter_id}
					<span class="b-l-2px b-main-darker rounded-lg b-solid pl-2">
						Created by:
						<User id={invite.inviter_id} />
					</span>
				{/if}

				{#if invite.expires_at}
					<span class="b-l-2px b-main-darker rounded-lg b-solid pl-2">
						Expires at: <Timestamp time={new Date(invite.expires_at).getTime()} type="R" />
					</span>
				{/if}

				{#if invite.uses}
					<span class="b-l-2px b-main-darker rounded-lg b-solid pl-2">
						Uses: <br />
						{invite.uses}{invite.max_uses ? `/${invite.max_uses}` : ''}
					</span>
				{/if}
			</div>
		</div>
	{/each}
</div>
