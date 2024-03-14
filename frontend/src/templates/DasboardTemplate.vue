<script setup>
import {Search28Regular, AppGeneric24Filled, Key24Regular, DataBarVertical24Regular} from "vicons/fluent";
import {NIcon} from "naive-ui/lib";
import {h, defineAsyncComponent, reactive, onMounted} from "vue";
import CardBaseline from "@/components/dashboard/CardBaseline.vue";
import {RouterLink} from "vue-router";
import {useLoadingBar} from "naive-ui";
import axios from "axios";

const renderIcon = (icon) => {
	return () => h(NIcon, null, {default: () => h(icon)})
}

const menuOptions = [
	{
		label: () =>
				h(
						RouterLink,
						{
							to: {
								name: 'dashboard',
							}
						},
						{default: () => 'Обзор'}
				),
		key: "dash",

		icon: renderIcon(AppGeneric24Filled)
	},
	{
		label: () =>
				h(
						RouterLink,
						{
							to: {
								name: 'matrix',
							}
						},
						{default: () => 'Список матриц'}
				),
		key: "matrix",
		icon: renderIcon(DataBarVertical24Regular)
	},
	{
		label: () =>
				h(
						RouterLink,
						{
							to: {
								name: 'storage',
							}
						},
						{default: () => 'Список сегментов'}
				),
		key: "storage",
		icon: renderIcon(Key24Regular)
	},
]

const loadingBar = useLoadingBar()

const state = reactive({
	isLoading: true,
	storage: {}
})

const checkHost = async () => {
	loadingBar.start()
	await axios.get("/")
			.then(() => {
				state.isLoading = false
				state.isError = false
				loadingBar.finish()
			})
			.catch(async (e) => {
				if(e.code === "ERR_NETWORK") {
					state.isLoading = false
					state.isError = true
					loadingBar.error()
				} else {
					state.isLoading = false
					state.isError = false
					loadingBar.finish()
				}
			})
	if(state.isError) {
		setTimeout(await checkHost, 500)
	}
}




onMounted(async () => {
	await checkHost()
})

</script>

<template>
	<keep-alive>
		<n-layout v-if="!state.isLoading && !state.isError"  has-sider sider-placement="right">
			<n-layout-content style="padding: 20px;">
				<router-view></router-view>
			</n-layout-content>
			<n-layout-sider
					bordered
					show-trigger
					collapse-mode="width"
					:collapsed-width="64"
					:width="240"
					:native-scrollbar="false"
					style="height: 100vh"
			>
				<n-menu
						:collapsed-width="64"
						:collapsed-icon-size="22"
						:options="menuOptions"
						default-value="dash"
				/>
			</n-layout-sider>
		</n-layout>
	</keep-alive>
	<n-layout v-if="state.isLoading || state.isError" style="display: flex; text-align: center; flex-direction: column; align-items: center; justify-content: center; margin-top: 20%;">
		<n-h1>Загрузка...</n-h1>
		<span v-if="state.isError">Произошла ошибка. Повторная попытка подключения...</span>
	</n-layout>

</template>