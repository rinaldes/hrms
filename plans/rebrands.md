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
    as part of Phase 7 alongside the branding docs.

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

| Surface         | Stack                           | Route               | Override point                                                                                                                 |
| --------------- | ------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| PWA             | Vue 3 + Ionic + frappe-ui + TW3 | `/hrms`             | `frontend/tailwind.config.js` preset extension · `frontend/src/theme/variables.css` (Ionic CSS vars) · `frontend/src/main.css` |
| Roster          | Vue 3 + Vite + frappe-ui + TW3  | `/hr`               | `roster/tailwind.config.js` · `roster/src/index.css`                                                                           |
| **Desk**        | Frappe core UI                  | `/app`              | `hrms/public/scss/hrms.bundle.scss` → loaded via `app_include_css = "hrms.bundle.css"` ([hooks.py:30](hrms/hooks.py#L30))      |
| Login / website | Frappe website layer            | `/login`, job pages | Website Theme + `hrms/www/`, `hrms/templates/`                                                                                 |

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

### Files that must be edited in place (accept the merge cost)

Everything else is additive. These are unavoidable, and each should carry a
`/* HYOSHII BRAND */` marker comment so conflicts are obvious during upstream merges:

- [hrms/hooks.py](hrms/hooks.py) — `app_title`, `app_logo_url`, `add_to_apps_screen`
- [frontend/vite.config.js](frontend/vite.config.js) — PWA manifest block (name, icons, theme_color)
- [frontend/src/theme/variables.css](frontend/src/theme/variables.css) — Ionic color vars
- [frontend/tailwind.config.js](frontend/tailwind.config.js) + [roster/tailwind.config.js](roster/tailwind.config.js) — theme extension
- [hrms/public/scss/hrms.bundle.scss](hrms/public/scss/hrms.bundle.scss) — one `@import "./brand"` line
- `frontend/src/components/BaseLayout.vue`, `BottomTabs.vue` — chrome classes

## Phase 0 — Make it buildable, then confirm the token vocabulary

Status: not started

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

## Phase 1 — Brand assets and naming

Status: not started

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

## Phase 2 — The shared token layer (keystone)

Status: not started

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

## Phase 3 — PWA restyle

Status: not started

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

## Phase 4 — Roster restyle

Status: not started

Small surface — 2 views, 5 components — and mostly free once Phase 2 lands.

- Wire the shared Tailwind fragment into `roster/tailwind.config.js`; brand tokens and
  fonts into `roster/src/index.css`.
- `NavBar.vue` → dark teal, matching the PWA header treatment from Phase 3 (decision 6) —
  same background, same light-on-dark content, so the two apps' chrome agree.
- Same shape/type pass as Phase 3 across `MonthViewTable`, `MonthViewHeader`,
  `ShiftAssignmentDialog`.

Verify: `/hr` month view in both desktop and mobile widths; the shift dialog inherits the
new shape.

## Phase 5 — Desk skin

Status: not started

Blocked on the Phase 0 CSS-variable audit. This is a **skin, not a redesign** — the goal
is that the desk reads as the same product, not that it becomes Nuxt UI. 118 doctypes
render through Frappe's own templates and will keep Frappe's layout DNA. Accept that.

All work lands in `hrms/public/scss/_brand.scss` — no vendored Frappe file is edited.

- Override Frappe's primary/accent custom properties to the teal ramp.
- Workspace sidebar → dark teal `#1d494a`, light teal item text, translucent-overlay
  active state — the closest true match to the reference's signature surface.
- Navbar, page headers, and the app switcher.
- Buttons, inputs, and cards → `0.125rem` radius, borders over shadows.
- Font family + the h1/h2/h3 scale.
- Page background → `#fbfaf7`.

Verify: a representative spread of doctypes — a list view, a form (Salary Slip), a report,
a workspace, and a dashboard — since Frappe styles these through different templates and
a rule that fixes one often misses another.

## Phase 6 — Login and website pages

Status: not started

The only externally-visible surface (job applicants see it), so it's worth getting right
even though it's small.

- Website Theme record pointing at the brand tokens.
- Login page: logo, background, button styling.
- Job opening / careers pages under `hrms/www/` and `hrms/templates/`.
- Email templates that carry the old logo or wordmark.

Verify: logged out, in a clean browser profile — the login page must not flash stock
Frappe styling before the override loads.

## Phase 7 — Verification and documentation

Status: not started

- Side-by-side screenshot comparison against the reference app: same-named surfaces
  (list, form, detail, nav) at desktop and mobile widths.
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
