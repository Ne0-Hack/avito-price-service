<script setup>
import {onBeforeMount, reactive, h} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {NCheckbox, NInputNumber, NSelect} from "naive-ui";

const router = useRouter()

const state = reactive({
	matrixSegmentColumns: [
		{title: "ID", key: "id"},
		{
			title: "Сегмент",
			key: "segment",
			render(item) {
				return h(
					NInputNumber,
					{
						value: item.segment,
						onUpdateValue: (e) => item.segment = e
					},
				)
			}
		},
		{
			title: "Матрица",
			key: "matrix",
			render(item) {
				return h(
						NSelect,
						{
							value: item.name,
							onUpdateValue: (e) => item.name = e,
							labelField: "name",
							valueField: "name",
							options: state.matrixList
						},
				)
			}
		},
		{
			title: "Удалить?",
			key: "isDrop",
			render(item) {
				return h(
						NCheckbox,
						{
							checked: item.isDrop ?? false,
							onUpdateChecked: () => item.isDrop = true
						},
				);
			}
		},
	],
	matrixSegmentData: [],
	matrixList: []
})

const loadMatrixList = async() => {
	const res = await axios.get("/api/matrix")
	if(!res.data) return false
	state.matrixList = res.data
}

const loadSegmentList = async() => {
	const res = await axios.post("/api/storage", {
		"storage": state.matrixSegmentData
	})
	if(!res.data) return false
	state.matrixSegmentData = res.data.discounts
}

onBeforeMount(async () => {
	await loadMatrixList()
	await loadSegmentList()
})
</script>

<template>
	<n-data-table
			:columns="state.matrixSegmentColumns"
			:data="state.matrixSegmentData"
			size="small"
			:bordered="false"
	>

	</n-data-table>
	<n-space style="margin-top: 30px;">
		<n-button type="success" @click="loadSegmentList">
			Сохранить
		</n-button>
		<n-button type="info" @click="state.matrixSegmentData.unshift({
			id: null,
			segment: 0,
			name: null,
		})">
			Добавить строку
		</n-button>
	</n-space>
</template>