import daisyui from 'daisyui';
import daisyUIThemes from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	safelist: [
		'dark',
		'dark:bg-black',
		'dark:text-white',
		'bg-black',
		'text-white',
		'btn',
		'bg-base-100',
		'text-primary',
		'theme-black',
		'theme-forest',
		'data-theme=black',
		'data-theme=forest',
	],
	theme: {
		extend: {},
	},
	plugins: [daisyui],
	daisyui: {
		styled: true,
		themes: [
			'light', // base theme
			'forest', // optional test theme (to confirm DaisyUI works in prod)
			{
				black: {
					...daisyUIThemes['black'],
					primary: 'rgb(29, 155, 240)',
					secondary: 'rgb(24, 24, 24)',
				},
			},
		],
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: '',
	},
};
