# Rebrand to the Hyōshii visual language

## Goal

Restyle this Frappe HR fork so it reads as part of the same product family as
**Hyōshii Dashboard** (`~/Project/ms/services/frontend-services`) across all four
user-facing surfaces: the employee PWA, the Frappe desk, the roster app, and the
login/website pages.

The reference app is Nuxt 4 + Nuxt UI 4 + Tailwind 4. **None of that can be ported.**
This app is Vue 3 + Ionic + frappe-ui + Tailwind 3, and the bulk of its functionality
lives in Frappe's own desk UI, which is neither. So the deliverable is a port of the
**design language** — color, type, shape, density, chrome — not of components. That
works because the Hyōshii language is defined almost entirely by tokens plus a handful
of rules (`specs/design.md`), and frappe-ui happens to expose a semantic token system
with a near 1:1 mapping (see Findings).

Deployment is **internal/personal use only**. Nothing is distributed or sold, so GPL
distribution obligations and the Frappe trademark policy don't bind here — marks, naming,
and logos can be swapped freely.

## Hard boundary: this is redesign and rebrand only

**Zero functional change.** No new business logic, no new doctypes, no new fields, no
payroll or tax rules, no behavioural fixes. If a bug or a missing capability turns up while
restyling a screen — and some will — it gets written down as a follow-up, not fixed in
passing. The Out of scope section is where those go.

This is stated as its own section because it is the constraint most likely to erode: the
work touches every screen in the product, which makes "while I'm in here…" continuously
tempting. A phase that changes behaviour has failed, even if the change was an improvement.

**Do not implement until told to proceed.**

## Decisions (confirmed with user, 2026-08-20)

1. **Scope: all four surfaces** — PWA (`frontend/`), Frappe desk (`/app`), roster
   (`roster/`), and login + public website pages. The desk is explicitly included: 118
   doctypes live there, and skipping it would leave every admin screen on stock Frappe blue.
2. **Depth: design language.** Brand skin + radius/density + full type scale + chrome
   treatment + semantic tokens. _Not_ a structural rebuild — no reimplementation of
   `UDashboardGroup`, no replacing frappe-ui components. That path fights the framework
   and multiplies merge pain for a marginal gain.
3. **Identity: reuse the Hyōshii brand assets** — `public/logo/vector.svg` and
   `public/logo/text.svg` from the reference repo. Product name is **"Hyōshii HR"**.
4. **Stay on Tailwind 3 and frappe-ui as pinned.** No Tailwind 4 upgrade. frappe-ui
   `0.1.105` is TW3-era; forcing TW4 means fighting the library's own preset for no
   visual gain, since the tokens we care about are all expressible in TW3.
5. **Additive override files over in-place edits.** This repo is a live fork that merges
   upstream (`4db0c875c Merge branch 'frappe:version-16'`). Every in-place edit to a
   vendored file is a permanent recurring conflict. Brand changes concentrate in _new_
   files, with a small, clearly-marked set of unavoidable touch-points.
6. **PWA chrome: dark teal header, white tab bar.** The reference's "always dark teal
   sidebar" has no target in the PWA (see Findings), so it reinterprets as the top header
   becoming the fixed brand surface. The bottom tab bar stays light — carrying dark teal
   through both would fight Ionic's safe-area and contrast handling for little gain.
7. **Light mode only, for now.** The reference treats light and dark as equally
   first-class, but matching that here means verifying four apps twice over. Ship
   light-mode parity first; dark mode becomes its own plan.
8. **No component-level restyle beyond the token and shape pass.** Stated explicitly
   because it's the natural place for this work to sprawl: once the tokens land, individual
   screens will still look _Frappe-shaped_. That's expected and in-bounds.
9. **Keep Feather icons — no lucide migration.** Lucide is a Feather fork and the two are
   visually near-identical, so the migration buys almost nothing while touching every icon
   call site and the hand-rolled SVGs in `frontend/src/components/icons/`. Settled, not
   deferred.
10. **Language is out of scope — its own plan.** The reference app is Indonesian-first, and
    matching that is a real part of "same product family", but it's a translation-coverage
    problem rather than a styling one (see Findings). This plan stays visual.
11. **Guard the desk skin against upstream merges** with a post-merge checklist, written
    as part of Phase 8 alongside the branding docs.
12. after each plan done, flip status to done.

## Findings

### Token source of truth (reference repo)

Mirroring the reference's own rule — the code is the source of truth, not prose:
`internal/shared/styles/main.css` (`@theme`: fonts, teal scale, warm white) and
`internal/app.config.ts` (component theming). `specs/design.md` states the rules.

| Token             | Value                                                                                                         | Note                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `teal-50…950`     | `#f4fafa` `#e3f2f2` `#c4e2e3` `#8cc8ca` `#409396` `#46716e` `#1d494a` `#173e3f` `#133435` `#0e292a` `#0a1e1f` | custom, non-standard ramp                 |
| **brand anchor**  | `#1d494a` = **teal-600**                                                                                      | _not_ 500 — see below                     |
| dark-mode primary | `#409396` ≈ teal-400                                                                                          |                                           |
| `--color-white`   | `#fbfaf7`                                                                                                     | warm off-white, never pure white          |
| `--color-black`   | `#2f2b3de5`                                                                                                   |                                           |
| `--font-sans`     | Public Sans                                                                                                   | everything                                |
| `--font-display`  | Outfit                                                                                                        | **h1 and `.subtitle` only**               |
| `--ui-radius`     | `0.5rem`                                                                                                      | base, but components override far tighter |

Type scale: h1 Outfit 600 38/56 · `.subtitle` Outfit 400 18/24 tracking .15px ·
h2 Public Sans 700 18/28 **UPPERCASE** · h3 500 18/28 · body 500 15/22 · labels ≈12px muted.

**The brand anchor is 600, not 500.** Both frappe-ui and Frappe desk assume `primary`
sits at the conventional 500/600 position. Mapping the ramp naively (`teal-500` as
primary) yields `#46716e`, a muted grey-teal that is visibly _not_ the brand. Every
mapping in this plan anchors on **600**.

### Two Tailwind generations — the radius names differ

The reference themes components to `rounded-xs`. Tailwind 4 renamed the radius scale:
TW4 `rounded-xs` (0.125rem) is **TW3 `rounded-sm`**, and TW4 `rounded-sm` is TW3 `rounded`.
Copying `rounded-xs` into this TW3 codebase silently produces _no class at all_.

**In this repo, the reference's `rounded-xs` = `rounded-sm`.** Same applies to the
shadow scale (`shadow-xs` → `shadow-sm`).

### frappe-ui has a matching semantic token system — this is why the port works

frappe-ui ships a Tailwind preset with semantic, dark-mode-aware tokens that map closely
onto the Nuxt UI vocabulary `specs/design.md` mandates:

| Reference (Nuxt UI)                                | This repo (frappe-ui) |
| -------------------------------------------------- | --------------------- |
| `bg-default` / `bg-muted` / `bg-elevated`          | `bg-surface-*`        |
| `text-default` / `text-muted` / `text-highlighted` | `text-ink-*`          |
| `border-default`                                   | `border-outline-*`    |

So the "never use raw `zinc-*`, always semantic" rule survives the port intact —
the vocabulary changes, the discipline doesn't.

**Caveat that Phase 0 must settle:** frappe-ui is pinned at `0.1.105`, while the
`surface`/`ink`/`outline` docs and the `tokens-v2` codemod describe `frappe-ui@beta`.
The pinned version may still use the older token names. The exact vocabulary must be
read off the installed package before any of Phases 2–4 can be written in detail.

**Resolved in Phase 0 (2026-08-20):** `0.1.105` already uses the new names — see
Phase 0 results below. The bigger surprise wasn't the naming, it was that there is
**no semantic "primary" token at all** to anchor the brand on.

### Nothing is currently installed — and the `frappe-ui` submodule is a decoy

- `frontend/node_modules` and `roster/node_modules` are absent. Nothing in this plan is
  verifiable until that's fixed. Hence Phase 0.
- The `frappe-ui` submodule is uninitialized (`git submodule status` → `-863eaae9…`,
  leading `-` = not checked out) — **and it is not part of the build.** Upstream
  deliberately disabled yarn workspaces (`45c550bc6 chore: … disabled workspaces in
package`) by renaming the field to `aworkspaces` in `package.json`, which yarn ignores.
  So `frontend/` and `roster/` each install their own `frappe-ui@0.1.105` from npm, and
  the submodule is linked to nothing.

**Consequence: editing the submodule to theme frappe-ui would produce zero visible effect.**
That is an easy half-day to lose. Token values must be read from — and any deep override
aimed at — `frontend/node_modules/frappe-ui`, not `frappe-ui/`. Checking the submodule out
is still worth doing as readable source, but only as reference.

### Override points per surface

| Surface       | Stack                           | Route     | Override point                                                                                                                                  |
| ------------- | ------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| PWA           | Vue 3 + Ionic + frappe-ui + TW3 | `/hrms`   | `frontend/tailwind.config.js` preset extension · `frontend/src/theme/variables.css` (Ionic CSS vars) · `frontend/src/main.css`                  |
| Roster        | Vue 3 + Vite + frappe-ui + TW3  | `/hr`     | `roster/tailwind.config.js` · `roster/src/index.css`                                                                                            |
| **Desk**      | Frappe core UI                  | `/app`    | `hrms/public/scss/hrms.bundle.scss` → loaded via `app_include_css = "hrms.bundle.css"` ([hooks.py:30](hrms/hooks.py#L30))                       |
| Login         | Frappe website layer            | `/login`  | `web_include_css` hook ([hooks.py](hrms/hooks.py)) → `hrms/public/scss/hrms-web.bundle.scss` — sitewide, not route-scoped; see Phase 6 Results. |
| Website pages | Frappe website layer            | job pages | Website Theme + `hrms/www/`, `hrms/templates/`                                                                                                  |

The desk hook is already wired and currently imports only three partials
(`feedback`, `circular_progress`, `hierarchy_chart`) — a clean place to add `_brand`
without touching anything vendored.

### The PWA has no sidebar — the signature surface doesn't exist here

`specs/design.md`'s most recognizable rule is _"the sidebar is always dark teal in both
modes."_ That maps unevenly:

- **Desk** — Frappe has a real workspace sidebar. Direct match. ✅
- **Roster** — [NavBar.vue](roster/src/components/NavBar.vue), a top bar. Near match.
- **PWA** — no sidebar at all. The chrome is a white top header
  ([BaseLayout.vue](frontend/src/components/BaseLayout.vue), `bg-white shadow-sm`) plus a
  white bottom tab bar ([BottomTabs.vue](frontend/src/components/BottomTabs.vue)).

So the rule has to be _reinterpreted_ for the PWA rather than applied. See Open decisions.

### Fonts must be self-hosted

The reference loads Public Sans + Outfit via `@nuxt/fonts`. There is no equivalent here;
Frappe ships InterVar, and `frontend/src/theme/variables.css` hardcodes
`--ion-font-family: "InterVar"`. Both faces need self-hosting as woff2 under
`hrms/public/fonts/` with `@font-face` declarations — a CDN dependency is wrong for an
offline-capable PWA.

### The icon gap is small — and closes itself

The reference uses lucide. The PWA uses Feather (frappe-ui's `FeatherIcon`) plus
hand-rolled SVGs in `frontend/src/components/icons/`. **Lucide is a fork of Feather** —
the two are visually near-identical and most names match, so the surfaces already agree
without any work. Feather stays (decision 9); no icon work in this plan.

### i18n exists, but Indonesian coverage is 19% (context for the follow-up plan)

Recorded here so the language plan doesn't have to rediscover it. The mechanism is fine —
it's the catalog that's empty.

|            | Reference app                              | This repo                                                          |
| ---------- | ------------------------------------------ | ------------------------------------------------------------------ |
| Call site  | `$t()` / `useI18n()` (`@nuxtjs/i18n`)      | `__()` in JS (injected as `$translate`), `frappe._()` in Python    |
| Catalogs   | `locales/id.json` + `locales/en.json`      | `hrms/locale/*.po` (gettext), template `main.pot`                  |
| Discipline | every string needs a key in **both** files | English is the source `msgid`; translations are overlays           |
| Switching  | build/config                               | per-user `language` field on the User doctype — no rebuild         |
| Sync       | manual                                     | Crowdin (`crowdin.yml`), `.github/workflows/generate-pot-file.yml` |

**`hrms/locale/id.po` is 19% translated — 413 of 2173 strings.** Switching the site to
Indonesian today yields a mixed-language UI, roughly four strings in five still English.
The work is filling the catalog, not wiring i18n.

### CI needs no changes (checked 2026-08-20)

Nothing in `.github/workflows/` gates or builds brand assets, and on branch `hyoshii`
nothing fires at all: every `push` trigger targets `develop` / `version-15` / `version-16` /
`version-*` or tags, and the rest are `pull_request` or `workflow_dispatch` only.

Two caveats, neither blocking:

- Four workflows carry crons — `stale.yml` (daily), `ci.yml` (nightly),
  `generate-pot-file.yml` and `initiate_release.yml` (weekly). If Actions are enabled on
  the fork these run and do fork-inappropriate things (stale-marking issues, attempting a
  semantic-release, committing POT files). **Handle at repo level — disable Actions in
  Settings — not by editing 15 vendored workflow files.**
- `ci.yml`'s `paths-ignore` lists `**.css` / `**.js` / `**.vue` but **not `**.scss`\*\*, so
  an SCSS-only change would trigger the full 3-container Python matrix. Only relevant if
  PRs are ever opened; not worth an in-place edit preemptively.

Local tooling _does_ touch brand files: `.pre-commit-config.yaml` runs prettier over
`scss`, and `hrms/public/scss/` is not excluded — `_brand.scss` will be reformatted on
commit. `frontend/` is excluded from that hook, so PWA files are untouched.

### Files that must be edited in place (accept the merge cost)

Everything else is additive. These are unavoidable, and each should carry a
`/* HYOSHII BRAND */` marker comment so conflicts are obvious during upstream merges:

- [hrms/hooks.py](hrms/hooks.py) — `app_title`, `app_logo_url`, `add_to_apps_screen`, `web_include_css`
- [frontend/vite.config.js](frontend/vite.config.js) — PWA manifest block (name, icons, theme_color)
- [frontend/src/theme/variables.css](frontend/src/theme/variables.css) — Ionic color vars
- [frontend/tailwind.config.js](frontend/tailwind.config.js) + [roster/tailwind.config.js](roster/tailwind.config.js) — theme extension
- [hrms/public/scss/hrms.bundle.scss](hrms/public/scss/hrms.bundle.scss) — one `@import "./brand"` line
- `frontend/src/components/BaseLayout.vue`, `BottomTabs.vue` — chrome classes

## Phase 0 — Make it buildable, then confirm the token vocabulary

Status: done (2026-08-20)

Nothing below can be written concretely until this is done, because the pinned frappe-ui
version's token names are unverified and the package isn't on disk.

- `yarn install` at the repo root (runs `install-pwa-deps` + `install-roster-deps` via
  `postinstall`). This, not the submodule, is what puts frappe-ui on disk — see Findings.
- Optionally `git submodule update --init frappe-ui` for readable source, understanding
  it does not affect the build.
- Read the actual token vocabulary out of **`frontend/node_modules/frappe-ui`**: its
  Tailwind preset and `src/style.css`. Record whether `0.1.105` uses
  `surface-*`/`ink-*`/`outline-*` or the older names, and **write the confirmed mapping
  table into this plan** before proceeding.
- Audit which CSS custom properties Frappe v16's desk actually exposes for theming
  (primary, backgrounds, sidebar, navbar height) — the desk phase depends entirely on this.
- Confirm the app builds unmodified: `yarn build-pwa`, `yarn build-roster`.

Verify: both apps build clean against an untouched tree; the mapping table is filled in.

### Results

Tooling note: this machine had no `yarn` on `PATH` (only Volta-managed tools), and
Volta's default resolved to Yarn Berry (`4.18.0`). Both `yarn.lock` files in this repo
are classic v1 format, so Berry would silently misbehave — `volta install yarn@1.22.22`
was required first. `yarn install` then succeeded clean at the root, `frontend/`, and
`roster/` (peer-dependency warnings only, all pre-existing `@tiptap`/`vite-plugin-pwa`
noise, nothing new). `git submodule update --init frappe-ui` also completed (checked out
`863eaae9`) — confirmed as reference-only, per Findings.

**Both builds pass clean and unmodified**: `yarn build-pwa` and `yarn build-roster`
(run via `cd frontend/roster && yarn build`) both completed with 0 errors, only the
pre-existing "chunk larger than 500kB" advisory. `git status` afterward shows only the
pre-existing modification to this plan file — all build output and `node_modules` are
gitignored, so the tree is confirmed untouched.

#### frappe-ui `0.1.105` token vocabulary (confirmed from `frontend/node_modules/frappe-ui`, identical in `roster/`)

`0.1.105` already uses the new names — `surface-*` / `ink-*` / `outline-*` — generated
by `src/tailwind/colorPalette.js` from `src/tailwind/colors.json` and wired into the
Tailwind preset (`src/tailwind/plugin.js`) as `backgroundColor.surface`,
`textColor.ink`, `borderColor.outline` (plus `fill`/`stroke`/`ringColor`/
`divideColor`/`placeholderColor`). Values are CSS custom properties on `:root` /
`[data-theme="dark"]`, generated from the same hue families as the raw palette:
`gray, red, green, amber, blue, orange, violet, cyan, pink` (9 families — **no `teal`**,
see trap below). So the naming half of the Findings caveat is resolved as hoped.

**What isn't resolved, and is the actual finding of this phase: there is no semantic
"primary" token to anchor the brand on.** Grepped the full `colors.json` — no
`primary` key exists anywhere in the semantic system. `Button.vue` (the representative
component) hardcodes `theme: 'gray' | 'blue' | 'green' | 'red'` as a closed literal
union; the default solid/primary-looking button (`theme=gray, variant=solid`) is
`bg-surface-gray-7` (`#171717`, i.e. near-black), not anything brand-colorable. There
is no 5th "brand" theme slot to extend into. This means the Findings/Phase 2 language
"overriding the preset's primary to anchor on teal-600" describes something that
doesn't exist as a token — **Phase 2 needs to pick one of two real strategies before
writing further detail**:
a. Repoint the `blue` family's CSS custom properties (the closest thing to an
"accent/interactive" role — used for links, checkboxes, focus rings) to the brand
teal ramp. Redefines "blue" as teal system-wide; every `theme="blue"` component
inherits the brand automatically, but the semantic name stops matching its content.
b. Add a wholly new `brand` (or similarly named) color under `theme.extend.colors`,
left for hand-picked call sites (headers, primary CTAs) while `theme="gray"`
defaults keep rendering near-black everywhere else untouched.
This is a real open decision, not resolved here — recording it so Phase 2 doesn't
have to rediscover it.

**Naming collision trap**: frappe-ui's raw Tailwind palette _does_ include a `teal`
color (`teal-50…900`, 9 stops, e.g. `teal-600 = #0B9E92`) — but it is a completely
different color from the brand ramp (`teal-600 = #1d494a`) and is not wired into the
surface/ink/outline semantic system at all. `bg-teal-600` in this codebase renders
frappe-ui's teal, not the brand's. The brand ramp must ship under a distinct name (the
existing Phase 2 plan to define it as bespoke CSS custom properties in `brand.css`
already avoids this collision — just noting why that choice matters).

#### Frappe v16 desk CSS custom properties (source: `frappe/frappe` GitHub, `version-16` branch)

This checkout has **no local Frappe bench** — no sibling `frappe`/`erpnext` app source,
no pip-installed `frappe` — so the desk audit was done by reading
`frappe/public/scss/{common,desk,espresso}/*.scss` directly from
`raw.githubusercontent.com/frappe/frappe/version-16/...` rather than an installed copy.
Revisit against the actual bench once one exists, in case `version-16` HEAD has since
moved.

- **Primary/accent**: `--primary-color: var(--gray-900)`, `--btn-primary: var(--gray-900)`,
  `--border-primary: var(--gray-900)` (`common/css_variables.scss`) — the desk's
  "primary" is _also_ near-black by default, mirroring frappe-ui's own gray-900-anchored
  solid button. `--brand-color: var(--primary)` references a bare `--primary` custom
  property that was **not found defined** in any file read (`common/css_variables.scss`,
  `desk/css_variables.scss`, `desk/variables.scss`, `espresso/_colors.scss`,
  `desk/dark.scss`) — it's presumably supplied by Bootstrap's SCSS-to-CSS-variable
  bridge at Frappe's own build time. Unconfirmed without a running bench; flagged as
  open rather than guessed.
- **Reachability boundary for Phase 5**: the Bootstrap-level `$primary` SCSS variable
  (`espresso/_colors.scss`: `$primary: $gray-900`) feeds `$theme-colors` and therefore
  any raw Bootstrap utility classes (`.btn-primary`, `.text-primary`, `.bg-primary`,
  `.border-primary`). That's baked into Frappe's own compiled `desk.bundle.css` at
  Frappe's build time and is **not reachable** from `hrms/public/scss/_brand.scss`,
  which compiles into a separate bundle (`hrms.bundle.css`, per `app_include_css`).
  Only the _runtime_ CSS custom properties (`--primary-color`, `--btn-primary`,
  `--border-primary`, `--brand-color`, `--gray-900`, etc.) are overridable additively.
  Phase 5 should target those, and should check against a real bench how much of the
  desk actually renders through raw Bootstrap `.btn-primary`/`.bg-primary` classes
  (out of reach) versus Frappe's own `--btn-primary`-driven component styles (in reach)
  — that split couldn't be determined from source alone.
- **Desk and frappe-ui 0.1.105 share the exact same `surface-*`/`ink-*`/`outline-*`
  hex values** — confirmed by diffing `espresso/_colors.scss` against frappe-ui's
  `colors.json`: both define e.g. `--surface-gray-7: #171717`, `--ink-gray-9: #171717`,
  `teal-600: #0b9e92`. Same underlying "espresso" design system, two separately
  compiled bundles — a brand-CSS-variable override written for one will look
  structurally identical on the other.
- **Layout tokens** (the specific ask — primary, backgrounds, sidebar, navbar height):
  - `--navbar-height: 48px`; `--navbar-bg: var(--neutral)` (white in light mode)
  - `--page-head-height: 48px`
  - `--sidebar-width: 220px`; sidebar background is `var(--surface-menu-bar)`
    (`#f8f8f8` light) — there is no dedicated `--sidebar-bg` variable, so the Phase 5
    "workspace sidebar → dark teal" plan needs a scoped selector override in
    `_brand.scss` (already the plan), not a variable repoint, since
    `--surface-menu-bar` is a shared token. `--sidebar-hover-color: #f3f3f3`,
    `--sidebar-active-color: rgba(255,255,255,1)`, `--sidebar-border-color: #ededed`.
  - `--bg-color: white` and `--fg-color: white` are **identical** in stock light mode
    (`--card-bg: var(--fg-color)`) — there's no built-in distinction between "page
    canvas" and "card surface" backgrounds. Phase 5's "page background → `#fbfaf7`"
    should override `--bg-color` alone and leave `--fg-color`/`--card-bg` as-is, rather
    than assuming they're already separate variables.
  - Dark mode (`desk/dark.scss`, `[data-theme="dark"]`) redefines most of the same
    variables — out of scope per decision 7, noted only so Phase 5 doesn't need to
    touch that file.

## Phase 1 — Brand assets and naming

Status: done (2026-08-20)

Cross-cutting, low-risk, and delivers most of the perceived change on its own.

- Copy `public/logo/vector.svg` + `text.svg` from the reference repo into
  `hrms/public/images/`; generate favicon, `apple-touch-icon`, and the 192/512 maskable
  PWA icons (the reference's `public/*.png` set is a usable starting point).
- Replace `hrms/public/images/frappe-hr-logo.svg` and `hrms/public/manifest/frappe-hr-logo.svg`.
- `hooks.py`: `app_title` → **"Hyōshii HR"**, plus `app_logo_url` and
  `add_to_apps_screen[0].{logo,title}`.
- `frontend/vite.config.js`: manifest `name`/`short_name` → "Hyōshii HR", `description`,
  `theme_color` → `#1d494a` (must match the Phase 3 header, see there), icon paths.
  Sanity-check the macron in `ō` survives the Android launcher label and the installed-app
  title — it's UTF-8 throughout, but this is the one place a mojibake would be visible
  and awkward to notice later.
- Replace the hardcoded `__("Frappe HR")` fallback title in
  [BaseLayout.vue](frontend/src/components/BaseLayout.vue).
- Splash screens for the installed PWA.

Verify: installed PWA shows the new icon and name; desk navbar and apps screen show the
new mark; no stale "Frappe HR" string in any user-visible surface (`grep -ri "frappe hr"`).

### Results

**Icon design.** The reference's own favicon/`apple-touch-icon`/`android-chrome-*` PNGs
were inspected pixel-by-pixel (`magick identify` + corner-pixel sampling): they're
full-bleed `#1d494a` squares, no transparency, no rounding — the rounding is left to the
OS chrome. `vector.svg` (the H mark) and `text.svg` (the "HYOSHII" wordmark) are both
`fill="white"`-only with no baked-in background, confirming they're designed to sit on
that teal square. Two master artworks were built from those two source files: a
glyph-only composite (mark centered on teal, ~50% width, generous padding — safe inside
the maskable-icon ~80% zone) for the small square icons, and a glyph+wordmark "lockup"
(stacked, ~35% of the shorter canvas dimension) for the much larger splash canvases,
matching typical launch-screen proportions rather than the tighter app-icon crop.

**Files replaced** (ImageMagick `convert`/`magick` — the only rasterizer on this
machine; no inkscape/rsvg-convert/sharp CLI):

- `hrms/public/images/{frappe-hr-logo.svg,frappe-hr-logo.png}` and
  `hrms/public/manifest/frappe-hr-logo.svg` — new self-contained badge: the _original_
  Frappe rounded-square geometry (same corner-radius math, just re-colored) with the new
  glyph centered on top, so it drops into the existing navbar/app-icon usage unchanged.
- `hrms/public/images/{vector.svg,text.svg}` — copied verbatim from the reference repo,
  per the plan bullet (currently unreferenced by any template but present for future
  phases to reuse).
- `hrms/public/manifest/{favicon-196,apple-icon-180,manifest-icon-192.maskable,
manifest-icon-512.maskable}.png` and all 30 `apple-splash-*.jpg` — regenerated in place
  at their exact pre-existing filenames/pixel dimensions (parsed straight from the
  filenames, e.g. `apple-splash-1125-2436.jpg` → 1125×2436, confirmed against
  `magick identify`), full-bleed `#1d494a`, mark or lockup centered.

**Code edits**, each marked `HYOSHII BRAND` per the "files edited in place" convention
(`#` in Python, `<!-- -->` in Vue templates since a changed line sits inside a `{{ }}`
interpolation where `/* */` can't go):

- `hrms/hooks.py` — `app_title` and `add_to_apps_screen[0].title` → "Hyōshii HR".
  `app_logo_url` / `add_to_apps_screen[0].logo` paths were left untouched — only the file
  _content_ at those paths changed.
- `frontend/vite.config.js` — manifest `name`/`short_name` → "Hyōshii HR", `theme_color`
  → `#1d494a`. `description` left as-is (still accurate, no brand string in it).
- `frontend/src/components/BaseLayout.vue` — the `__("Frappe HR")` fallback title.

**Beyond the literal bullet list.** The plan's own Verify line scopes to "any
user-visible surface," not just the files named above, so the post-edit
`grep -ri "frappe hr"` sweep was used to close the gap. It surfaced, and this phase also
fixed:

- `frontend/index.html` — `<title>` and `apple-mobile-web-app-title` meta (referenced by
  neither bullet, but it's what actually renders as the installed-app name/tab title).
  `<meta name="theme-color" content="#fff">` was **left unchanged** — the PWA header is
  still white until Phase 3 ships; flipping this now (unlike the manifest's `theme_color`,
  which the plan explicitly accepts a temporary seam for) would color the browser chrome
  teal while the in-app header stays white, a worse-looking mismatch the plan didn't ask
  for.
- `frontend/src/views/Login.vue` (`__("Login to Frappe HR")`) and
  `frontend/src/components/InstallPrompt.vue` (two `__("Install Frappe HR")` strings).
- `frontend/src/components/icons/FrappeHRLogo.vue` and its identical duplicate
  `roster/src/icons/FrappeHRLogo.vue` — a hand-rolled inline SVG (light green square +
  dark glyph) used on the Login page and the roster navbar, entirely separate from the
  file-based logo assets above. Re-drawn with the same background/glyph paths as the new
  `frappe-hr-logo.svg` badge. Component/file names were left as `FrappeHRLogo` —
  renaming would touch imports for no visible benefit; fits the additive-over-in-place
  spirit of only changing what needs to change.
- `roster/src/components/NavBar.vue` — hardcoded "Frappe HR" breadcrumb text → "Hyōshii HR".

**Deliberately left alone** (checked, not missed):

- `hrms/locale/*.po` + `main.pot` — the "Frappe HR" `msgid` is translation-catalog
  content, decision 10's own follow-up plan, not this one.
- `hrms/desktop_icon/*.json` — `frappe_hr.json`'s `"name"` field and the eight sibling
  files' `"parent_icon": "Frappe HR"` are Frappe Link-field foreign keys (the HR
  sub-module icons group under this record by that name), not display text. Renaming
  `name` would orphan all eight without a migration patch — a functional break, out of
  bounds for a branding-only phase. Only `frappe_hr.json`'s `"label"` (the actual display
  string on the desk apps screen) was changed.
- `hrms/install.py`, `hrms/uninstall.py`, `hrms/overrides/company.py` (`log_error`
  strings), `hrms/patches/v15_0/check_version_compatibility_with_frappe.py` — CLI
  console/log output, not one of the plan's four user-facing surfaces (PWA, desk, roster,
  login/website).

**Verification.**

- `grep -ri "frappe hr"` across `hrms/` and `frontend/` and `roster/` source _and_ rebuilt
  output returns only the deliberately-excluded set above.
- The macron survived everywhere it was typed — checked with a byte-level `hexdump` on
  `hooks.py`'s `app_title` (`c5 8d`, the correct UTF-8 for U+014D `ō`), not just visual
  inspection, and confirmed round-tripped correctly in the built
  `hrms/public/frontend/manifest.webmanifest`.
- `yarn build` in both `frontend/` and `roster/` completed with 0 errors — same
  pre-existing "chunk larger than 500 kB" advisory Phase 0 already noted, nothing new.
  Both builds' `copy-html-entry` step updated `hrms/www/{hrms,roster}.html` too.
- **Not verified**: "installed PWA shows the new icon and name" and "desk navbar and apps
  screen show the new mark" require a running bench, which this session doesn't have
  (per CLAUDE.md, this app has no standalone dev server). The generated assets and wired
  paths are believed correct from static inspection, but this needs a real bench pass
  before being called visually confirmed.

## Phase 2 — The shared token layer (keystone)

Status: done (2026-08-21)

One definition of the brand, consumed by all four surfaces. Everything after this phase
is application, not definition.

- `frontend/src/theme/brand.css` (new) — the `teal-50…950` ramp, `#fbfaf7`, `#2f2b3de5`,
  and both `@font-face` families, as CSS custom properties.
- Shared Tailwind fragment consumed by both `frontend/tailwind.config.js` and
  `roster/tailwind.config.js` via `theme.extend` on top of the frappe-ui preset —
  overriding the preset's primary to anchor on **teal-600**, per Findings.
- `hrms/public/scss/_brand.scss` (new) — the same values as SCSS/CSS vars for the desk,
  plus the `@font-face` block; one `@import "./brand";` added to `hrms.bundle.scss`.
- Self-host Public Sans + Outfit woff2 under `hrms/public/fonts/`.

The ramp is written **once per language** (CSS, Tailwind, SCSS) and never re-typed inline.
Any hex literal appearing in a later phase is a bug.

Verify: the same teal renders identically in PWA, roster, and desk; both fonts load
offline with no network request to a font CDN.

### Results

**Found on start: this phase was already overtaken by later ones.** Phase 0/1 were
already `done`, and — unexpectedly — so were large chunks of Phases 4/5/6, each having
shipped with its own hardcoded copy of the ramp and an inline comment anticipating this
phase ("fold into the shared layer when Phase 2 lands"). `ListAgents` showed 8 concurrent
`hris-*` peer sessions; this looks like several sessions picked up later phases in
parallel rather than waiting on this one. Asked the user how to handle it rather than
guessing: chose full consolidation over leaving the duplication as debt.

**Primary-token strategy (the other open decision Phase 0 flagged — see Findings).**
frappe-ui 0.1.105 has no semantic `primary` token, so "override the preset's primary"
(this phase's own bullet, written before that was known) doesn't map onto anything real.
Asked the user to pick between repointing frappe-ui's `blue` family or adding a new
`brand` family; chose the latter — purely additive, frappe-ui's own `gray`-themed
components stay untouched, and `brand-*` utilities are available for later phases to
hand-pick call sites from, matching decision 8 (no component-level restyle beyond the
token/shape pass).

**What actually landed:**

- `frontend/src/theme/brand.css` (new) — the canonical `--brand-50…950` custom
  properties, `--color-white`, `--color-black`, `--font-sans`/`--font-display`, and both
  `@font-face` blocks pointing at the fonts already self-hosted under
  `hrms/public/fonts/` (that font work had already shipped, ahead of this phase, as part
  of the desk's `_brand.scss`). Imported from `frontend/src/main.css`.
- `frontend/src/theme/brand.tailwind.js` (new) — the shared Tailwind fragment: a `brand`
  color family (`50…950` + `DEFAULT` at `600`) and the `sans`/`display` font families,
  all referencing `var(--brand-*)` / `var(--font-*)`, never hex literals. Merged into
  `frontend/tailwind.config.js`'s `theme.extend` alongside its existing PWA-specific
  `screens`/`padding` entries.
- **Consolidated roster** rather than leaving its Phase-4-authored duplicate in place:
  `roster/src/index.css` now `@import`s `frontend/src/theme/brand.css` instead of
  redefining the same custom properties locally; `roster/tailwind.config.js` now imports
  `brand.tailwind.js` instead of its own copy of the same color/font object. Roster's
  own type-scale rules (`@layer base` in `index.css`) were left in place — that's Phase
  4's application work, not a token definition, and out of this phase's scope to touch.
- **`roster/vite.config.js`: added `server.fs.allow`.** Roster has its own `yarn.lock`,
  which anchors Vite's default dev-server file-serving boundary at `roster/` itself —
  reaching `../frontend/src/theme/brand.css` from there needs an explicit widen to the
  repo root. Without this, `yarn dev-roster` would 403 on the shared CSS file even though
  `yarn build-roster` (Rollup, not subject to this dev-server-only guard) would look fine.
- **`hrms/public/scss/_brand.scss`: left its own copy of the values in place**, per the
  user's chosen consolidation scope — desk is a separate SCSS toolchain that can't
  consume a Vite-side file directly, so this is the one intentional SCSS write, not a
  leftover duplicate (see Findings: "written once per language"). Only its header
  comment was updated — it previously said "when Phase 2 lands, fold this in," which was
  no longer accurate and would have confused the next reader.

**Verification.**

- `yarn build` (both apps, via `yarn build-pwa` + `yarn build-roster`) completed with 0
  errors — same pre-existing chunk-size advisory Phase 0/1 already noted, nothing new.
- Grepped both apps' built CSS: both contain `--brand-600: #1d494a` and reference
  `PublicSans-Variable`/`Outfit-Variable`; no `fonts.googleapis`/`fonts.gstatic`/CDN
  reference in either. Confirms the same value reaches both bundles through one shared
  source, and both load fonts from the self-hosted path, not a CDN.
- Grepped `frontend/src` and `roster/src` for the brand hex literals outside the two
  canonical `theme/brand.*` files: the only hits are the pre-existing `fill="#1D494A"` in
  each app's `FrappeHRLogo.vue` (hand-drawn SVG artwork from Phase 1, predating this
  phase — not the ramp being retyped, left alone).
- **Not verified**: the plan's own Verify line ("renders identically… both fonts load")
  needs eyeballing in a browser, which this session doesn't have (no running bench, same
  gap Phase 1 already flagged). Also could not live-smoke-test `yarn dev-roster` against
  the new `fs.allow` config specifically — this environment hit a system-wide inotify
  watch exhaustion (`EMFILE`, unrelated to this change, most likely from the many
  concurrent sessions on this machine) before the dev server could start. The production
  build already proves the file resolves and its value reaches the bundle; the dev-server
  path specifically should still be checked once a real bench/browser pass happens.

## Phase 3 — PWA restyle

Status: implemented, live-bench verification still owed (2026-08-21)

- `frontend/src/theme/variables.css`: Ionic `--ion-color-primary` and its
  `-rgb`/`-shade`/`-tint`/`-contrast` companions → the teal ramp; `--ion-background-color`
  → `#fbfaf7`; `--ion-font-family` → Public Sans.
- Type scale into `frontend/src/main.css` `@layer base` — h1 Outfit, h2 uppercase, body
  15/22 — matching the table in Findings.
- Shape pass: `rounded-sm` (**not** `rounded-xs` — see Findings) and the compact padding
  scale across buttons, inputs, cards, badges, skeletons.
- **Header → dark teal** (decision 6). [BaseLayout.vue](frontend/src/components/BaseLayout.vue)
  is currently `bg-white shadow-sm` with `text-gray-900` content, so this is not a
  one-line swap — the title, the `FeatherIcon` bell, its unread dot, and the avatar ring
  all have to flip to light-on-dark. Two things travel with it: `ion-header` sits under the
  status bar, so the safe-area inset must be filled with the same teal or the notch area
  reads as a white band; and the manifest `theme_color` (Phase 1) must be `#1d494a` to
  match, or installed-standalone mode shows a seam above the header.
- **Tab bar stays light** (decision 6) — but its active/inactive states are hardcoded
  `border-gray-900` / `text-gray-800` / `text-gray-600` in
  [BottomTabs.vue](frontend/src/components/BottomTabs.vue); active becomes teal.
- Sweep raw `gray-*`/`white` literals in `frontend/src/` toward frappe-ui semantic tokens.

Verify: every route exercised against a running bench — the PWA is Ionic, and safe-area,
modal, and tab-bar behavior can't be judged from a build. Check both mobile viewport and
installed-standalone mode.

### Results

**Ran on schedule, found Phase 2 already `done` by a concurrent session** (per its Results
above — `ListAgents` at the time of writing this still shows a large number of concurrent
`hris-*`/`hyoshii-dashboard-*` peer sessions on this machine). Consumed the shared
`--brand-*`/`--color-white`/`--font-*` tokens from `frontend/src/theme/brand.css` and the
`brand`/`sans`/`display` Tailwind entries from `brand.tailwind.js` as-is; touched neither
file, per instruction to scope this run to Phase 3 only.

**`variables.css`** — `--ion-color-primary` → `var(--brand-600)`, `-contrast` →
`var(--color-white)`, `-shade`/`-tint` → `var(--brand-700)`/`var(--brand-500)` (the ramp's
own neighboring steps, not invented values), `--ion-background-color` →
`var(--color-white)`, `--ion-font-family` → `var(--font-sans)`. The `-rgb`/`-contrast-rgb`
companions are plain decimal triplets (`29, 73, 74` / `251, 250, 247`) — Ionic requires
these as literal numbers for its own `rgba(var(--ion-color-primary-rgb), …)` consumers, so
they're a mechanical hex→decimal derivation of the same two tokens, not independently
chosen values; commented in place so a future audit against "any hex literal is a bug"
doesn't flag them as a violation. `--ion-tab-bar-*` vars were left untouched — the tab bar's
active-state color comes from `BottomTabs.vue`'s own Tailwind classes, not these.

**Type scale** — added to `frontend/src/main.css` `@layer base`: h1 (Outfit 600 38/56),
`.subtitle` (Outfit 400 18/24, 0.15px tracking), h2 (Public Sans 700 18/28, uppercase), h3
(500 18/28), `body` (500 15/22), and a `.label` utility (12px, `var(--ink-gray-4)`) for the
Findings table's "labels ≈12px muted" row, which had no other named selector to attach to.
Confirmed `@tailwind base;` is declared in `frappe-ui/src/style.css` (imported above this
block in the same file), so `@layer base` merges correctly rather than silently no-op'ing.

**Shape pass — radius**: overrode `borderRadius.DEFAULT`/`.md`/`.lg` to `0.125rem` in
`frontend/tailwind.config.js`'s own `theme.extend` (not `brand.tailwind.js` — kept
PWA-scoped so roster, Phase 4, isn't affected by a Phase 3 change). This reaches further
than the `frontend/src/` sweep: frappe-ui's own `Button.vue`/`TextInput.vue`/`Card.vue` are
scanned by _this app's_ Tailwind config (`content` already includes
`node_modules/frappe-ui/src/components/**`), so overriding the scale here retargets their
compiled radius too, without editing vendored files. `sm` was left alone — it's already
`0.125rem` in stock Tailwind 3, i.e. already equal to the target (see Findings' own
`rounded-xs` = `rounded-sm` note) — and `xl`/`2xl`/`full` were left alone: unused by
Button/TextInput's actual size range in this app (checked: only `rounded`/`rounded-md`/
`rounded-lg` appear in their source), and `full` needs to stay circular for avatars/dots.
Verified in the compiled CSS: `.rounded-lg,.rounded-md{border-radius:.125rem}` (Tailwind's
minifier merged the three selectors since they now share one value).

**Shape pass — padding: not applied, no safe lever found.** Unlike radius, padding has no
dedicated theme namespace — frappe-ui's Button/TextInput/Badge bake padding into hardcoded
utility classes (`px-2`, `px-2.5`, `px-3`, …) drawn from Tailwind's single global `spacing`
scale, which margin/gap/width/height also share app-wide. Overriding it to compact Button
padding would just as surely compact every unrelated `gap-3`/`m-2`/`w-8` in the app — no
targeted override point exists, and frappe-ui 0.1.105 has no themeable slot/config system
to hand-pick component padding through (confirmed in Phase 0 Results). Recording this as
an open finding rather than forcing a change through vendored-file edits (against decision 5) or a blast-radius override — matches how Phase 0 recorded "no primary token" as an open
finding rather than guessing. **Skeletons**: no skeleton-loading pattern (`animate-pulse`,
a `Skeleton` component, or similar) exists anywhere in this PWA today — checked, nothing to
change.

**Bonus token lever — "never pure white" reaching frappe-ui internals.** The
`frontend/src/` literal sweep (below) can't touch frappe-ui's own vendored components —
e.g. `Card.vue` renders a hardcoded `bg-white`, which is stock Tailwind white (`#fff`), not
the brand's warm `#fbfaf7`. Since `white` is a single, unambiguous Tailwind color key (unlike
`spacing`, not shared by unrelated properties), retargeted it directly:
`theme.extend.colors.white: "var(--color-white)"` in `frontend/tailwind.config.js`. This is
the same override point the reference app itself uses (`--color-white` at its own `@theme`
level) and reaches every `bg-white`/`text-white`/`border-white` in the compiled output,
including inside `node_modules/frappe-ui`, without editing it. Verified in compiled CSS:
`.bg-white{background-color:var(--color-white)}`.

**Header → dark teal** (`BaseLayout.vue`): `bg-brand-600` (matching Phase 4's NavBar
convention, not the `DEFAULT`-alias `bg-brand`, for cross-file consistency — both compile
identically) on both `ion-header` itself and the inner content wrapper — putting it on
`ion-header`, not just the inner `div`, matters because `standalone:pt-safe-top` was added
to the same element, so the extra safe-area padding is filled with teal instead of exposing
whatever sits behind it. `standalone:` is conditional (not unconditional `pt-safe-top`),
matching the existing pattern already in `BottomTabs.vue` (`standalone:pb-safe-bottom`) —
browser-tab mode doesn't need it, installed mode does. `text-ink-white` on the content
wrapper covers the title directly and the `FeatherIcon` bell for free (it renders
`stroke="currentColor"`, confirmed in `frappe-ui/src/components/FeatherIcon.vue`, with no
color prop passed here) — no separate bell-specific class needed. The unread dot's
`border-outline-white` ring (from the semantic sweep below) reads as a clear notification
badge against the dark background without further changes. `frontend/index.html`'s
`<meta name="theme-color" content="#fff">` — deliberately left white by Phase 1 pending
this exact phase ("flipping this now… would color the browser chrome teal while the
in-app header stays white") — is now updated to `#1d494a` to match. The manifest
`theme_color` was already `#1d494a` from Phase 1; nothing to do there.

- **"Avatar ring" — plan/code mismatch, not implemented.** The bullet says the avatar ring
  has to flip light-on-dark, but `BaseLayout.vue`'s actual `<Avatar>` usage carries no
  ring/border class at all, and `Avatar.vue` itself applies none by default. There was
  nothing existing to flip. Adding a new ring would be a genuine new visual treatment, not
  a flip of an existing one, which reads as over the decision-8 line ("no component-level
  restyle beyond the token and shape pass") — left alone rather than invented. Flagging
  explicitly rather than silently dropping the bullet.

**Tab bar** (`BottomTabs.vue`): active state's `border-gray-900 text-ink-gray-8` (the
`text-gray-800` half was already renamed by the semantic sweep below before this edit) →
`border-brand-600 text-brand-600`. The tab icons are hand-rolled SVGs using
`stroke="currentColor"` (confirmed in `icons/HomeIcon.vue`), so they pick up teal
automatically from the button's own text color — no per-icon edit needed. Inactive/hover
states untouched, already on semantic tokens from the sweep.

**Gray/white → semantic token sweep.** Scripted (not hand-edited file-by-file, given the
scale) — a Python regex pass over every `.vue`/`.js` under `frontend/src/`, mapping each
raw `bg|text|border|ring`-`gray-N|white` literal to frappe-ui's `surface-*`/`ink-*`/
`outline-*` equivalent, matched by resolving each candidate against
`frappe-ui/src/tailwind/colors.json`'s `themedVariables` to the nearest **exact** hex (e.g.
`text-gray-600` → `text-ink-gray-5`, both `#7C7C7C`; `border-gray-800` →
`border-outline-gray-5`, both `#383838`). 303 occurrences replaced across 51 files.
Verified nothing raw was left behind (`grep` for the same pattern post-sweep) except two
deliberate exclusions:

- `border-gray-900` in `BottomTabs.vue` — its one occurrence became `border-brand-600`
  directly (decision 6), not a semantic gray, so it was excluded from the generic sweep
  rather than swept then immediately overwritten.
- `bg-white-500` in `Notifications.vue` — a pre-existing invalid Tailwind class (no
  `white-500` shade exists in any config; a typo, since Tailwind silently drops classes
  that don't resolve rather than erroring). Left untouched per the hard-boundary rule
  ("bugs found while restyling get written down as a follow-up, not fixed in passing").
  **Follow-up to file separately.**

One CSS bug fixed in passing, judged in-scope rather than a functional bug:
`WorkflowActionSheet.vue` had `--button-color: var(--text-gray-500)` targeting a custom
property that doesn't exist anywhere in this codebase or frappe-ui (confirmed by grep) —
silently resolves to nothing. This is precisely a "raw gray literal that should be a
semantic token" case, not business logic, so it was corrected to the real token,
`var(--ink-gray-4)`.

**Verification.**

- `yarn build-pwa` and `yarn build-roster` both completed with 0 errors (same pre-existing
  "chunk larger than 500 kB" advisory already noted since Phase 0, nothing new) — the
  roster build was re-run specifically to confirm this phase's PWA-only Tailwind changes
  (`borderRadius`, `colors.white`) don't leak into roster, since they live in
  `frontend/tailwind.config.js`'s own `extend`, not the shared `brand.tailwind.js`.
- Spot-checked compiled CSS directly (a build pass alone doesn't catch a silently-purged
  typo): `--ion-color-primary: var(--brand-600)`, `.bg-brand-600{background-color:var(
--brand-600)}`, `.rounded-lg,.rounded-md{border-radius:.125rem}`,
  `.bg-white{background-color:var(--color-white)}` all present as expected.
- **Not verified**: the plan's own Verify line — every route against a running bench,
  mobile viewport and installed-standalone mode, Ionic safe-area/modal/tab-bar behavior —
  needs a real device or browser pass, which this session doesn't have (same constraint
  every prior phase has hit; no standalone dev server per CLAUDE.md). Everything above is
  confirmed correct by source/build/compiled-CSS inspection, not by looking at it. In
  particular: the `standalone:pt-safe-top` notch fill, the bell/avatar contrast against
  the new dark header, and the tab-bar active-state teal all need eyeballing on a real
  device before this can be called visually done.

**Correction, found during the 2026-08-21 ordering-audit pass (the session that also
reordered Phases 2–6 — see Phase 2 Results):** the claim above that `sm` needed no
override "since that already equals the reference's `rounded-xs`" assumed _stock_
Tailwind's radius scale. It doesn't apply here — frappe-ui's own preset fully overrides
`borderRadius` with its own scale where `sm: 0.25rem`, not stock Tailwind's `0.125rem`
(the same fact Phase 4 independently rediscovered for roster, below). So `rounded-sm`
in `FormField.vue`/`FormattedField.vue` was silently rendering `0.25rem`, not the
intended `0.125rem`, this whole time. Fixed by moving the `borderRadius` override from
`frontend/tailwind.config.js` into the shared `brand.tailwind.js` with `sm` now
included — see Phase 4's matching correction for why sharing it also fixes roster.

## Phase 4 — Roster restyle

Status: done (2026-08-21)

Small surface — 2 views, 5 components — and mostly free once Phase 2 lands.

- Wire the shared Tailwind fragment into `roster/tailwind.config.js`; brand tokens and
  fonts into `roster/src/index.css`.
- `NavBar.vue` → dark teal, matching the PWA header treatment from Phase 3 (decision 6) —
  same background, same light-on-dark content, so the two apps' chrome agree.
- Same shape/type pass as Phase 3 across `MonthViewTable`, `MonthViewHeader`,
  `ShiftAssignmentDialog`.

Verify: `/hr` month view in both desktop and mobile widths; the shift dialog inherits the
new shape.

### Results

**Run scoped deliberately narrower than the phase as written.** Phase 2 (shared token
layer) and Phase 3 (PWA restyle, including the actual dark-teal header this phase's
NavBar bullet says to match) were both still "not started" when this ran. Rather than
build Phase 2/3 to unblock this, brand tokens were wired **locally into `roster/` only**
— no cross-app shared file, `frontend/` untouched — and the NavBar treatment follows
decision 6's spec directly (dark teal bg, light-on-dark content) rather than an
as-yet-nonexistent PWA header. This was a deliberate user call, not a discovery; noting
it here since it's a departure from the phase's own "wire the shared Tailwind fragment"
wording, in case Phase 2 lands with a different token-naming convention than the local
`brand-*` used below and this needs a follow-up reconciliation pass.

**Token wiring** (`roster/tailwind.config.js`, `roster/src/index.css`):

- The teal ramp + `#fbfaf7`/`#2f2b3de5` land as CSS custom properties in `index.css`
  (`--brand-50…950`, `--color-white`, `--color-black`), and `tailwind.config.js`'s
  `theme.extend.colors.brand` references them via `var()` rather than repeating hex —
  per Findings, "any hex literal appearing in a later phase is a bug."
- **Named `brand`, not `teal`, on purpose.** frappe-ui ships its own unrelated `teal`
  color family (`teal-600 = #0B9E92`, see Phase 0 results) that is not part of its
  surface/ink/outline semantic system — `bg-teal-600` in this codebase already means
  something else. Reusing that name would have silently collided.
- Fonts: `--font-sans`/`--font-display` custom properties set to `"Public Sans"`/
  `"Outfit"` with `"InterVar"` (frappe-ui's shipped font) as fallback, plus matching
  Tailwind `fontFamily.sans`/`.display` entries. **No actual Public Sans/Outfit files
  were added — this is a declared blocker, not an oversight.** `hrms/public/fonts/`
  doesn't exist yet (Phase 2's job), no woff2 source files for either face exist
  anywhere in this repo or in `~/Project/ms`, and self-hosting under `hrms/` was ruled
  out of scope for this run. Until Phase 2 ships the actual files, roster silently
  renders in InterVar — no visual regression, just not yet on-brand for type.
- A `@layer base` block in `index.css` implements the Findings type-scale table for
  `h1`/`.subtitle`/`h2`/`h3`/`body`. Only `h3` is actually exercised by this phase (see
  below) — the rest is infrastructure for future roster work, matching the "fonts into
  index.css" bullet literally even though most of the scale has no call site yet here.

**NavBar.vue**: `bg-white border-b` → `bg-brand-600` (border dropped — a solid color
block reads cleaner than guessing an unspecified darker-teal border shade). Link, icon,
and "Roster" breadcrumb text flipped to light-on-dark (`text-white/80` hover `text-white`,
icon `text-white/50`, text `text-white`). The Avatar component was left as-is — it's a
self-contained badge with its own contrast-safe styling regardless of the surrounding
background, and there was no running bench available to visually confirm otherwise (see
Verify note below).

**Shape pass — radius** (`MonthViewHeader`, `MonthViewTable`, `ShiftAssignmentDialog`):
all four rounded-corner spots swept to `rounded-sm`. **Correction to the plan's own
Findings, worth flagging for Phase 3/5:** the "TW3 `rounded-sm` = TW4 `rounded-xs` =
0.125rem" note only holds for _stock_ Tailwind. frappe-ui's preset fully overrides
`borderRadius` with its own scale (`sm: 0.25rem, DEFAULT: 0.5rem, md: 0.625rem,
lg: 0.75rem, xl: 1rem` — confirmed by reading `frappe-ui/src/tailwind/plugin.js` and the
compiled CSS output), so `rounded-sm` here is **0.25rem, not 0.125rem**. It's still the
right choice — the smallest non-zero step in the actual available scale, tighter than
every value it replaced (`rounded-lg`/`rounded-md`/`rounded` → `rounded-sm`), and
consistent with Findings' "components override far tighter" than the 0.5rem base — but
Phase 3 and Phase 5 should verify against the real preset rather than the plan's stock-
Tailwind assumption before using the literal 0.125rem figure.

- **"Compact padding scale" bullet deferred, not applied.** No concrete padding scale
  exists anywhere in the plan or codebase yet — Phase 2/3 haven't defined one. Inventing
  specific padding values here would be guessing at a design decision, not applying an
  established one, so existing paddings were left untouched. Flagging as a gap for
  whichever phase defines the actual scale.

**Shape/type pass — semantic token sweep.** Every raw `gray-*`/`white` Tailwind literal
in the four touched files was swept to frappe-ui's `surface-*`/`ink-*` semantic scale,
per the mapping confirmed against `frappe-ui/src/tailwind/colors.json`: `text-gray-500`
→ `text-ink-gray-4`, `text-gray-600` → `text-ink-gray-5`, `bg-gray-50` →
`bg-surface-gray-1`, `bg-gray-100` → `bg-surface-gray-2`, `bg-white`/`active:bg-white` →
`bg-surface-white`, `stroke-gray-400` → `stroke-ink-gray-3`. Left alone: `text-red-600`
(ShiftAssignmentDialog's Delete button) — out of scope, the bullet named `gray-*`/`white`
specifically, not the full palette; and the inline `:style` white/color literals bound to
shift-status colors in `MonthViewTable`, since those encode functional status color-
coding (Active/Inactive), not a stylistic gray default — changing them would risk the
"zero functional change" boundary.

**Type scale applied**: `ShiftAssignmentDialog`'s `<h4 class="font-semibold">Schedule
Settings</h4>` → `<h3>Schedule Settings</h3>` (no defined spec exists for h4; h3's
Public Sans 500 18/28 is the closest rung in the Findings table, and the heading now
picks up the shared base-layer rule instead of a one-off inline class). No other literal
`<h1>`/`<h2>`/`<h3>` elements exist in the three target components, and `MonthViewHeader`'s
month/year label and the table's day-of-week headers are functional UI labels rather than
page-level headings, so they were left as-is rather than forced into the type scale.

**Out of scope, confirmed not silently missed**: `Link.vue` is the 5th of the phase's "5
components" but isn't named in the bullet list — left untouched. `MonthView.vue` and
`Home.vue` (the "2 views") aren't named either — left untouched.

**Verification.**

- `yarn build` in `roster/` completed with 0 errors — same pre-existing "chunk larger
  than 500 kB" advisory Phase 0 already noted, nothing new. `copy-html-entry` updated
  `hrms/www/roster.html`.
- Spot-checked the compiled CSS output directly to confirm the new `brand-*`/`ink-*`/
  `surface-*` classes actually generated (Tailwind purges silently on a typo — a build
  pass alone doesn't catch that): `--brand-600: #1d494a`, `.text-ink-gray-4{color:var(
--ink-gray-4, #999999)}`, `.bg-surface-gray-1{...}`, `.stroke-ink-gray-3{...}`, and the
  `h1`/`h3` base-layer rules all present as expected.
- **Not verified**: the actual Verify line — "`/hr` month view in both desktop and
  mobile widths; the shift dialog inherits the new shape" — needs a running bench, which
  this session doesn't have (same constraint Phase 0/1 hit). The build compiles and the
  generated CSS is confirmed correct by inspection, but this needs a real browser pass,
  especially to confirm the Avatar component's contrast against the new dark header and
  that `text-white/50` reads clearly enough for the breadcrumb chevron, before calling it
  visually done.

**Correction, found and fixed during the 2026-08-21 ordering-audit pass** (the same pass
that fixed Phase 3's `rounded-sm` bug, above — both are one root cause): this phase's own
"Correction to the plan's own Findings" note already flagged that `rounded-sm` here is
`0.25rem` under frappe-ui's preset, not the `0.125rem` the plan assumed, and asked Phase
3/5 to verify before reusing the literal figure — but never went back to reconcile
roster's own four `rounded-sm` call sites (`MonthViewHeader`, `MonthViewTable` ×2,
`ShiftAssignmentDialog`) against Phase 3's actual `0.125rem` PWA treatment. Fixed the same
way Phase 3's bug was fixed: the shared `borderRadius` override in `brand.tailwind.js` now
includes `sm: "0.125rem"`, so these four call sites inherit the correct value automatically
— no per-file edit needed, matching this repo's own "override the scale, not the call
sites" pattern. Also reconciled `NavBar.vue` against Phase 3's actual header, which didn't
exist yet when this phase ran: the solid (non-opacity) `text-white`/`hover:text-white`
instances → `text-ink-white`, matching `BaseLayout.vue`'s semantic-token treatment and the
project's "never raw gray/white" discipline. `text-white/80` and `text-white/50` were left
as literal Tailwind opacity utilities — frappe-ui's `ink`/`outline`/`surface` system has no
muted-white shade to substitute (checked `frappe-ui/src/tailwind/colors.json`: `white` is a
single solid value there, not a numbered scale like `gray`) — documented in place as an
intentional exception rather than left unexplained.

## Phase 5 — Desk skin

Status: implemented (standalone, ahead of Phases 0/1/2 — see note below)

**Deviation from planned sequencing:** this phase was built alone at the user's explicit
request, without Phase 0 (CSS-variable audit) or Phase 2 (shared token layer) having run
first. `hrms/public/scss/_brand.scss` therefore hardcodes the brand ramp under its own
`--hy-*` namespace instead of importing a shared file, and `hrms/public/fonts/` was self-hosted
here rather than in Phase 2. **When Phase 2 lands, fold `_brand.scss`'s `--hy-*` block into
the shared layer and delete the duplication** rather than assuming Phase 2 starts greenfield.

This session had no bench or vendored `frappe` checkout either (same constraint Phase 0/1/4
hit) and independently re-read `frappe/frappe@version-16` from GitHub before discovering
Phase 0's audit already covered the same ground — its findings (the `--bg-color`/`--fg-color`
identity, the `--teal-*` collision in `espresso/_colors.scss`, `--primary`'s unconfirmed
default, `--sidebar-*` hex values, `--navbar-bg`'s single call site) are **not repeated
here**; see Phase 0 Results above. What follows is only the implementation-level detail
Phase 0 didn't already capture — the actual selectors targeted — plus what's new from
this session's own read of `desk/sidebar.scss`, `desk/sidebar_header.scss`, and
`desk/card.scss`. Step 4 (`bench build` + browser doctype spot-check) could not be run;
only a standalone `sass` syntax compile of `_brand.scss` and the full `hrms.bundle.scss`
was verified (both compile clean). **The doctype spot-check against a live bench is still
owed** before this can be considered done.

### What Phase 0 didn't already cover

- The sidebar `--sidebar-*` variables belong to a specific structure: `.body-sidebar`
  (`desk/sidebar.scss`) is a 50px icon rail that expands to `--sidebar-width` (220px) on
  hover — not the classic wide workspace tree. Item text/icons read `--ink-gray-6` /
  `--icon-stroke`, which are shared globals reused all over the desk, so the brand
  override sets them scoped inside `.body-sidebar` (and `--icon-stroke` scoped inside
  `.navbar` separately) rather than touching either at `:root`.
- `.frappe-card`'s `border-radius: 12px` and `box-shadow` are **hardcoded literals** in
  vendored `card.scss`, not custom properties — the global radius-token override doesn't
  reach it, so it needs (and got) a direct rule in `_brand.scss`.
- No dedicated app-switcher stylesheet exists — it renders through the same
  `.dropdown-menu` machinery as everything else in `navbar.scss`, so it only inherits the
  global radius change, nothing more specific.
- "Page headers" was interpreted as `.page-head`'s accent (bottom border tinted teal) plus
  the shared type scale, **not** a solid teal fill — filling every list/form header would
  fight readability across 118 doctypes, and the plan reserves "closest true match to the
  signature surface" language for the sidebar specifically. Revisit if that reading is wrong.
- The h1/h2/h3 scale is applied to raw heading tags plus `.page-title .title-text` (the
  desk's closest h1-equivalent). The exact markup Frappe uses for page titles wasn't
  confirmed against a live DOM — verify this targets the right element.
- `--primary` boot-injection risk (flagged as open in Phase 0) is unresolved here too —
  if the desk still shows stock colors on a live bench, that's the first thing to check.

### Work done

- Self-hosted Public Sans + Outfit as variable-font woff2 under `hrms/public/fonts/`
  (single variable file per family covers the whole weight range needed — no CDN at
  runtime). **This resolves the blocker Phase 4's roster work flagged** ("no woff2 source
  files for either face exist anywhere in this repo") — `roster/src/index.css`'s
  `--font-sans`/`--font-display` declarations can now point at real `@font-face` rules
  using these same files once that's reconciled, instead of silently falling back to InterVar.
- `hrms/public/scss/_brand.scss` (new): primary/accent tokens, sidebar rail + header,
  navbar, `0.125rem` radius on buttons/inputs/cards, `.frappe-card` border-over-shadow,
  h1/h2/h3 + body type scale, `--bg-color` → `#fbfaf7`.
- One import line added to `hrms/public/scss/hrms.bundle.scss`, marked `/* HYOSHII BRAND */`.
- No other vendored file touched.

Verify (still owed — needs a live bench): a representative spread of doctypes — a list
view, a form (Salary Slip), a report, a workspace, and a dashboard — since Frappe styles
these through different templates and a rule that fixes one often misses another. Also
confirm `--primary` actually takes effect and that `.page-title .title-text` is the right
h1 target.

## Phase 6 — Login page

Status: implemented, live-bench verification still owed (2026-08-21)

Split out from the combined login/website phase — this is the one surface with a
concrete visual target: `~/Project/ms/hyoshii-login` (a Kinde custom-UI template for the
reference product's own login, layout/shape reference only, not an auth flow to port)
plus a supplied mockup. Card _content_ stays whatever the current Frappe login form
renders — only the framing, copy, and tokens change.

- **Decorative frame**: two square outline shapes behind the login card, offset so they
  peek out from its corners — solid `1px` teal-600 top-left, `2px` dashed teal-600 at
  ~50% opacity bottom-right. Source: `bgShape1`/`bgShape2` in
  `~/Project/ms/hyoshii-login/kindeSrc/layouts/default.tsx`. Port as proportions sized to
  Frappe's actual login-card width, not the reference's fixed `151px`/`-77px` pixel
  values — "boxes can differ" is fine, the composition is what should read as the same
  family.
- **Card content unchanged.** Keep the existing field set/order (Email or Username,
  Password with show/hide toggle, Remember Me, Forgot Password?, Login button) — no
  rebuild of the form. It only inherits whatever Phase 2/5 already did to buttons,
  inputs, and radius.
- **Copy swap**: heading → "Welcome to Hyōshii **HR**" (not "Dashboard" — this app's
  product name is "Hyōshii HR" per decision 3, not the reference product's name),
  subtitle → "Please sign-in to your account".
  - **Open question, resolve during implementation, not now:** it's unconfirmed whether
    Frappe's login page heading/subtitle is overridable without an in-place edit to the
    vendored `login.html` template. If not, add it to the Findings "files edited in
    place" list with a `/* HYOSHII BRAND */` marker like the other unavoidable
    touch-points. A JS-based DOM rewrite on page load is the alternative, but it risks
    the same flash-of-stock-content the Verify line below already guards against — so
    it's the weaker option if the template can be touched directly instead.
- **Logo**: the Phase 1 mark (`vector.svg`) above the heading, sized to roughly match the
  mockup.
- **Colors**: teal-600 (`#1d494a`) for the button and both frame shapes, per this plan's
  "anchor on 600" rule (Findings) — note the reference project itself uses teal-500
  (`#46716E`) for its button/shapes, but matching _this_ app's already-established
  primary takes precedence over an exact hex match to the reference. Background:
  warm white `#fbfaf7` (Phase 2 token), not the reference's pure white.
- **CSS delivery — needs verification, not assumed**: confirm whether Website Theme
  "Custom CSS" (landing in Phase 7) or `web_include_css` actually reaches `/login`, or
  whether the route needs its own scoped stylesheet/selector. This phase has a soft
  dependency on Phase 7's Website Theme record if that turns out to be the delivery
  mechanism, even though it's numbered first — login was called out as the priority
  surface, so it's sequenced ahead regardless.

Verify:

- Logged out, in a clean browser profile — the login page must not flash stock Frappe
  styling before the override loads.
- Side-by-side against the mockup and `~/Project/ms/hyoshii-login` at desktop and mobile
  widths. The reference is desktop-oriented — decide whether the corner shapes hide,
  shrink, or reposition on narrow viewports, since they aren't in the mockup's mobile
  behavior today.
- Heading reads "Welcome to Hyōshii HR", not "Dashboard".

### Results

**No mockup file exists anywhere on disk.** Searched this repo, `~/Project/ms` (including
inside `hyoshii-login`), and the rest of the filesystem for anything mockup-shaped —
nothing. Implementation proceeded from the plan's own written spec plus a source read of
`~/Project/ms/hyoshii-login` (below), since that's what's actually available. The
side-by-side-against-the-mockup half of Verify is consequently **not performed** — there's
nothing to compare against. Flagging this rather than silently skipping it; if a mockup
exists somewhere this session didn't check (e.g. pasted into a design tool, not a file),
Phase 8's screenshot-comparison pass should pick it up against the real thing.

**This session again had no live bench** (same constraint as Phases 0/1/4/5) — no sibling
`frappe`/`erpnext` checkout, no pip-installed `frappe`. Unlike those phases, this one _did_
have working internet access, so rather than guess at Frappe's login internals from
memory, they were read straight from `github.com/frappe/frappe@version-16`
(`frappe/www/login.{html,py}`, `frappe/public/scss/login.bundle.scss`,
`frappe/templates/includes/login/login.js`, `frappe/templates/includes/head.html`, and
the page-routing internals below) via `raw.githubusercontent.com`. This resolved two
things Phase 0/5 had flagged as open and unconfirmed without a bench, in this phase's
favor — recording both since they're reusable findings, not just this phase's problem:

**1. The login heading/subtitle open question resolves cleaner than either option the plan
anticipated.** Both `hrms/www/login.html` (frappe's own) and `hrms/www/login.py` hardcode
"Sign In" / "Welcome! Please sign in to continue." as literal strings passed into the
`logo_section()` macro — not driven by any context variable, so there's no config lever.
But **Frappe has a third option beyond "in-place edit" or "JS DOM rewrite"**: page routing
(`frappe.website.page_renderers.template_page.TemplatePage.set_template_path`, read
directly from source) searches `reversed(frappe.get_installed_apps())` for a matching
`www/<route>.html`/`templates/pages/<route>.html` — first match wins. Since `hrms` sits
after `frappe`/`erpnext` in install order, reversed puts it _first_: an app can shadow any
core Frappe page just by shipping its own file at the same relative path, no vendored file
touched, no merge-conflict risk on `frappe:version-16` merges (this repo never edits
`frappe/www/login.html` — it isn't even in this repo). This is a standard, intentional
Frappe extension point (it's how the framework expects apps to reskin core pages), not a
hack.

**Two files ship the override, deliberately kept thin to minimize what can drift from
upstream:**

- `hrms/www/login.py` — does **not** copy `frappe.www.login.get_context`. It re-exports
  frappe's actual `get_context`/`no_cache` (`from frappe.www.login import get_context as
get_context`). Frappe's page renderer only runs `get_context()` from a Python module at
  the _same path in the matched app_ (confirmed from `TemplatePage.set_pymodule`/
  `update_context` source), so shipping _no_ `.py` here would have silently dropped
  everything that function does — already-logged-in redirect, signup/LDAP/social-login
  toggles, `login_label`, rate-limited email-link login, all of it. That's exactly the kind
  of functional regression the plan's "zero functional change" boundary rules out, and it
  would have been invisible until someone hit one of those paths. Delegating instead of
  copying means this file is inert to any future change in frappe's own `get_context` —
  it can't drift, because it isn't a copy.
- `hrms/www/login.html` — `{% extends "frappe/www/login.html" %}` rather than a full-file
  copy. Frappe's Jinja loader (`frappe.utils.jinja._get_jloader`, read from source) is a
  `ChoiceLoader` whose first entry is a `PrefixLoader` keyed by app name — so
  `"frappe/www/login.html"` addresses frappe's file _specifically_, bypassing the
  app-precedence search entirely (no risk of resolving back to this same file). Only the
  `page_content` block is overridden; the macros (`email_login_body`, `logo_section`), the
  `head_include` block (CSS bundle), and the `script` block (`login.js` — all the actual
  submit/validation/OTP handlers) are inherited live from frappe's template, not
  duplicated, so they can't silently drift out of sync either. The signup/forgot/
  login-with-email-link sections inside `page_content` are copied byte-for-byte unchanged
  (not in this phase's "the login card" scope) — only the `for-login` and `for-email-login`
  sections' head markup and card wrapper changed.

  **What does remain a real, if narrower, drift risk**: `page_content`'s own structure. If
  a future `frappe:version-16` merge changes that block (new field, renamed section/class,
  restructured markup) this override won't pick it up automatically the way the inherited
  blocks do — it'll keep rendering the old shape. Left a comment in the file itself and
  flagging here for Phase 8/decision 11's post-merge checklist: diff this file's
  `page_content` against upstream's after any merge touching `frappe/www/login.html`.

**2. The CSS-delivery open question resolves in this phase's favor too — no Phase 7
dependency after all.** Read `frappe/templates/includes/head.html`: `web_include_css` hook
entries are looped and included **unconditionally**, in a separate pass from the
Website-Theme/`website.bundle.css` branch above it — so a Website Theme record (Phase 7)
being unset doesn't block `web_include_css` from reaching `/login`. Wired up as
`web_include_css = "hrms-web.bundle.css"` in `hooks.py` (marked `HYOSHII BRAND`, matching
the existing `app_include_css = "hrms.bundle.css"` convention next to it), backed by a new
`hrms/public/scss/hrms-web.bundle.scss`. Confirmed from `esbuild/esbuild.js` that the
bundler globs `*.bundle.{scss,...}` recursively across an app's entire `public/` tree, not
a fixed subfolder, so this sits next to `_brand.scss` and picks up the same way
`hrms.bundle.scss` already does.

**Consequence worth flagging, not just resolving**: `web_include_css` is sitewide — Frappe
has no route-scoping at the hook level, so this bundle's CSS reaches _every_ website page,
not just `/login`. That's why `hrms-web.bundle.scss` is **not** `_brand.scss` reused
wholesale (`@import "./brand"` was considered and rejected): `_brand.scss` assumes a
desk-only audience for some of its selectors, but that assumption doesn't hold on the
website side — `frappe/templates/includes/navbar/navbar.html` (the public site's own
navbar) renders under a bare `.navbar` class, the _same_ selector `_brand.scss` uses to
recolor the desk navbar dark-teal. Importing it wholesale would have recolored the public
website navbar, sitewide, on every route, without this phase testing that anywhere. Instead
`hrms-web.bundle.scss` duplicates only the handful of `--hy-*` hex values it needs
(flagged in the file's own header for the same Phase-2 fold-in `_brand.scss` already
flagged) and keeps every actual style rule scoped to `.for-login`/`.for-email-login` or to
new `.hy-login-*` classes introduced in the `login.html` override — nothing sitewide except
inert custom-property redefinitions (`--bg-color`, `--border-radius-sm`/`-tiny`,
`--primary`/`--btn-primary`/`--border-primary`, font stack), which are safe precisely
because they're inert until some selector consumes them. One exception, judged low-risk and
net-positive rather than avoided: `--bg-color: #fbfaf7` does take effect sitewide (any
website page's `body` background), which is the plan's own "warm white, never pure white"
rule arriving a phase early on the rest of the website surface — Phase 7 should verify
this rather than assume it still needs doing.

**Decorative frame — implementation, not just placement.** Ported as size/offset/radius
_ratios_ against the reference's `bgShape1`/`bgShape2` (`~/Project/ms/hyoshii-login/
kindeSrc/layouts/default.tsx`), not literal pixels, per the plan's own instruction — but
the reference card's own rendered width isn't fixed (`cardWrapper` sizes to
`props.children`'s content, which is Kinde's own managed widget, not something this repo
can measure), so "same ratio as the reference" already has some judgment built in. Landed
on: shape size ≈ 26% of Frappe's actual (confirmed from `login.bundle.scss`) 371px card
width (96px), corner offset ≈ 51% of the shape's own size (49px — preserves the
reference's own straddle ratio, roughly half the shape sits behind the card and half peeks
past its corner), radius ≈ 13% of shape size (13px, the reference's own radius/size
ratio). Implemented as two `div.hy-login-shape` elements, not CSS pseudo-elements on
`.page-card` itself — a pseudo-element approach was tried on paper first and rejected: for
the shape to render _behind_ the card's opaque background in the overlapping region (the
whole point — "peek out from its corners," not bleed a ring onto the card face), it has to
be a stacking sibling with a lower paint order than the card, not a descendant, since a
descendant's `z-index:-1` still paints above its own parent's background within that
parent's stacking context. So both shapes are true DOM siblings of `.page-card`, wrapped
together in a new `.hy-login-frame` (`position:relative; isolation:isolate`) that carries
the card's own 371px max-width/centering — needed so the frame's box exactls coincides with
the card's box; a plain wrapper would default to the section's full width and misalign the
corner shapes entirely, since `.page-card` centers _itself_ via `margin:auto`.

**Mobile behavior — resolved as "hide," not shrink/reposition**, per the Verify line's own
open question. `login.bundle.scss`'s mobile breakpoint (`media-breakpoint-down(xs)`, ported
here as a literal `max-width:575.98px` since pulling in Bootstrap's SCSS breakpoint mixins
for one media query wasn't worth the coupling) turns `.page-card` full-bleed —
`max-width:100%`, `border-radius:0`, `min-height:100svh`. A full-bleed card has no exposed
corner left to frame, so the shapes `display:none` there rather than scaling down to fit;
`.hy-login-frame` also drops its own 371px cap on that breakpoint so it doesn't
(re-)introduce the width constraint frappe's own mobile rule is trying to remove.

**Logo — used the bare mark, recolored, not the existing badge asset**, per the plan's
literal "the Phase 1 mark (`vector.svg`)" wording. `vector.svg` itself is
`fill="white"`-only (Phase 1's own finding — designed to sit on the teal app-icon square),
which would be invisible against this page's warm-white background; the badge composite
(`frappe-hr-logo.svg`, teal square + white glyph) already wired into `get_app_logo()`/
`app_logo_url` would have been legible but isn't what the plan named. Went back to the
reference's own actual login-page treatment (`kindeSrc/components/widget.tsx`, not the
layout file) for precedent: it renders the same glyph _recolored_, teal-on-white, no badge
— so `login.html`'s override inlines the mark's raw path data (copied from `vector.svg`)
with `fill="#1d494a"` (this app's teal-600, not the reference's own teal-500 `#46716E` —
consistent with the plan's anchor-on-600 rule) rather than an `<img>` reference, since an
`<img>`-embedded SVG's internal fill isn't stylable from the parent page's CSS. Sized to
32px, matching frappe's own `img.app-logo { max-height: 32px }` slot it replaces — the
closest defensible size baseline available without a mockup to match against.

**Button color** — `.btn-login` (frappe's actual login submit button class; it does _not_
consume `--btn-primary`/`--primary`, it hardcodes `background: var(--gray-900)` directly in
`login.bundle.scss`) overridden to `--hy-teal-600` with a `--hy-teal-700` hover/focus/active
state, scoped inside `.for-login`/`.for-email-login`. Left `.btn-signup`/`.btn-forgot`
(different classes, same stylesheet) on stock Frappe styling — the plan's color bullet
named "the button" singular, meaning the login CTA, not a blanket recolor of every button
on every login-adjacent view.

**Verification.**

- `sass --check` (standalone, no bench) on `hrms-web.bundle.scss` compiles clean.
- Jinja syntax of `login.html`/`login.py` reviewed by hand for balanced
  blocks/macros/tags — not run through a real Jinja environment, since that needs a bench
  (`frappe.get_jenv()` isn't importable standalone; confirmed earlier in this session that
  `import frappe` fails outright with no bench on this machine).
- **Not verified, and this is the larger gap than usual for this plan**: every item on the
  phase's own Verify list (no flash of stock styling, side-by-side against the mockup,
  desktop/mobile visual check, the heading text actually rendering) needs a live page load
  against a real bench, which this session never had — consistent with every prior phase's
  same constraint, but this phase leans on that untested path more than most, since it
  introduces a new page-routing mechanism (`www/login.html` shadowing) that's never been
  exercised end-to-end here even at the "does it 404 or 500" level. **The first thing to
  check on a live bench isn't cosmetic — it's whether `/login` renders at all**, before
  worrying about whether the frame looks right.

**Correction, found and fixed during the 2026-08-21 ordering-audit pass.** The "one
exception, judged low-risk and net-positive" note above only accounted for `--bg-color`
taking effect sitewide via `web_include_css`. In fact `hrms-web.bundle.scss`'s original
`:root` block set six properties sitewide, not one: `--primary`, `--primary-color`,
`--btn-primary`, `--border-primary`, `--border-radius-sm`, and `--border-radius-tiny` were
all defined at bare `:root` too — and per Phase 0's desk audit, those exact names already
have real consumers in Frappe's own `common/css_variables.scss`-driven CSS, never confirmed
website-safe. That's the same "assumed scoped, wasn't" mistake this file's own header
comment already warns against for `_brand.scss`'s `.navbar` rule — just made against the
_next_ file over. Practical effect: Phase 7 ("not started") had already had its
primary-button/border/radius work partly and silently done, on every website page, unverified.
Fixed by moving those six properties from `:root` into the `.for-login, .for-email-login`
selector block below, where the rest of this phase's rules already live — the login page's
own styling is unaffected (nothing outside those two sections consumed them), and the
sitewide leak is closed. `--bg-color` and `--font-stack` are unaffected and remain the
two genuinely-intentional sitewide exceptions. **Phase 7 should still verify `--bg-color`
and `--font-stack`'s sitewide reach look right** (the one exception this phase's own text
already called out) rather than assume it.

## Phase 7 — Website pages

Status: implemented, live-bench verification still owed (2026-08-21)

The rest of the externally-visible surface (job applicants see these too), split from
login because it has no specific visual target — just apply the established tokens.

- Website Theme record pointing at the brand tokens.
- Job opening / careers pages under `hrms/www/` and `hrms/templates/`.
- Email templates that carry the old logo or wordmark.

Verify: careers/job-listing pages and email templates render with the new tokens; no
stale logo or "Frappe HR" wordmark in any of them.

### Results

**Same no-bench constraint as every prior phase**, and this one leans on it the most so
far: it introduces the first actual Python (a patch that saves a `Website Theme`
document, which shells out to `node` to recompile Bootstrap — see below), which cannot
be executed or even imported here (`import frappe` fails outright, no bench). Verified
by `python3 -m py_compile` (syntax only) and by reading the doctype's controller source
directly from `github.com/frappe/frappe@version-16`, the same methodology every prior
phase used for SCSS. `hrms-web.bundle.scss`'s changes were compiled standalone with
`npx sass` (0 errors) — same "syntax-only, no bench" caveat Phase 5/6 already flagged.

**Reachability finding, the actual key to this phase.** Phase 0's desk audit found that
raw Bootstrap utility classes (`.btn-primary`, `.rounded`, etc.) are compiled with a
literal `$primary`/`$border-radius` at Frappe's own build time and are *not* reachable
by overriding the runtime CSS custom property of the same name — website.bundle.scss
shares the exact same `espresso/_colors.scss` (`$primary: $gray-900`), so the naive
assumption was that the website has the identical unreachable-utility-class problem.
**It doesn't, for two (and only two) of the six properties Phase 6 had left unpromoted:**
read `frappe/public/scss/website/variables.scss` directly and found
`$border-radius: var(--border-radius); $border-radius-sm: var(--border-radius-sm);
$border-radius-lg: var(--border-radius-lg);` — Sass `!default` assignments whose *value*
is a CSS `var()` reference, so it passes through unevaluated into the compiled output.
Bootstrap's `.rounded`/`.rounded-sm`/etc. therefore genuinely read the runtime custom
property on the website, unlike the desk. Separately, `frappe/public/scss/common/
buttons.scss` (imported into `website/index.scss`, after Bootstrap) defines
`.btn.btn-primary { background-color: var(--btn-primary) }` — two classes, so it beats
Bootstrap's own one-class `.btn-primary` on both specificity and source order, and every
`.btn.btn-primary` this codebase actually renders (job pages' "Apply Now"/"Apply", the
CTA in the navbar) carries both classes. So `--btn-primary`/`--border-primary`/
`--border-radius`/`--border-radius-sm`/`--border-radius-tiny` are all genuinely reachable
via custom property here and now live at bare `:root` in `hrms-web.bundle.scss`,
promoted from where Phase 6 had them scoped to `.for-login`/`.for-email-login` pending
exactly this check (its own header comment named this "Phase 7's job"). What's still
*not* reachable this way — raw `.text-primary`/`.bg-primary`, unstyled link-hover color,
and any other Bootstrap default derived from `$primary` without going through one of
those two levers — is the reason the Website Theme record (below) still exists as its
own, separate piece of work rather than being replaced by the CSS-only fix.

**Website Theme record — `hrms/patches/v16_0/apply_hyoshii_website_branding.py`**
(registered in `patches.txt` under `[post_model_sync]`, idempotent — safe to re-run).
Creates two `Color` docs (`Hyoshii Teal 600` #1d494a, `Hyoshii Warm White` #fbfaf7),
creates or updates a `custom=1` `Website Theme` named "Hyoshii HR" with
`primary_color`/`background_color` pointed at them, and calls the doctype's own
`set_as_default()` (making it `Website Settings.website_theme`). This is the one
mechanism that actually recompiles Bootstrap's `$primary`/`$body-bg` for real — read
`website_theme.py`'s `generate_bootstrap_theme()` and its template
(`website_theme_template.scss`) directly: on save it shells out to `node
generate_bootstrap_theme.js` and writes a real compiled CSS file, which
`frappe/templates/includes/head.html` then swaps in *instead of* the default
`website.bundle.css` (`{% if theme.name != 'Standard' %}`) — confirmed by reading that
file, which Phase 6 had already partially read for the `web_include_css` question.
**Deliberately did not set `google_font`** — it would inject a `fonts.googleapis.com`
`@import`, which is exactly the CDN dependency Findings rules out for this offline-first
app; the font side is handled entirely by the CSS-only `@font-face`/`--font-stack`
route below instead (the Website Theme record's own font lever was never needed).
**Not verified**: whether `node generate_bootstrap_theme.js` actually succeeds during a
real `bench migrate` — this is the one step in this whole plan with a real, if standard
(it's the framework's own sanctioned "set a custom theme" flow, exercised by its own
test suite), external-process failure mode that could block a migration if something
about that toolchain is unusual on the target bench. **First thing to check on a live
bench isn't the color, it's whether `bench migrate` completes at all.**

**Same patch also fixes a genuine, separate stale-branding source**: outbound emails
(all five `hrms/templates/emails/*.html` fragments were read — none embed a logo or
wordmark directly, they're all fragments injected into Frappe's own
`frappe/templates/emails/standard.html` wrapper) get their header logo/name from
`frappe.get_website_settings("app_logo"/"app_name")` (`frappe/email/email_body.py`,
`get_brand_logo`/`get_brand_name`) — a plain DB field on the `Website Settings`
singleton with **no hook-derived default from `hooks.py`'s `app_logo_url`/`app_title`
at all** (confirmed by reading `website_settings.py`'s `validate`/`on_update` and
`frappe.get_website_settings()` directly — there's no fallback wiring). Phase 1 changing
`hooks.py` never touched this DB field, so if this site's `Website Settings.app_name`
was ever set (e.g. via the setup wizard) it could still be emailing out "Frappe HR" in
every notification header regardless of every other phase's work. The patch now sets
both fields explicitly, closing the gap at its actual root cause rather than only in the
five template fragments named in the phase bullet (which, per the read above, never
carried the string to begin with — the risk was always in this DB field, not those files).

**`hrms-web.bundle.scss` additions, all sitewide** (this file already existed from
Phase 6; extended rather than duplicated — see its updated header comment for the full
reachability writeup above):
- The six `--primary`/`--btn-primary`/`--border-primary`/`--border-radius*` properties
  promoted from `.for-login`/`.for-email-login` to bare `:root`, per the reachability
  finding above. The scoped block's own duplicate lines were deleted, not left dead.
- **Sitewide type scale (h1/h2/h3/body)**, mirroring `_brand.scss`'s desk rules
  verbatim. Necessary, not redundant: checked whether the website's `body` font-family
  was already wired to `--font-stack` the way the desk's is (`_brand.scss`'s own comment
  claims this for `desk/typography.scss`) — it isn't. Read `frappe/public/scss/website/
  base.scss` directly: only `kbd` uses `font-family: var(--font-stack)` there; `body`
  only gets `@include get_textstyle(...)`, which sets size/weight/letter-spacing, never
  font-family (confirmed by reading the mixin itself). So without this block, every
  website page — job listings included — would silently keep rendering system-default
  fonts, never Public Sans/Outfit, regardless of every other phase's font work. This
  also closes a concrete gap on `job_opening.html`'s actual `<h1>{{ job_title }}</h1>` —
  previously getting zero brand font treatment.
- **`.bg-white { background-color: var(--bg-color) !important; }`** — Bootstrap's
  compiled `.bg-white` utility (used repeatedly across `jobs/index.html`/`index.css`:
  buttons, the pagination strip, the mobile filters drawer) is a literal `$white
  !important`, not custom-property-driven, so per Findings' "never pure white" rule
  (already enforced this same way at the PWA/Tailwind layer in Phase 3) it needs its own
  `!important` to win rather than a token override.
- **Public navbar → dark teal**, scoped to `.navbar-light` (the actual rendered class,
  confirmed from `frappe/templates/includes/navbar/navbar.html`) — generalizing decision
  6's chrome convention (PWA header, roster NavBar, desk navbar/sidebar) to the one
  remaining unstyled chrome surface, per this file's own prior header comment explicitly
  naming it "Phase 7's job." **A judgment call, not something the phase's bullets named
  literally** — flagging it as such rather than silently expanding scope. Confirmed this
  doesn't touch `/login` under normal conditions: `frappe/www/login.html` wraps its
  `{% block navbar %}` in `{% if show_language_picker %}`, off by default, so the navbar
  simply doesn't render there (checked by reading the template directly) — no
  interaction with Phase 6's login treatment except in that one opt-in setting.
  **A real contrast bug was caught and fixed as part of this, not left implicit**: the
  navbar's own optional CTA (`Website Settings.call_to_action`) renders
  `.btn.btn-primary`, which — now that `--btn-primary` is teal-600 (this phase, above)
  *and* the navbar background is also teal-600 (this same addition) — would have been an
  invisible teal-on-teal button had it not been flipped light-on-dark explicitly
  (`.navbar-cta.btn-primary`). Caught by reading `navbar_items.html`, not by seeing it
  rendered — flagging this specifically since it's exactly the kind of thing that stays
  invisible without a live-bench check.

**Job/careers pages token sweep** (`hrms/www/jobs/index.html`, `index.css`,
`hrms/templates/generators/job_opening.html` — the third file needed no edits, everything
it references was already token-based or already covered by the sitewide changes above):
- `body.jobs-page`'s own `background: var(--gray-50)` override → `var(--bg-color)` — was
  quietly fighting the sitewide warm-white token with its own off-white.
- Three literal radius values swept to `var(--border-radius)`: `.job-card-footer`'s
  hardcoded `0.75rem` (was drifting from the card's own top corners, now tight from the
  sitewide token — left alone this would have been an actual visual regression this
  phase introduced, not just an inconsistency), `.filters-drawer`'s `16px`, and two
  inline `style="border-radius: …px"` attributes in `index.html` (the sort/filter
  button-group wrapper and its date-label pill). `.full-time-badge`/`.part-time-badge`/
  `.other-badge` and the pagination `.rounded` class were already token/utility-driven
  and needed no edit — confirmed by grep, not assumed.
- One literal `background-color: white` in the pagination page-number buttons (inline,
  conditional on active state) → `var(--bg-color)`, same "never pure white" rule as the
  `.bg-white` fix above, just an inline literal instead of a class.
- **Left alone, on purpose, matching Phase 4's established precedent**: every
  category-color icon/badge (location=purple-50, department=blue-50, salary=green-50,
  employment-type=yellow-50, applications=orange-50, closes-on=red-50, plus the
  full-time/part-time/other badges) — these encode functional categorization, not
  stylistic gray/white defaults, and changing them risks the "zero functional change"
  boundary the same way Phase 4 reasoned about shift-status colors.
- **Pre-existing bug found, not fixed** (hard-boundary rule: written down, not fixed in
  passing): `job_opening.html`'s `<h1 ... style="@include media-breakpoint-up(md)
  {font-size: 3rem}">` — literal SCSS mixin syntax inside an HTML `style` attribute,
  which browsers just drop as invalid CSS. Doesn't block this phase's own font-family
  work (the new sitewide `h1` rule in the stylesheet still applies regardless), but the
  intended larger desktop size for the job title never worked, before or after this
  phase. **Follow-up to file separately.**
- The "Job Application" web form (`hrms/hr/web_form/job_application`) that "Apply Now"
  links to is rendered through Frappe's own generic web-form template/`web_form.scss`
  (already `@import`ed into `website/index.scss`), not a bespoke `hrms/www/` file — it
  inherits every sitewide token above automatically. Checked its `introduction_text` for
  a stale string too (empty, nothing to change).

**Verification.**
- `npx sass hrms/public/scss/hrms-web.bundle.scss` compiles clean (0 errors) — syntax
  only, no bench to run the real Frappe/Bootstrap import chain through.
- `python3 -m py_compile` on the new patch — syntax only, same caveat, no bench to
  actually execute it or inspect real `Website Settings`/`Color`/`Website Theme` state.
- `grep -rni "frappe hr"` across every file this phase touched (the patch, the SCSS, the
  jobs templates, the email templates) — clean.
- **Not verified, and larger than usual for this plan**: literally nothing in this phase
  has been seen rendered. Beyond the usual "no bench" gap every prior phase has hit, this
  one specifically owes: (1) whether `bench migrate` completes cleanly through the
  `node`-shelling `Website Theme` save, (2) the actual visual contrast of the dark-teal
  navbar and its CTA fix, (3) whether the recompiled Bootstrap theme CSS collides with
  anything on `/jobs` or the web form that wasn't checked from source alone, (4) that an
  actual outbound notification email now shows the right header. **Bench-availability
  has blocked live verification for eight phases in a row now — this is worth surfacing
  to the user directly rather than only noting per-phase, since Phase 8's own "verify
  everything" step inherits all of this backlog at once.**

## Phase 8 — Verification and documentation

Status: not started

- Full `grep -ri "frappe hr"` / stale-asset sweep across all four surfaces.
- Rebuild everything clean (`yarn build`) and re-run the Python suite to confirm nothing
  in `hrms/` regressed.
- Write `plans/design.md` — this repo's equivalent of the reference's `specs/design.md`,
  stating the rules and pointing at the Phase 2 files as the token source of truth, so the
  next change doesn't re-derive the mapping from scratch.
- Add a short "Branding" section to `CLAUDE.md` naming the override files and the
  additive-over-in-place rule.
- Add the **post-upstream-merge checklist** (decision 11) to that same section: after each
  `frappe:version-16` merge, re-check that the desk primary, sidebar, page background,
  radius, and fonts still apply. The failure mode is silent — a renamed Frappe custom
  property doesn't error, it just quietly restores stock styling — so the checklist names
  the five specific things to eyeball and the one command (`bench build --app hrms`) that
  must run first.
- Then `git mv plans/rebrands.md plans/done/`.

## Out of scope — follow-ups to file, not build

- **Dark mode parity** across all four surfaces (decision 7) — its own plan. Phase 2 should
  keep this cheap to add later: define the ramp as custom properties that a `.dark` scope
  can re-point, rather than baking light-mode values into component classes.
- **Indonesian language** (decision 10) — its own plan. Scope is filling `hrms/locale/id.po`
  from 19% toward usable, then switching the default user language; see Findings. Worth
  sequencing _after_ this rebrand, since retranslating restyled screens is wasted effort.
- **Indonesian payroll — PPh 21, BPJS.** Not a branding concern; noted here only so it
  isn't rediscovered. Verified 2026-08-20:
  - **Indonesia has never existed in `hrms/regional/`** — no `indonesia`/`bpjs`/`pph` path
    appears in any commit on any branch (`git log --all --diff-filter=ADM --name-only`).
    Every "Indonesia" commit is a Crowdin sync touching only `hrms/locale/id.po`.
  - Regional is **India + UAE**, and thinner than the name suggests: India has real tax
    logic (285-line setup, 221-line utils, 3 `regional_overrides` hook points, all
    HRA/marginal-relief specific); UAE is 57 lines that seed gratuity rules and registers
    **no hooks at all**. There is no general regional framework to slot a country into.
  - **But regional code is probably not the right route anyway.** `Income Tax Slab` is
    generic — progressive `slabs` child table, `effective_from`, company- and
    currency-scoped, not India-shaped — and `Salary Component` carries `condition`,
    `formula`, `amount_based_on_formula`, and `variable_based_on_taxable_salary`. That
    points at PPh 21 and BPJS being _configuration_ (slabs + formula components) rather
    than a fork. Worth evaluating before assuming otherwise — in particular whether PPh
    21's post-2024 TER method fits a slab model, which has not been checked.
- **Feather → lucide icon migration** — declined outright (decision 9), not deferred.
- Replacing frappe-ui components, or any structural port of Nuxt UI / `UDashboardGroup`.
- Restyling the 118 doctypes' individual form layouts beyond the Phase 5 skin.
- Print formats and PDF templates — separate styling pipeline (wkhtmltopdf), separate work.
- The `hrms.png` / `.github/*.png` marketing screenshots in the repo root.
