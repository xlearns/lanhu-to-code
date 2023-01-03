<script setup>
import { ref, watch, reactive } from "vue";
const text = ref();
const transformText = ref();
const state = reactive({
	assetsPath: "../assets/test",
	assetsType: ".png",
	count: 0,
});
const finishDownload = ref([]);
const imageUrls = ref();

function download() {
	state.count = 0;
	finishDownload.value = [];

	Array.from(imageUrls.value).forEach((image, index) => {
		setTimeout(() => {
			downloadImage(image.slice(42) + ".png", image);
			// index >= 100 can be downloaded successfully why??
		}, index * 100);
	});
}

function downloadImage(filename, url) {
	// return console.log(url);
	fetch(url)
		.then((res) => res.blob())
		.then((blob) => {
			// create URL and Link
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);

			// Invoke download
			a.click();

			// remove URL and Link
			window.URL.revokeObjectURL(url);
			a.remove();
			state.count++;
		})
		.catch((err) => console.error(err.message));
}

function transformMain() {
	const str = text.value;
	const imgReg = /https:\/\/lanhu\.oss-cn-beijing\.aliyuncs\.com([^"()\s]*)/gi;

	imageUrls.value = new Set(str.match(imgReg));

	transformText.value = str.replace(imgReg, (_, r) => {
		return state.assetsPath + r + state.assetsType;
	});
}
watch(
	() => [text.value],
	() => {
		transformMain();
	}
);
</script>
<template>
	<div class="home">
		<div>
			<button @click="download">批量下载</button> 总共{{ state.count }} /
			{{ imageUrls ? imageUrls.size : 0 }}
		</div>
		<div class="mt-10">
			资源路径<input v-model="state.assetsPath" />
			<br />
			资源后缀<input v-model="state.assetsType" />
		</div>
		<div class="mt-10">
			<button @click="transformMain">转换</button>
		</div>
		<textarea v-model="text" rows="50" cols="80" class="box" />
		<textarea v-model="transformText" rows="50" cols="80" class="box" />
	</div>
</template>
<style scoped>
.home {
	padding: 20px;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
}
.box {
	border: 1px solid red;
	outline: none;
}
.box:last-child {
	margin-left: 20px;
}
.mt-10 {
	margin-top: 20px;
}
</style>
