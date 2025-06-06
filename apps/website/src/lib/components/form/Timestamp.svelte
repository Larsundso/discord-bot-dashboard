<script lang="ts">
	const {
		time,
		type: t = 'F',
		autoConvert = false,
	}: {
		time: number;
		type?: 'd' | 'D' | 't' | 'T' | 'f' | 'F' | 'R';
		autoConvert?: boolean;
	} = $props();
	const date = $derived(new Date(time));
	let type = $derived(t);

	let currentTime = $state(Date.now());
	let intervalId: NodeJS.Timeout | null = null;
	let updateFrequency = $state<'second' | 'minute' | 'hour' | 'day'>('second');

	$effect(() => {
		if (type !== 'R') return;

		currentTime = Date.now();
		updateFrequency = 'second';

		const setupInterval = () => {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}

			let interval = 1000; // 1 second default

			switch (updateFrequency) {
				case 'minute':
					interval = 60000;
					break; // 1 minute
				case 'hour':
					interval = 3600000;
					break; // 1 hour
				case 'day':
					interval = 86400000;
					break; // 1 day
				default:
					interval = 1000; // 1 second
			}

			intervalId = setInterval(() => {
				currentTime = Date.now();
				const timeDiff = Math.abs(currentTime - time);

				if (timeDiff > 3600000 && autoConvert) {
					clearInterval(intervalId!);
					intervalId = null;
					type = 'f';
					return;
				}

				if (timeDiff > 86400000 && updateFrequency !== 'day') {
					// > 1 day
					updateFrequency = 'day';
					setupInterval();
				} else if (timeDiff > 3600000 && updateFrequency !== 'hour' && updateFrequency !== 'day') {
					// > 1 hour
					updateFrequency = 'hour';
					setupInterval();
				} else if (timeDiff > 60000 && updateFrequency === 'second') {
					// > 1 minute
					updateFrequency = 'minute';
					setupInterval();
				}
			}, interval);
		};

		setupInterval();

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});

	const get = {
		d: () =>
			date.toLocaleDateString(undefined, {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			}),
		D: () =>
			`${date.getDate()} ${date.toLocaleDateString(undefined, { month: 'long' })} ${date.getFullYear()}`,
		t: () => date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
		T: () =>
			date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
		f: () =>
			`${date.getDate()} ${date.toLocaleDateString(undefined, { month: 'long' })} ${date.getFullYear()} ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`,
		F: () =>
			`${date.toLocaleDateString(undefined, { weekday: 'long' })}, ${date.getDate()} ${date.toLocaleDateString(undefined, { month: 'long' })} ${date.getFullYear()} ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`,
		R: () => {
			const now = new Date(currentTime); // Use reactive current time
			const diff = date.getTime() - now.getTime();
			const seconds = Math.abs(Math.floor(diff / 1000));
			const minutes = Math.abs(Math.floor(seconds / 60));
			const hours = Math.abs(Math.floor(minutes / 60));
			const days = Math.abs(Math.floor(hours / 24));
			const months = Math.abs(Math.floor(days / 30));
			const years = Math.abs(Math.floor(months / 12));

			if (diff > 0) {
				if (years) return `In ${years} year${years > 1 ? 's' : ''}`;
				if (months) return `In ${months} month${months > 1 ? 's' : ''}`;
				if (days) return `In ${days} day${days > 1 ? 's' : ''}`;
				if (hours) return `In ${hours} hour${hours > 1 ? 's' : ''}`;
				if (minutes) return `In ${minutes} minute${minutes > 1 ? 's' : ''}`;
				if (seconds) return `In ${seconds} second${seconds > 1 ? 's' : ''}`;
				return 'Just now';
			} else {
				if (years) return `${years} year${years > 1 ? 's' : ''} ago`;
				if (months) return `${months} month${months > 1 ? 's' : ''} ago`;
				if (days) return `${days} day${days > 1 ? 's' : ''} ago`;
				if (hours) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
				if (minutes) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
				if (seconds) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
				return 'Just now';
			}
		},
	};

	const displayText = $derived(get[type]());
</script>

<div class="bg-[rgba(78,80,88,0.48)] px-1 rounded-md w-fit text-shadow-none">
	<span> {displayText} </span>
</div>
