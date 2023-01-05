<script setup>
import { ref, watch, reactive } from "vue";
import JSZip from "jszip";
import axios from "axios";
import { saveAs } from "file-saver";
import { parseVue } from "../utils/vue";
const text = ref();
const zip = new JSZip();
const transformText = ref();
const state = reactive({
	assetsPath: "../assets/test",
	assetsType: ".png",
	count: 0,
});
const finishDownload = ref([]);
const imageUrls = ref();

async function download() {
	state.count = 0;
	finishDownload.value = [];
	await Promise.all(
		Array.from(imageUrls.value).map(async (image) => {
			try {
				const name = image.slice(42) + state.assetsType;
				const file = await getFileData(image);
				return zip.file(name, file, { binary: true });
			} catch (e) {
				console.error(e);
			}
		})
	);

	zip.generateAsync({ type: "blob" }).then(function (content) {
		saveAs(content, "images.zip");
	});
}

async function getFileData(url) {
	const { data } = await axios({ url, responseType: "arraybuffer" });
	return data;
}
// https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com

function transformMain(config = {}) {
	const str = text.value;
	const imgReg = /https:\/\/lanhu\.oss-cn-beijing\.aliyuncs\.com([^"()\s]*)/gi;

	imageUrls.value = new Set(str.match(imgReg));

	transformText.value = str.replace(imgReg, (_, r) => {
		return state.assetsPath + r + state.assetsType;
	});

	transformText.value = parseVue(transformText.value, config);
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
			<button @click="download">批量下载</button> 总共
			{{ imageUrls ? imageUrls.size : 0 }}
		</div>
		<div class="mt-10">
			资源路径<input v-model="state.assetsPath" />
			<br />
			资源后缀<input v-model="state.assetsType" />
		</div>
		<div class="mt-10 mb-10">
			<p>css:</p>
			<button @click="transformMain({ style: { type: 'filterHeight' } })">
				除了height单位转换
			</button>
		</div>
		<div class="mt-10 mb-10">
			<p>page:</p>
			<button @click="transformMain">普通转换</button>
			<button @click="transformMain({ type: 'datav-no' })" class="ml-5">
				大屏转换【一屏幕,不带滚动条】
			</button>
			<button @click="transformMain({ type: 'datav-yes' })" class="ml-5">
				大屏转换【带滚动条】
			</button>
		</div>
		<textarea v-model="text" rows="30" cols="90" class="box" />
		<textarea v-model="transformText" rows="30" cols="90" class="box" />
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
.mb-10 {
	margin-bottom: 20px;
}
.ml-5 {
	margin-left: 5px;
}
</style>
