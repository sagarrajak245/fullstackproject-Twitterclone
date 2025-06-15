import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: 'class',
	safelist: [
		"dark", "dark:bg-black", "dark:text-white",
		"bg-black", "text-white", "data-theme=black"
	],
	theme: {
		extend: {},
	},
	plugins: [daisyui],

	daisyui: {
		themes: [
			"light",
			{
				black: {
					...daisyUIThemes["black"],
					primary: "rgb(29, 155, 240)",
					secondary: "rgb(24, 24, 24)",
				},
			},
		],
	},
};
