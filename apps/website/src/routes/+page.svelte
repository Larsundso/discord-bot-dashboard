<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let success = $state(false);
</script>

<img src="images/login-background.svg" alt="" class="w-full h-full" />

<section
	class="absolute top-50% left-50% -translate-x-50% -translate-y-50% px-4 flex flex-col justify-center items-center pb-6
 border-1px border-solid border-[rgba(255,255,255,0.25)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.15)] rounded-md backdrop-blur-8.1px"
>
	<h1 class="text-xl m-4">Enter your bot token</h1>

	{#if success}
		<span>
			<p class="text-lg">Login successful! Loading your data...</p>
			<p class="text-lg">Please wait</p>
		</span>
	{:else}
		<form
			class="flex flex-col gap-2 justify-center items-center gap-5"
			action="?/login"
			method="POST"
			use:enhance={() => () => {
				success = true;
				setTimeout(() => {
					invalidateAll();
					location.assign(`http://${page.url.host}/@me`);
				}, 3000);
			}}
		>
			<div class="relative">
				<input
					type="password"
					placeholder="Token"
					id="token"
					class="p-2 py-1 rounded-md border-none text-lg min-w-120 text-center"
					name="token"
					required={true}
				/>

				{#if form?.incorrect}<p class="color-danger absolute text-sm top-5 left-1">
						Invalid token!
					</p>{/if}
			</div>

			<input type="submit" value="Login" class="w-50 btn-success border-none p-2 text-lg" />
		</form>
	{/if}
</section>
