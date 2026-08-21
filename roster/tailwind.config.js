import frappeUIPreset from "frappe-ui/src/tailwind/preset";
// HYOSHII BRAND — shared token layer (Phase 2 of plans/rebrands.md), no longer a
// local duplicate — see frontend/src/theme/brand.tailwind.js for the canonical
// definition and its rationale (why a new `brand` family, not a `blue` repoint).
import brandTheme from "../frontend/src/theme/brand.tailwind.js";

export default {
	presets: [frappeUIPreset],
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
		"./node_modules/frappe-ui/src/components/**/*.{vue,js,ts,jsx,tsx}",
		"../node_modules/frappe-ui/src/components/**/*.{vue,js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			...brandTheme,
		},
	},
	plugins: [],
};
