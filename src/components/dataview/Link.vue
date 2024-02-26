<script setup lang="ts">
import { DataViewProps } from 'primevue/dataview';
import classNames from 'classnames'

const props = defineProps<{
  to: string
  type: 'file' | 'directory'
  name: string
  layout: DataViewProps['layout']
}>()

const isGrid =  computed(() => props.layout == 'grid')
</script>

<template>
  <router-link :to="props.to" flex items-center hover:bg-gray-100 :class="classNames({
    'flex-col': isGrid
  })">
    <div :class="classNames(isGrid ? 'text-20' : 'text-6', props.type == 'file' ? 'i-mdi:file' : 'i-mdi:folder')" m-2 shrink-0></div>
    <div>{{ props.name }}</div>
  </router-link>
</template>


