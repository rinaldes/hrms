<template>
	<!-- Header -->
	<div class="flex flex-row justify-between items-center">
		<h2 class="text-base font-semibold text-ink-gray-8">{{ type }}</h2>
		<span class="text-base font-semibold text-ink-gray-8">
			{{ total }}
		</span>
	</div>

	<!-- Table -->
	<div
		v-if="items"
		class="flex flex-col bg-surface-white mt-5 rounded border overflow-auto"
	>
		<div
			class="flex flex-row p-3.5 items-center justify-between border-b"
			v-for="(item, idx) in items"
			:key="idx"
		>
			<div
				class="text-base font-normal whitespace-nowrap overflow-hidden text-ellipsis text-ink-gray-8"
			>
				{{ item.salary_component }}
			</div>
			<span class="text-ink-gray-7 font-normal rounded text-base">
				{{ formatCurrency(item.amount, salarySlip.currency) }}
			</span>
		</div>
	</div>
	<EmptyState
		v-else
		:message="__('No {0} added', [props.type?.toLowerCase()])"
		:isTableField="true"
	/>
</template>

<script setup>
import { computed,inject } from "vue"

import EmptyState from "@/components/EmptyState.vue"
import { formatCurrency } from "@/utils/formatters"

const __ = inject("$translate")

const props = defineProps({
	salarySlip: {
		type: Object,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	isReadOnly: {
		type: Boolean,
		default: false,
	},
})

const items = computed(() => {
	return props.type === "Earnings"
		? props.salarySlip.earnings
		: props.salarySlip.deductions
})

const total = computed(() => {
	return props.type === "Earnings"
		? props.salarySlip.gross_pay
		: props.salarySlip.total_deduction
})
</script>
