<script setup>
import {NIcon} from "naive-ui/lib";
import {Search28Regular} from "vicons/fluent";
</script>
<template>
	<n-card title="Проверка сегментов пользователя" style="width: 500px">
		<n-input-group>
			<n-input placeholder="Введите ID пользователя" />
			<n-button type="info">
				<template #icon>
					<n-icon><Search28Regular /></n-icon>
				</template>
			</n-button>
		</n-input-group>
		<n-layout style="padding: 5px; margin-top: 10px;"><span>290</span>; <span>182</span>;</n-layout>
	</n-card>
</template>