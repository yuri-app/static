<script setup lang="ts">
const props = defineProps<{
  path: string
}>()

const router = useRouter()

async function init() {
  try {
    await fetch(props.path)
  } catch (error) {
    router.push({
      name: 'all'
    })
  }
}

init()

</script>

<template>
  <iframe :src="props.path" h-screen w-screen></iframe>
</template>
