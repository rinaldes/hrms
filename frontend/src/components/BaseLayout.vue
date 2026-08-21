<template>
	<ion-page>
		<!-- HYOSHII BRAND — dark teal header (decision 6, Phase 3). bg-brand-600 +
		standalone:pt-safe-top on ion-header itself (not just the inner div) so the
		status-bar safe-area reads as teal instead of a white band; text-ink-white on
		the content wrapper so the title and the FeatherIcon bell (which inherits
		stroke="currentColor") both flip to light-on-dark without separate classes. -->
		<ion-header class="ion-no-border bg-brand-600 standalone:pt-safe-top">
			<div class="w-full sm:w-96">
				<div class="flex flex-col bg-brand-600 text-ink-white shadow-sm p-4">
					<div class="flex flex-row justify-between items-center">
					<div class="flex flex-row items-center gap-2">
							<h2 class="text-xl font-bold text-ink-white">
								{{ props.pageTitle || __("Hyōshii HR") }}
							</h2>
						</div>
						<div class="flex flex-row items-center gap-3 ml-auto">
							<router-link
								:to="{ name: 'Notifications' }"
								v-slot="{ navigate }"
								class="flex flex-col items-center"
							>
								<span class="relative inline-block" @click="navigate">
									<FeatherIcon name="bell" class="h-6 w-6" />
									<span
										v-if="unreadNotificationsCount.data"
										class="absolute top-0 right-0.5 inline-block w-2 h-2 bg-red-600 rounded-full border border-outline-white"
									>
									</span>
								</span>
							</router-link>
							<router-link
								:to="{ name: 'Profile' }"
								class="flex flex-col items-center"
							>
								<Avatar
									:image="user.data.user_image"
									:label="user.data.first_name"
									size="xl"
								/>
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</ion-header>

		<ion-content class="ion-no-padding">
			<div class="flex flex-col h-screen w-screen sm:w-96">
				<slot name="body"></slot>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup>
import { IonHeader, IonContent, IonPage } from "@ionic/vue"
import { FeatherIcon, Avatar } from "frappe-ui"

import { unreadNotificationsCount } from "@/data/notifications"

import { inject } from "vue"

const user = inject("$user")

const props = defineProps({
	pageTitle: {
		type: String,
		required: false,
		default: "",
	},
})
</script>
