<script setup>
import { onMounted, ref, watch, computed } from "vue";
const text = ref();
const props = defineProps({
	modelValue: {},
	width: {
		default: "100%",
	},
	height: {
		default: "100%",
	},
	style: {
		default: "",
	},
});
const emits = defineEmits();
function blur(e) {
	text.value = e.target.innerHTML;
}
onMounted(() => {
	text.value = props.modelValue;
});

watch(
	() => [text.value],
	() => {
		emits("update:modelValue", text.value);
	}
);

const style = computed(() => {
	const CSS = {};
	["width", "height"].forEach((attr) => {
		CSS[attr] = props[attr];
	});
	return CSS;
});
</script>
<template>
	<div
		class="box"
		contenteditable="true"
		v-html="text"
		@blur="blur"
		:style="style"
	></div>
</template>
<style>
.box {
	width: var(--width);
	height: var(--height);
	outline: none;
}
</style>
