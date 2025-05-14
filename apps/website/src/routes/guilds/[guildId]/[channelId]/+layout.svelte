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
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins h-100vh w-full overflow-hidden"
>
	<!-- Main content area with proper width calculation to avoid overlap -->
	<div class="flex flex-grow flex-col w-full md:w-[calc(100%-240px)] h-full overflow-hidden">
		<!-- Fixed channel header -->
		<div class="w-full sticky top-0 z-10 bg-main-darker">
			<div
				class="flex flex-row justify-start items-center gap-2 px-3 sm:px-4 md:px-5 py-2 overflow-hidden"
			>
				<ChannelIcon {channel} guild={data.guild} />
				<span class="truncate">{channel.name}</span>
				{channel.topic?.length ? '|' : ''}
				<span class="color-alt-text truncate hidden sm:inline">
					{channel.topic?.slice(0, 50)}
					{channel.topic && channel.topic.length > 50 ? '...' : ''}
				</span>
			</div>
		</div>

		<div
			class="overflow-y-auto overflow-x-hidden px-2 w-[calc(100%-6.35cm)]"
		>
			{@render children()}
		</div>

		<div class="sticky bottom-0 w-[calc(100%-6.35cm)]  bg-main-dark py-2 z-10">
			<div class="px-4 mb-2 w-full">
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
	</div>

	<div class="hidden md:block fixed right-0 top-0 bottom-0 h-full w-60">
		<MemberBar members={data.members} roles={data.roles} guild={data.guild} />
	</div>
</div>
