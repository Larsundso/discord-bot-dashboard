<script lang="ts">
	let {
		title,
		name,
		checked = $bindable(false),
		required = false,
		type = 'on/off',
		disabled = false,
		oncheck,
		width = 'small',
		order = 'normal',
	}: {
		title?: string;
		name: string;
		checked?: boolean;
		required?: boolean;
		type?: 'y/n' | 'on/off';
		disabled?: boolean;
		oncheck?: (name: string, state: boolean) => void;
		width?: 'small' | 'full';
		order?: 'normal' | 'reverse';
	} = $props();
</script>

<div class:cursor-not-allowed={disabled} class:op-60={disabled} class:w-full={width === 'full'}>
	<label
		class="flex flex-row items-center relative cursor-pointer select-none relative"
		class:w-full={width === 'full'}
		class:justify-between={width === 'full'}
		class:w-max={width === 'small'}
		class:cursor-not-allowed={disabled}
		class:flex-row-reverse={order === 'reverse'}
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
			class="absolute font-medium uppercase text-10px top-1.6"
			class:left-2={order === 'reverse'}
			class:right-2={order === 'normal'}
			class:text-main-text={checked}
			class:text-black={!checked}
			class:cursor-not-allowed={disabled}
		>
			{type === 'y/n' ? 'no' : 'off'}
		</span>

		<span
			class="absolute font-medium uppercase text-10px top-1.6"
			class:left-8={order === 'reverse'}
			class:right-8={order === 'normal'}
			class:text-main-text={checked}
			class:text-black={!checked}
			class:cursor-not-allowed={disabled}
		>
			{type === 'y/n' ? 'yes' : 'on'}
		</span>

		<span
			class="w-6 h-6 absolute rounded-full transition ease-in-out duration-.15s bg-neutral-100"
			class:right-7.2={order === 'normal'}
			class:left-7.2={order === 'reverse'}
			class:translate-x-6.4={checked && order === 'normal'}
			class:-translate-x-6.4={checked && order === 'reverse'}
			class:cursor-not-allowed={disabled}
		></span>
	</label>
</div>
