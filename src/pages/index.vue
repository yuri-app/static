<script setup lang="ts">
import { appInject } from '@/inject'

import { RootResponse } from '@/request';
import empty from '@/assets/no-server.svg'

const { layout } = appInject()

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
      <div max-h-full>
        <Link v-for="{ scope, path } in slotProps.items" :key="scope" class="w-full p-3 break-all"
          :to="`/${scope}/${encodeURIComponent('/')}`" type="directory" :name="path" :layout="layout">
        </Link>
      </div>
    </template>

    <template #grid="slotProps">
      <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 max-h-full">
        <Link v-for="{ scope, path } in slotProps.items" :key="scope" class="p-3 break-all"
          :to="`/${scope}/${encodeURIComponent('/')}`" type="directory" :name="path" :layout="layout">
        </Link>
      </div>
    </template>

    <template #empty>
      <div flex flex-col items-center justify-center h-full>
        <img :src="empty" w-200px sm:w-300px>
        <div text-4 sm:text-6 mt-6>{{ $t('tip.noServer') }}</div>
      </div>
    </template>
  </DataView>
</template>
