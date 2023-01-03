<script setup>
import { onMounted, reactive, ref } from "vue";
import Full from "../components/full.vue";
const dom = ref();
const state = reactive({
	w: 0,
	h: 0,
	blocks: 5,
});
function init() {
	let _dom = dom.value;
	// 宽度减去滚动条宽度
	state.w = _dom.offsetWidth;
	state.h = _dom.offsetHeight;
}

onMounted(() => {
	init();
	window.addEventListener("resize", init);
});
</script>

<template>
	<div class="datav">
		<div class="wrap">
			<div class="home" ref="dom">
				<Full
					:options="{ width: 1920, height: 540 * 3, w: state.w, h: state.h }"
				>
					<div class="container">
						<div class="left direction-col">
							<div v-for="item in state.blocks" class="box"></div>
						</div>
						<div class="center direction-col">
							<div class="box"></div>
						</div>
						<div class="right direction-col">
							<div v-for="item in state.blocks" class="box"></div>
						</div>
					</div>
				</Full>
			</div>
		</div>
	</div>
</template>
<style scoped>
.datav {
	--pad: 20px;
	height: 100%;
	width: 100%;
	padding: var(--pad);
	box-sizing: border-box;
}
.wrap {
	--gap: 10px;
	height: 100%;
	overflow: auto;
	box-sizing: border-box;
}
.wrap::-webkit-scrollbar {
	width: 8px;
}
.wrap::-webkit-scrollbar-thumb {
	width: 8px;
	border-radius: 4px;
	background-color: #ede7f8;
}

.home {
	height: 200vh;
	position: relative;
}

.container {
	display: flex;
	gap: var(--gap);
	height: 100%;
	box-sizing: border-box;
}

.h-full {
	height: 100%;
}

.left {
	flex: 1;
}

.right {
	flex: 1;
}

.center {
	flex: 3;
}

.direction-col {
	display: flex;
	flex-direction: column;
	gap: var(--gap);
	height: 100%;
}
.box {
	flex: 1;
	border: 1px solid red;
}
</style>
