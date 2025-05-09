import presetRemToPx from '@unocss/preset-rem-to-px';
import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetUno,
	presetWebFonts,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';
import presetAnimations from 'unocss-preset-animations';

export default defineConfig({
	theme: {
		colors: {
			/* Dark Theme / Default */
			blurple: '#5865f2',
			'main-darkest': '#1c1d23',
			'main-pre-darkest': '#191d2a',
			'main-darker': '#1e1f22',
			'main-dark': '#2b2d31',
			'main-dark-hover': '#36373c',
			main: '#313338',
			'main-light': '#35373c',
			'main-lighter': '#404249',
			'fake-white': '#f3fefc',

			'main-text-active': '#ffffff',
			'main-text': '#d8ddf9',
			'alt-text': '#bdc4de',

			primary: '#5c69eb',
			secondary: '#4f5058',
			danger: '#ba3438',
			success: '#508048',

			'primary-hover': '#4b55be',
			'secondary-hover': '#6e6f78',
			'danger-hover': '#892625',
			'success-hover': '#3d6336',
			'white-hover': '#84868b',

			'check-checked': '#23a55a',
			'check-unchecked': '#80848e',
		},
	},
	rules: [
		['box-shadow-main', { 'box-shadow': '0 0.1em 0.3em 0.1em rgba(23, 23, 23, 0.75)' }],
		['text-fill-color', { '-webkit-text-fill-color': 'transparent' }],
		['code-font', { 'font-family': '"IBM Plex Mono", monospace' }],
		[/^column-count-(.+)$/, ([, d]) => ({ 'column-count': d })],
		[/^column-width-(\d+)$/, ([, d]) => ({ 'column-width': `${Number(d) / 4}rem` })],
	],
	shortcuts: {
		tooltiptext:
			'w-fit bg-main-lighter color-main-text text-center p-1 rounded-md absolute group-hover:block hidden bottom-105% box-shadow-main border-main-darkest z-1 select-none hover:hidden',
		mention: 'bg-[rgba(88,101,242,0.3)] px-1 rounded-md',
		'btn-base':
			'min-w-15 duration-200 transition-all ease-in-out text-white rounded-md px-4 hover:text-white! disabled:cursor-not-allowed',
		'btn-primary': 'btn-base bg-primary',
		'btn-secondary': 'btn-base bg-secondary',
		'btn-danger': 'btn-base bg-danger',
		'btn-success': 'btn-base bg-success',
		'btn-link': 'btn-base bg-secondary  flex flex-row gap-2 justify-center items-center',

		'btn-extra-primary-outlined':
			'btn-base border-1 border-solid border-primary hover:bg-primary hover:text-white',
		'btn-extra-inverted-white': 'btn-base bg-white hover:bg-white-hover! text-primary',
		'btn-extra-danger-outlined':
			'btn-base border-1 border-solid border-danger hover:bg-danger hover:text-white',
		'btn-extra-success-outlined':
			'btn-base border-1 border-solid border-success  hover:bg-success hover:text-white',
		'btn-extra-secondary-outlined':
			'btn-base border-1 border-solid border-secondary hover:bg-secondary hover:text-white',
		'btn-extra-link-outlined':
			'btn-base border-1 border-solid border-secondary hover:bg-secondary hover:text-white flex flex-row gap-2 justify-center items-center',
	},
	transformers: [transformerDirectives(), transformerVariantGroup()],
	content: {
		pipeline: {
			include: [
				// the default
				/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
				// include js/ts files
				'src/**/*.{js,ts}',
			],
		},
	},
	presets: [
		presetAnimations(),
		presetRemToPx(),
		presetUno(),
		presetIcons({ scale: 1.2 }),
		presetTypography(),
		presetWebFonts({
			fonts: {
				poppins: {
					name: 'Poppins',
					weights: ['400', '500', '600', '700', '800'],
					provider: 'google',
				},
				serif: 'DM Serif Display',
				mono: 'DM Mono',
				clock: 'Bungee Outline',
				card: 'Mina',
			},
		}),
	],
});
