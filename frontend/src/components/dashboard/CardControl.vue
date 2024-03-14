<script setup></script>
<template>
	<n-card title="Управление" style="width: 500px">
		<n-flex :vertical="true" >
			<router-link :to="{name: 'matrix'}">
				<n-button>Открыть список матриц</n-button>
			</router-link>
			<router-link :to="{name: 'storage'}">
				<n-button>Открыть список сегментов</n-button>
			</router-link>
		</n-flex>
	</n-card>
</template>