/* HYOSHII BRAND — shared Tailwind fragment (Phase 2 of plans/rebrands.md).
 *
 * Consumed by both frontend/tailwind.config.js and roster/tailwind.config.js via
 * `theme.extend`, on top of the frappe-ui preset, so the mapping is written once.
 *
 * frappe-ui 0.1.105 has no semantic "primary" token to override (see Findings / Phase 0
 * results — its Button theme is a closed `gray | blue | green | red` union with no brand
 * slot). Rather than repointing the existing `blue` family, this adds a wholly new
 * `brand` color family: frappe-ui's own default (gray/near-black) components are left
 * alone, and `brand-*` / `bg-brand` / `text-brand` etc. are available for the call sites
 * later phases hand-pick (headers, primary CTAs, chrome) — matching decision 5 (additive
 * over in-place) and decision 8 (no component-level restyle beyond the token/shape pass).
 *
 * Values reference the CSS custom properties in ./brand.css, not hex literals — see
 * Findings: "Any hex literal appearing in a later phase is a bug."
 *
 * `borderRadius` moved here 2026-08-21, during the ordering-audit pass that found
 * Phase 3 and Phase 4 had each shipped a *different* tight radius: Phase 3 (PWA)
 * overrode DEFAULT/md/lg to 0.125rem but left `sm` alone on the wrong assumption that
 * frappe-ui's preset kept Tailwind's stock 0.125rem `sm` (it doesn't — frappe-ui's
 * preset defines its own scale, `sm: 0.25rem`), so `rounded-sm` call sites
 * (FormField.vue, FormattedField.vue) were silently rendering 0.25rem. Phase 4
 * (roster) used bare `rounded-sm` for its own shape pass expecting "the tightest step
 * in the scale" and got the same un-overridden 0.25rem. One shared override fixes both:
 * `sm` now included, and roster inherits it instead of needing its own copy.
 */
export default {
	colors: {
		brand: {
			50: "var(--brand-50)",
			100: "var(--brand-100)",
			200: "var(--brand-200)",
			300: "var(--brand-300)",
			400: "var(--brand-400)",
			500: "var(--brand-500)",
			600: "var(--brand-600)",
			700: "var(--brand-700)",
			800: "var(--brand-800)",
			900: "var(--brand-900)",
			950: "var(--brand-950)",
			DEFAULT: "var(--brand-600)",
		},
	},
	fontFamily: {
		sans: ["Public Sans", "InterVar", "sans-serif"],
		display: ["Outfit", "InterVar", "sans-serif"],
	},
	borderRadius: {
		sm: "0.125rem",
		DEFAULT: "0.125rem",
		md: "0.125rem",
		lg: "0.125rem",
	},
}
