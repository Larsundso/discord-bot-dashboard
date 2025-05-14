<script lang="ts">
	let {
		required = false,
		maxLen,
		minLen,
		maxVal,
		minVal,
		type = 'text',
		label,
		id = Math.random().toString(36).substring(7),
		size,
		onupdate,
		class: className,
		value = $bindable(''),
  onkeydown,
	}: {
		required: boolean;
		type?: 'text' | 'number' | 'email' | 'password';
		maxLen?: number;
		minLen?: number;
		maxVal?: number;
		minVal?: number;
		val?: string;
		label: string;
		id?: string;
		size?: 'short' | 'paragraph';
		onupdate?: (v: string | number | null) => void;
		class?: string;
		value?: string;
  onkeydown?: (e: KeyboardEvent) => void;
	} = $props();

	let queued = false;

	const update = () => {
		if (queued) return;
		queued = true;

		setTimeout(() => {
			queued = false;
			onupdate?.(value);
		}, 500);
	};
</script>

<div class={className}>
	<div {id} class="cursor-pointer bg-main-darker rounded-md relative">
		<div class="w-full relative text-left">
			{#if size === 'paragraph'}
				<textarea
					onkeydown={(e) => onkeydown?.(e)}
					name={id}
					maxlength={maxLen}
					minlength={minLen}
					{required}
					bind:value
					{id}
					tabindex="-1"
					class="bg-transparent w-full -mb-2 -mt-0.5 h-20 pl-2 pt-2 focus:outline-none text-sm sm:text-base"
					oninput={() => update()}
				></textarea>
			{:else}
				<input
					onkeydown={(e) => onkeydown?.(e)}
					name={id}
					{type}
					maxlength={maxLen}
					minlength={minLen}
					max={maxVal}
					min={minVal}
					{required}
					bind:value
					{id}
					tabindex="-1"
					class="bg-transparent w-full h-full p-2 focus:outline-none btn text-sm sm:text-base"
					oninput={update}
				/>
			{/if}

			<label
				for={id}
				class="color-neutral-500 absolute left-2 pointer-events-none select-none top-2"
				class:hidden={value !== null && String(value)?.length}
			>
				{label}
			</label>
		</div>

		<div
			class="color-neutral-500 text-2.5 absolute right-0.75 bottom-0"
			class:color-red-500={(maxLen && String(value || '').length > maxLen) ||
				(minLen && String(value || '').length < minLen)}
		>
			{Number(String(value ?? '').length)}
		</div>
	</div>

	{#if required && !String(value ?? '')?.length}
		<div class="color-red-500 text-2.5">This must have a value</div>
	{/if}

	{#if maxLen && String(value ?? '').length > maxLen}
		<div class="color-red-500 text-2.5">This value is too long</div>
	{/if}

	{#if minLen && String(value ?? '').length < minLen}
		<div class="color-red-500 text-2.5">This value is too short</div>
	{/if}

	{#if type === 'number' && maxVal && Number(value) > maxVal}
		<div class="color-red-500 text-2.5">This value is too high</div>
	{/if}

	{#if type === 'number' && minVal && Number(value) < minVal}
		<div class="color-red-500 text-2.5">This value is too low</div>
	{/if}
</div>
