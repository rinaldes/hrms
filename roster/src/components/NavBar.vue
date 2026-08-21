<template>
	<div class="h-12 bg-brand-600 px-12 flex items-center">
		<div class="flex items-center space-x-1.5">
			<!-- HYOSHII BRAND — text-ink-white matches BaseLayout.vue's PWA header
			treatment (Phase 3); the /80 and /50 opacity steps stay literal `white`
			since frappe-ui's ink/outline system has no muted-white shade to
			substitute (checked frappe-ui/src/tailwind/colors.json — "white" is a
			single solid value there, not a numbered scale like "gray"). -->
			<a href="/desk/hr-setup" class="text-white/80 hover:text-ink-white flex items-center">
				<FrappeHRLogo class="h-6 w-6 mr-2.5" />
				Hyōshii HR
			</a>
			<FeatherIcon name="chevron-right" class="h-4 w-4 text-white/50" />
			<span class="font-medium text-ink-white">Roster</span>
		</div>
		<Dropdown
			class="ml-auto"
			:options="[
				{
					label: 'My Account',
					onClick: () => goTo('/me'),
				},
				{
					label: 'Log Out',
					onClick: () => logout.submit(),
				},
				{
					label: 'Switch to Desk',
					onClick: () => goTo('/app'),
				},
			]"
		>
			<Avatar
				:label="props.user?.full_name"
				:image="props.user?.user_image"
				size="lg"
				class="cursor-pointer"
			/>
		</Dropdown>
	</div>
</template>

<script setup lang="ts">
import { FeatherIcon, Dropdown, Avatar, createResource } from "frappe-ui";
import FrappeHRLogo from "../icons/FrappeHRLogo.vue";

import { User } from "../views/Home.vue";
import { goTo, raiseToast } from "../utils";

const props = defineProps<{
	user: User;
}>();

// RESOURCES

const logout = createResource({
	url: "logout",
	onSuccess() {
		goTo("/login");
	},
	onError(error: { messages: string[] }) {
		raiseToast("error", error.messages[0]);
	},
});
</script>
