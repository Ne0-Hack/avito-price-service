<script setup>

import {reactive, h, toRef} from "vue";
import {NButton} from "naive-ui";
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()
const props = defineProps(["storage"])
const emit = defineEmits(['update'])
const state = reactive({
	storage: toRef(() => props.storage),
	baselineModal: false,
	baselineCoumns: [
		{
			title: "Наименование",
			key: "name"
		},
		{
			title: '',
			key: 'id',
			render (row) {
				return h(
						NButton,
						{
							size: 'small',
							disabled: state.storage.baseline?.id === row.id,
							onClick: () => setBaseline(row.id)
						},
						{ default: () => 'Установить матрицу' }
				)
			}
		}
	],
	baselineData: [],
})

const openBaselineMatrix = async () => {
	const res = await axios.get("/api/matrix")
	if(!res.data) return false
	const data = []
	for await (let item of res.data) {
		data.push({name: item.name, id: item.id})
	}
	state.baselineData = data
	state.baselineModal = true
}

const setBaseline = async (id) => {
	if( state.storage.baseline?.id === id ) return false
	await axios.post(`/api/storage/matrix/${id}`)
	emit('update')
}


</script>
<template v-if="state.storage?.baseline">
	<n-card  :title='"Хранилище | "+state.storage.baseline?.name' style="width: 500px">
		<n-blockquote>Кол-во активных сегментов: {{ state.storage.discounts?.length }}</n-blockquote>
		<n-flex>
			<n-button @click="router.push({name: 'matrix_item', params: {'matrix_id': state.storage.baseline?.id}})">Открыть матрицу</n-button>
			<n-button @click="openBaselineMatrix">Изменить baseline</n-button>
		</n-flex>
	</n-card>

	<n-modal
			preset="card"
			title="Список матриц"
			:bordered="false"
			size="huge"
			aria-modal="true"
			v-model:show="state.baselineModal"
			style="width: 600px"
			@negativeClick="state.baselineModal = false"
	>
			<n-data-table
					:columns="state.baselineCoumns"
					:data="state.baselineData"
					:max-height="400"
			/>
	</n-modal>
</template>