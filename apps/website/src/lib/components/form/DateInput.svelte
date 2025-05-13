<script lang="ts">
	const {
		min = new Date(),
		max,
		value = $bindable(new Date()),
		id,
		name,
		width = 'fit',
		required,
		placeholder,
		label,
	}: {
		min?: Date;
		max?: Date;
		value?: Date;
		id: string;
		name: string;
		width?: 'full' | 'fit';
		required?: boolean;
		placeholder?: string;
		label: string;
	} = $props();
</script>

<div>
	<label for={id} class="color-main-text text-3.5 ml-1 pointer-events-none select-none top-2">
		{label}
	</label>

	<div
		{id}
		class="cursor-pointer bg-main-darker rounded-md relative flex flex-col"
		class:w-fit={width === 'fit'}
		class:w-full={width === 'full'}
	>
		<input
			type="date"
			{id}
			{name}
			value={value.toLocaleDateString('en-CA')}
			min={min.toLocaleDateString('en-CA')}
			max={max?.toLocaleDateString('en-CA')}
			{required}
			tabindex="-1"
			class="bg-transparent w-full p-2 focus:outline-none"
			{placeholder}
		/>
	</div>
</div>