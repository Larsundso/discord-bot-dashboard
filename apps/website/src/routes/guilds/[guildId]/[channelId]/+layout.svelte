<script lang="ts">
	import MemberBar from '$lib/components/MemberBar.svelte';
	import { type Snippet } from 'svelte';
	import type { LayoutData, LayoutServerParentData } from './$types';
	import ChannelIcon from '$lib/components/ChannelIcon.svelte';
	import type { RChannel } from '$lib/scripts/RTypes';
	import { page } from '$app/state';
	import TextInput from '$lib/components/form/TextInput.svelte';

	const { children, data }: { children: Snippet; data: LayoutData & LayoutServerParentData } =
		$props();
	let channel: RChannel = $derived(data.channels.find((c) => c.id === page.params.channelId)!);
	let message: string = $state('');

	const send = () => {
		fetch(`/api/channels/${channel.id}/messages`, {
			method: 'POST',
			body: JSON.stringify({ content: message }),
		});

		message = '';
	};
</script>

<div
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins of-y-auto of-x-hidden h-100vh of-hidden"
>
	<div class="w-336 fixed">
		<div class="flex flex-row justify-start items-center gap-2 px-5 py-2 bg-main-darker">
			<ChannelIcon {channel} guild={data.guild} />
			{channel.name}
			{channel.topic?.length ? '|' : ''}
			<span class="color-alt-text">
				{channel.topic?.slice(0, 100)}
			</span>
		</div>
	</div>

	<div class="w-336 h-90vh mt-10 of-y-auto of-x-hidden">
		{@render children()}
	</div>

	<div class="fixed bottom-0 w-336">
		<div class="px-4 mb-4">
			<TextInput
				maxLen={4000}
				minLen={0}
				required={false}
				label={`Message #${channel.name}`}
				onkeydown={(e) => (e.key === 'Enter' ? send() : null)}
				bind:val={message}
			/>
		</div>
	</div>

	<MemberBar members={data.members} roles={data.roles} guild={data.guild} />
</div>
