<script setup lang="ts">
import { appProvide, Layout } from '@/inject'

const layout = ref<Layout>('list')

appProvide({
  layout
})
</script>


<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>
