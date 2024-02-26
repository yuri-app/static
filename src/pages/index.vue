<script setup lang="ts">
import { DataViewProps } from 'primevue/dataview';

import { RootResponse } from '@/request';

const layout = ref<DataViewProps['layout']>('list')

const list = ref<RootResponse['list']>([])

async function init() {
  const result = await fetchRoot()
  list.value = result.list
}

init()
</script>


<template>
  <DataView :value="list" :layout="layout" :data-key="undefined" h-full>
    <template #header>
      <div class="flex items-center">
        <div flex-1></div>
        <DataViewLayoutOptions v-model="layout" />
      </div>
    </template>

    <template #list="slotProps">
      <div class="flex flex-wrap">
        <Link v-for="{ scope, path } in slotProps.items" :key="scope" class="w-full p-3"
          :to="`/${scope}/${encodeURIComponent('/')}`" type="directory" :name="path" :layout="layout">
        </Link>
      </div>
    </template>

    <template #grid="slotProps">
      <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
          <Link v-for="{ scope, path } in slotProps.items" :key="scope" class="p-3"
          :to="`/${scope}/${encodeURIComponent('/')}`" type="directory" :name="path" :layout="layout">
        </Link>
      </div>
    </template>
  </DataView>
</template>
