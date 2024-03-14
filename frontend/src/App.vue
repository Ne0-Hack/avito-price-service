<script setup>
	import { darkTheme } from 'naive-ui'
</script>

<template>
	<n-config-provider :theme="darkTheme">
		<n-loading-bar-provider>
			<n-modal-provider>
				<n-layout style="height: 100vh">
					<n-scrollbar>
						<n-layout-content>
							<router-view></router-view>
						</n-layout-content>

					</n-scrollbar>

				</n-layout>
			</n-modal-provider>
		</n-loading-bar-provider>
	</n-config-provider>

</template>

<style scoped>

</style>
