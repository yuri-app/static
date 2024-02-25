<script setup lang="ts">
const props = defineProps<{
  path: string
}>()

</script>

<template>
  <iframe :src="props.path" h-screen w-screen></iframe>
</template>
