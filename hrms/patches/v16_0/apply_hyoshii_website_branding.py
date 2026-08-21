import frappe


def execute():
	"""HYOSHII BRAND — Phase 7 (website pages).

	Sets up the Website Theme record that recompiles Bootstrap's own $primary/$body-bg
	(the raw-utility-class surface hrms-web.bundle.scss's custom properties can't reach —
	see that file's header comment), and points Website Settings at the new brand so
	frappe.get_website_settings("app_name"/"app_logo") — consumed by the standard
	outbound-email header (frappe/email/email_body.py get_brand_name/get_brand_logo) —
	no longer carries stale/blank branding instead of "Hyoshii HR".
	"""
	primary_color = ensure_color("Hyoshii Teal 600", "#1d494a")
	background_color = ensure_color("Hyoshii Warm White", "#fbfaf7")

	theme_name = "Hyoshii HR"
	if frappe.db.exists("Website Theme", theme_name):
		theme = frappe.get_doc("Website Theme", theme_name)
		theme.custom = 1
		theme.primary_color = primary_color
		theme.background_color = background_color
		theme.save(ignore_permissions=True)
	else:
		theme = frappe.new_doc("Website Theme")
		theme.theme = theme_name
		theme.custom = 1
		theme.primary_color = primary_color
		theme.background_color = background_color
		theme.insert(ignore_permissions=True)

	# Also sets it as Website Settings.website_theme (the active theme) — the
	# doctype's own sanctioned "make this the default" flow.
	theme.set_as_default()

	website_settings = frappe.get_single("Website Settings")
	website_settings.app_name = "Hyōshii HR"
	website_settings.app_logo = "/assets/hrms/images/frappe-hr-logo.svg"
	website_settings.save(ignore_permissions=True)


def ensure_color(name, hex_value):
	if frappe.db.exists("Color", name):
		doc = frappe.get_doc("Color", name)
		if doc.color != hex_value:
			doc.color = hex_value
			doc.save(ignore_permissions=True)
	else:
		doc = frappe.new_doc("Color")
		doc.name = name
		doc.color = hex_value
		doc.insert(ignore_permissions=True)
	return doc.name
