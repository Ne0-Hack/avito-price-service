<script setup>
import {h, onBeforeMount, reactive} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import {NButton, NCheckbox, NInputNumber, NSelect, NTreeSelect} from "naive-ui";

const router = useRouter()
const route = useRoute()

const state = reactive({
	categories: {},
	locations: {},
	matrixItemColumns: [
		{title: "ID", key: "id"},
		{
			title: "Локация",
			key: "location_id",
			render(item) {
				return h(
						NTreeSelect,
						{
							filterable: true,
							options: [state.locations],
							value: item.location_id,
							onUpdateValue: (e) => item.location_id = e,
							keyField: 'id',
							labelField: 'name',
							style: "width: 300px"
						},
				)
			}
		},
		{
			title: "Категория",
			key: "microcategory_id",
			render: function (item) {
				return h(
						NTreeSelect,
		{
							filterable: true,
							options: [state.categories],
							value: item.microcategory_id,
							onUpdateValue: (e) => item.microcategory_id = e,
							keyField: 'id',
							labelField: 'name',
							style: "width: 300px"
						}
				)
			}
		},
		{
			title: "Цена",
			key: "price",
			render(item) {
				return h(
						NInputNumber,
						{
							value: item.price,
							onUpdateValue: (e) => item.price = e
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
	matrixItemData: [],
	matrixItemId: route.params?.matrix_id,
	matrixItemName: null,
	isLoaded: false,
})

const pagination = reactive({
	page: 1,
	pageSize: 499,
	pageCount: 3,
})


const loadMatrixItem = async () => {
	state.isLoaded = false
	const res = await axios.post(`/api/matrix/${state.matrixItemId}?p=${pagination.page}`, {
		"matrix": state.matrixItemData
	})
	if (!res.data) return false
	const data = await res.data
	state.matrixItemName = data.name
	state.matrixItemData = data.body
	pagination.pageCount = data.pages
	state.isLoaded = true
}


const getChildrenName = (obj, id) => {
	if(obj.id === id) {
		return true
	} else {
		const c = obj.children
		for(let i in c) {
			if(c[i].id === id) {
				return c[i].name
			} else {
				const check = getChildrenName(c[i], id)
				if(check) return check
			}
		}
	}
}


const loadCategories = async () => {
	const res = await axios.get(`/api/categories`)
	if (!res.data) return false
	state.categories = await res.data
}

const getCategory = (mc) => {
	const res = getChildrenName(state.categories, mc)
	return res === true ? state.categories.name : res // Костыль
}

const loadLocations = async () => {
	const res = await axios.get(`/api/locations`)
	if (!res.data) return false
	state.locations = await res.data
}

const getLocation = (lc) => {
	const res = getChildrenName(state.locations, lc)
	return res === true ? state.locations.name : res // Костыль
}

const saveMatrix = async () => {
	await loadMatrixItem();
	state.isLoaded = false
	const res = await axios.patch(`/api/matrix/${state.matrixItemId}`)
	if (!res.data) return false
	setTimeout(async() => {
		await router.push({name: 'matrix_item', params: {'matrix_id': res.data.matrix}})
	}, 1000)
}


onBeforeMount(async () => {
	state.matrixItemData = []
	await loadCategories()
	await loadLocations()
	await loadMatrixItem()
})
</script>

<template>
	<n-space>
		<h1>Создание матрицы: {{ state.matrixItemName }}</h1>

	</n-space>
	<n-data-table
			:columns="state.matrixItemColumns"
			:data="state.matrixItemData"
			size="small"
			:bordered="false"
			:loading="!state.isLoaded"
			:max-height="600"
			:aria-disabled="!state.isLoaded"
	/>
	<n-space align="center" justify="space-between" style="width: 100%; margin-top: 30px;">
		<n-space>
			<n-button
					@click="router.push({'name': 'matrix'})"
					type="error"
					secondary
					style="width: 100%;">
				Отмена
			</n-button>
			<!--					-->

			<n-button
					@click="
					saveMatrix()
					"
					type="success"
					secondary
					style="width: 100%;">
				Сохранить
			</n-button>
			<n-button
					@click="state.matrixItemData.unshift({id: null, microcategory_id: 1, location_id: 1, price: 1})"
					type="info"
					secondary
					style="width: 100%;">
				Добавить строку
			</n-button>
		</n-space>
		<n-pagination
				v-model:page="pagination.page"
				v-model:page-count="pagination.pageCount"
				:page-slot="20"
				show-quick-jumper
				@change="loadMatrixItem()"
		></n-pagination>
	</n-space>

</template>