<script setup>
import {onBeforeMount, reactive} from "vue";
	import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()

const state = reactive({
	matrixListColumns: [
		{title: "ID", key: "id"},
		{title: "Наименование", key: "name"},
	],
	matrixListData: [],

})

const loadMatrixList = async() => {
	const res = await axios.get("/api/matrix")
	if(!res.data) return false
	state.matrixListData = res.data
}

const rowProps = (row) => {
	return {
		style: 'cursor: pointer;',
		onClick: () => {
			router.push({'name': 'matrix_item', 'params': {'matrix_id': row.id}})
		}
	}
}

onBeforeMount(async () => {
	await loadMatrixList()
})
</script>

<template>
	<n-data-table
			:columns="state.matrixListColumns"
			:data="state.matrixListData"
			size="small"
			:bordered="false"
			:row-props="rowProps"

	>

	</n-data-table>
</template>