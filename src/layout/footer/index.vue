<template>
	<div class="layout-footer pb15">
		<div class="layout-footer-warp">
			<!-- <div>慧圈慧点，Made by lyt with ❤️</div> -->
			<div class="mt5">慧圈慧点版权所有</div>
			<div class="mt5" @click="link">网站备案号：浙ICP备2022036556号-1</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutFooter">
// 此处需有内容（注释也得），否则缓存将失败
const link = () => {
	window.open('https://beian.miit.gov.cn/', '_blank');
};
</script>

<style scoped lang="scss">
.layout-footer {
	width: 100%;
	display: flex;
	&-warp {
		margin: auto;
		color: var(--el-text-color-secondary);
		text-align: center;
		animation: error-num 0.3s ease;
	}
}
</style>
