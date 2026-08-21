import frappeUIPreset from "frappe-ui/src/tailwind/preset"
// HYOSHII BRAND — shared token layer (Phase 2 of plans/rebrands.md).
import brandTheme from "./src/theme/brand.tailwind.js"

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
			// HYOSHII BRAND — "never pure white" (Findings). frappe-ui's own vendored
			// components (e.g. Card.vue's `bg-white`) are compiled against this app's
			// Tailwind theme (see `content` above) and can't be reached by the
			// frontend/src/ literal sweep, since they're raw Tailwind `white`, not the
			// surface/ink/outline semantic system. Retargeting the color key itself
			// reaches them without editing node_modules — same override point the
			// reference app uses (`--color-white` at its own `@theme` level).
			colors: {
				white: "var(--color-white)",
			},
			// HYOSHII BRAND — shape pass (Phase 3 of plans/rebrands.md). frappe-ui's
			// own components (Button, TextInput, Card) render `rounded`/`rounded-md`/
			// `rounded-lg` internally and are compiled against *this* app's Tailwind
			// theme (see `content` above), so overriding the scale here reaches them
			// without editing node_modules. The override itself now lives in
			// `brand.tailwind.js` (moved 2026-08-21, ordering-audit fix) so roster
			// inherits the same tight scale instead of drifting — see that file's
			// header comment for why `sm` had to be included this time, unlike the
			// original Phase 3 version, which wrongly assumed frappe-ui's preset kept
			// Tailwind's stock 0.125rem `sm` (it doesn't — frappe-ui's own preset
			// scale has `sm: 0.25rem`). `xl`/`2xl`/`full` stay untouched (unused by
			// these components, and `full` stays circular for avatars/dots).
			screens: {
				standalone: {
					raw: "(display-mode: standalone)",
				},
			},
			padding: {
				"safe-top": "env(safe-area-inset-top)",
				"safe-right": "env(safe-area-inset-right)",
				"safe-bottom": "env(safe-area-inset-bottom)",
				"safe-left": "env(safe-area-inset-left)",
			},
		},
	},
	plugins: [],
}
