<script setup>
import {h, onBeforeMount, reactive} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import {NButton} from "naive-ui";

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
				const id = item?.location_id
				const name = getLocation(id)
				return h(
						"div",
						null,
						{default: () => `${name} (${id})`}
				)
			}
		},
		{
			title: "Категория",
			key: "microcategory_id",
			render(item) {
				const id = item?.microcategory_id
				const name = getCategory(id)
				return h(
						"div",
						null,
						{default: () => `${name} (${id})`}
				)
			}
		},
		{
			title: "Цена",
			key: "price"
		},
	],
	matrixItemData: [],
	matrixItemId: route.params?.matrix_id,
	matrixItemName: null,
	isLoaded: false,
	isCloning: false,
	copyMatrixName: null
})

const pagination = reactive({
	page: 1,
	pageSize: 499,
	pageCount: 3,
})


const loadMatrixItem = async () => {
	state.isLoaded = false
	const res = await axios.get(`/api/matrix/${state.matrixItemId}?p=${pagination.page}`)
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

const cloneMatrix = async () => {
	state.isCloning = true
	const res = await axios.put("/api/matrix/", {
		"matrix": state.matrixItemId,
		"name": state.copyMatrixName
	})
	if (!res.data) return false
	console.log(res)
	await router.push({name: "matrix_new", params: {"matrix_id": res.data.matrix}})
}

onBeforeMount(async () => {
	state.matrixItemData = []
	await loadCategories()
	await loadLocations()
 	await loadMatrixItem()
})
</script>

<template >
	<n-layout v-if="!state.isCloning">
		<n-space>
			<h1>Матрица: {{ state.matrixItemName }}</h1>

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
						type="info"
						secondary
						style="width: 100%;">
					Вернуться к списку матриц
				</n-button>


				<n-popconfirm
						@positive-click="cloneMatrix"
						negative-text="Отмена"
						positive-text="Создать"
						:show-icon="false"
				>
					<template #trigger>
						<n-button
								type="primary"
								secondary
						>
							Клонировать матрицу
						</n-button>
					</template>
					<n-flex :vertical="true">
						Введите название матрицы
						<n-input placeholder="" v-model:value="state.copyMatrixName"></n-input>
					</n-flex>
				</n-popconfirm>
			</n-space>
			<n-pagination
					v-model:page="pagination.page"
					v-model:page-count="pagination.pageCount"
					:page-slot="20"
					show-quick-jumper
					@change="loadMatrixItem()"
			></n-pagination>
		</n-space>
	</n-layout>
	<n-layout v-if="state.isCloning" style="display: flex; text-align: center; flex-direction: column; align-items: center; justify-content: center; margin-top: 20%;">
		<n-h1>Идет процесс клонирования матрицы...</n-h1>
	</n-layout>
</template>
