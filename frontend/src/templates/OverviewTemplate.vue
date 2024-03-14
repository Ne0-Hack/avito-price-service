<script setup>
import CardBaseline from "@/components/dashboard/CardBaseline.vue";
import CardControl from "@/components/dashboard/CardControl.vue";
import CardSegmentSearch from "@/components/dashboard/CardSegmentSearch.vue";
import axios from "axios";
import {onBeforeMount, onMounted, reactive} from "vue";

const state = reactive({
	storage: {}
})

const getStorage = async () => {
	const res = await axios.post('/api/storage')
	if(!res.data) return false
	state.storage = await res.data
}

const update = async () => {
	await getStorage()
}

onBeforeMount(async () => {
	await update()
})

</script>

<template>
	<n-flex>
		<CardBaseline @update="update" :storage="state.storage" />
		<CardControl />
	</n-flex>
</template>