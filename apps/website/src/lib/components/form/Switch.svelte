<script lang="ts">
	let {
		title,
		name,
		checked = $bindable(false),
		required = false,
		type = 'on/off',
		disabled = false,
		oncheck,
	}: {
		title?: string;
		name: string;
		checked?: boolean;
		required?: boolean;
		type?: 'y/n' | 'on/off';
		disabled?: boolean;
		oncheck?: (name: string, state: boolean) => void;
	} = $props();
</script>

<div class:cursor-not-allowed={disabled} class:op-60={disabled}>
	<label
		class="flex items-center relative w-max cursor-pointer select-none relative"
		class:cursor-not-allowed={disabled}
	>
		{#if title}
			<span class="mr-3">
				{title}
			</span>
		{/if}

		<input
			{disabled}
			{required}
			{name}
			type="checkbox"
			class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none"
			class:cursor-not-allowed!={disabled}
			class:bg-check-checked={checked}
			class:bg-check-unchecked={!checked}
			onchange={() => oncheck?.(name, checked)}
			bind:checked
		/>
		<span
			class="absolute font-medium uppercase text-10px right-2 top-1.6"
			class:text-main-text={checked}
			class:text-black={!checked}
			class:cursor-not-allowed={disabled}
		>
			{type === 'y/n' ? 'no' : 'off'}
		</span>
		<span
			class="absolute font-medium uppercase text-10px right-8 top-1.6"
			class:text-main-text={checked}
			class:text-black={!checked}
			class:cursor-not-allowed={disabled}
		>
			{type === 'y/n' ? 'yes' : 'on'}
		</span>
		<span
			class="w-6 h-6 right-7.2 absolute rounded-full transition ease-in-out duration-.15s bg-neutral-100"
			class:translate-x-6.4={checked}
			class:cursor-not-allowed={disabled}
		></span>
	</label>
</div>
