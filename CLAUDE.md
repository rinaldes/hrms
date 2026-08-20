# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Frappe HR (hrms) — an open-source HR & Payroll app built on the [Frappe Framework](https://github.com/frappe/frappe), requiring [ERPNext](https://github.com/frappe/erpnext) as a dependency (`required_apps = ["frappe/erpnext"]` in `hrms/hooks.py`). This is a Frappe **bench app**, not a standalone service — it only runs inside a Frappe bench alongside the `frappe` and `erpnext` apps, and has no meaningful dev server of its own outside that context.

The repo has three parts:
- `hrms/` — the Python/Frappe backend (doctypes, server-side controllers, patches, hooks).
- `frontend/` — a Vue 3 + Ionic PWA (the mobile-friendly HR app), built with Vite and `frappe-ui`.
- `roster/` — a separate Vue 3 + Vite app for shift/roster management, also built with `frappe-ui`.

Both frontend apps build into `hrms/public/{frontend,roster}` and are served by the Frappe web server at `/hrms` and `/hr` respectively (see `website_route_rules` in `hrms/hooks.py`).

## Development setup

This app cannot run standalone — it needs a Frappe bench with `frappe` and `erpnext` already installed. Typical setup:

```sh
bench new-site hrms.local
bench get-app erpnext
bench get-app hrms
bench --site hrms.local install-app hrms
bench --site hrms.local add-to-hosts
bench start
```

Or via Docker (`cd docker && docker-compose up`, credentials `Administrator` / `admin`, served at `localhost:8000`).

All commands below assume you are inside the bench directory (`~/frappe-bench`), not this repo root, unless otherwise noted.

## Common commands

### Backend (Python)

Run from the bench root (`~/frappe-bench`), not from this repo:

```sh
# Run the full hrms test suite (a real site is required)
bench --site <site> run-tests --app hrms

# Run a single test module (dotted path, matches file path with / -> .)
bench --site <site> run-tests --module hrms.hr.doctype.attendance.test_attendance

# Run in parallel across build shards (used in CI)
bench --site <site> run-parallel-tests --app hrms --total-builds <n> --build-number <i> --lightmode
```

Linting/formatting is `ruff` (config in `pyproject.toml`), run via pre-commit:

```sh
pre-commit run --all-files
```

Notable ruff config: tabs for indentation, double quotes, line length ignored (`E501` disabled), import sections ordered `frappe` → `erpnext` → `hrms` → local.

### Frontend (`frontend/` — PWA) and `roster/`

From the repo root, `yarn` workspaces cover both (`aworkspaces` in `package.json`):

```sh
yarn install-pwa-deps      # cd frontend && yarn install
yarn install-roster-deps   # cd roster && yarn install
yarn dev-pwa                # cd frontend && vite dev, served at :8080, proxies /api etc. to the bench
yarn dev-roster              # cd roster && vite dev
yarn build                  # builds both; each build also copies its index.html into hrms/www/
```

Each subproject also has its own `dev` / `build` / `serve` scripts if you `cd` into `frontend/` or `roster/` directly. The Vite dev server proxy auto-detects the bench's `webserver_port` from `sites/common_site_config.json` by walking up parent directories — so `frontend/`/`roster/` need to actually live inside a bench's `apps/hrms` checkout for `yarn dev-pwa`/`yarn dev-roster` to reach the backend.

### Linting (JS/Vue)

Prettier runs via pre-commit for `frontend`-excluded JS/TS/Vue/CSS (note: `frontend/` itself is excluded from the root prettier hook — see `.pre-commit-config.yaml`). `frontend/` has its own local ESLint config (`eslint:recommended` + `plugin:vue/vue3-essential` + prettier).

### Semgrep (CI linter)

CI runs `frappe/semgrep-rules` plus this repo's own rules in `semgrep/test-correctness.yml` against `test_*.py` files.

## Architecture

### Module layout

Two Frappe modules, declared in `hrms/modules.txt`: **HR** (`hrms/hr/`) and **Payroll** (`hrms/payroll/`). Within each, the standard Frappe module structure applies: `doctype/`, `report/`, `dashboard_chart/`, `notification/`, `number_card/`, `print_format/`, `web_form/`, `workspace/`, `page/`.

### Doctype folder pattern

Each doctype under `hrms/hr/doctype/<name>/` or `hrms/payroll/doctype/<name>/` follows the Frappe convention:
- `<name>.json` — schema (fields, permissions, etc.)
- `<name>.py` — server-side controller class
- `<name>.js` — desk form client script (if any)
- `test_<name>.py` — `FrappeTestCase`-based unit tests
- `<name>_list.js`, `<name>_calendar.js`, `<name>_dashboard.py` — optional list view / calendar / dashboard config

### Cross-cutting logic lives outside `doctype/`

- `hrms/overrides/` — subclasses that hook into ERPNext/Frappe doctypes via `override_doctype_class` in `hooks.py` (e.g. `Employee` → `EmployeeMaster`, `Timesheet` → `EmployeeTimesheet`, `Payment Entry` → `EmployeePaymentEntry`, `Project` → `EmployeeProject`). This is how hrms extends doctypes it doesn't own without forking them.
- `hrms/controllers/` — shared logic invoked from multiple doctypes' `doc_events` (e.g. employee boarding status, reminders).
- `hrms/hr/utils.py`, `hrms/utils/` — shared utility functions, including `regional_overrides` hook points (see below).
- `hrms/regional/` — country-specific overrides (currently India: HRA/tax exemption calculations), wired via `regional_overrides` in `hooks.py` rather than conditional branching in shared code.
- `hrms/api/` — whitelisted REST-style endpoints consumed by the frontend/roster PWAs and OAuth/system-settings integration.
- `hrms/telemetry.py` — centralizes product usage telemetry hooks (feature-usage and first-time-milestone events), fired from `doc_events` in `hooks.py` rather than scattered inline calls.

### `hooks.py` is the integration map

`hrms/hooks.py` is the single place to look for how hrms wires into Frappe/ERPNext: `doc_events` (hooks into User/Company/Employee/Payment Entry/Journal Entry/etc.), `scheduler_events` (cron-style jobs by frequency: hourly/daily/weekly/monthly, plus `*_long` variants for slower jobs), `override_doctype_class`, `override_doctype_dashboards`, and `regional_overrides`. When tracing "what happens when X doctype is saved/submitted," start here.

### Patches

`hrms/patches.txt` lists data-migration patches (run on `bench migrate`), implemented under `hrms/patches/`. Follow existing patch naming/structure when adding a new one — check `patches.txt` for the registration format.

### Testing site setup

`before_tests = "hrms.tests.test_utils.before_tests"` in `hooks.py` configures a fresh test site (fiscal year, company, HR settings, etc.) before the suite runs — look here if tests fail due to missing baseline setup data.

## Conventions

- Commit messages are linted with commitlint against `type(scope): subject`, types restricted to `build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test, patch` (`commitlint.config.js`). CI enforces this on PR titles/commits.
- `no-commit-to-branch` pre-commit hook blocks direct commits to `develop` — work on a feature branch.
- Target Python: `>=3.10` (`pyproject.toml`); Frappe/ERPNext dependency pinned to `>=16.0.0,<17.0.0`.
