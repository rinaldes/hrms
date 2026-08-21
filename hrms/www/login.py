# HYOSHII BRAND — Phase 6 (login page)
#
# hrms/www/login.html shadows frappe/www/login.html via Frappe's own app-precedence
# template resolution (frappe.website.page_renderers.template_page.TemplatePage
# searches reversed(frappe.get_installed_apps()), so hrms is checked before frappe for
# any given route) — see that file for why. Frappe's page renderer only invokes
# get_context()/no_cache from a Python module living at the *same* path within the
# *matched* app, so a plain override with no companion .py here would silently drop
# every bit of frappe.www.login.get_context()'s behaviour (already-logged-in redirect,
# signup/LDAP/social-login toggles, login_label, csrf, etc.) — a functional regression
# this plan's "zero functional change" boundary rules out.
#
# Delegating to the real implementation (rather than copying it) keeps this file inert
# to any future change in frappe.www.login.get_context — it can't drift, because it
# isn't a copy.

from frappe.www.login import get_context as get_context  # noqa: F401
from frappe.www.login import no_cache as no_cache  # noqa: F401
