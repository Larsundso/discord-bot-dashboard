<script lang="ts">
	import { StickerFormatType, type APIStickerItem } from 'discord-api-types/v10';

	const { sticker: s }: { sticker: APIStickerItem } = $props();
	const sticker = $derived(s);

	const getContentType = () => {
		switch (sticker.format_type) {
			case StickerFormatType.GIF:
				return 'gif';
			case StickerFormatType.Lottie:
				return 'json';
			case StickerFormatType.APNG:
			case StickerFormatType.PNG:
			default:
				return 'png';
		}
	};
</script>

<img
	src={`https://media.discordapp.net/stickers/${sticker.id}.${getContentType()}`}
	alt=""
	class=" min-w-10 max-w-25 h-auto max-h-25 object-cover"
/>
