<script lang="ts">
	import type { RUser } from '$lib/scripts/RTypes';
	import Tooltip from './Tooltip.svelte';

	const { self }: { self: RUser } = $props();
	let currentName: null | string = $state(null);
</script>

<section class="absolute left-0 bottom-0 z-10 m-1 p-2 bg-main-pre-darkest rounded-md w-17%">
	<div class="flex flex-row justify-between items-center gap-2 sm:gap-3 md:gap-5">
		<div class="flex flex-row justify-center items-center gap-1 sm:gap-2">
			<img src={self.avatar_url} alt="" class="rounded-full w-8 sm:w-10 md:w-13" />
			<span class="text-sm sm:text-base truncate max-w-36 sm:max-w-40 md:max-w-full"
				>{self.global_name || self.username}</span
			>
		</div>

		<div class="flex flex-row justify-center items-center gap-2">
			<a
				class="before:relative after:relative hover:bg-main-light p-1 rounded-md"
				aria-label="Settings"
				onfocus={() => (currentName = 'Settings')}
				onmouseover={() => (currentName = 'Settings')}
				onblur={() => (currentName = null)}
				onmouseleave={() => (currentName = null)}
				href="/@me/settings"
			>
				<i class="i-tabler-settings-filled block w-5 h-5 color-check-unchecked"></i>
				<div class="absolute left-40 sm:left-50 md:left-60 -top-2">
					<Tooltip text={currentName} filter="Settings" />
				</div>
			</a>

			<a
				class="before:relative after:relative hover:bg-main-light p-1 rounded-md"
				aria-label="Logout"
				onfocus={() => (currentName = 'Logout')}
				onmouseover={() => (currentName = 'Logout')}
				onblur={() => (currentName = null)}
				onmouseleave={() => (currentName = null)}
				href="/"
			>
				<i class="i-tabler-logout block w-5 h-5 color-check-unchecked"></i>
				<div class="absolute left-40 sm:left-50 md:left-70 -top-2">
					<Tooltip text={currentName} filter="Logout" />
				</div>
			</a>
		</div>
	</div>
</section>
