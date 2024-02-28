<script setup lang="ts">
import { ComponentInstance } from 'vue';

import { ListResponse } from '@/request/'
import { appInject } from '@/inject'
import empty from '@/assets/no-file.svg'
import { MenuItem } from 'primevue/menuitem';


const route = useRoute()
const router = useRouter()

const props = defineProps<{
  scope: string
  path: string
}>()

const list = ref<ListResponse>([])
const validScope = ref(true)
const validPath = ref(true)
const origin = ref('')
const rootPath = ref('')
const pathItems = computed<Array<MenuItem>>(() => {
  const data = [
    {
      label: rootPath.value,
      route: `/${props.scope}/${encodeURIComponent('/')}`
    }
  ]
  for (let i = 1, j = 1; i < props.path.length; i++) {
    if (props.path[i] == '/') {
      data.push({
        label: props.path.slice(j, i),
        route: `/${props.scope}/${encodeURIComponent(props.path.slice(0, i + 1))}`
      })
      j = i + 1
    }
  }
  const last: MenuItem = data.at(-1)!
  last.class = 'text-primary-500'
  return data
})
const breadcrumb = ref<ComponentInstance<{}>>()

const { layout } = appInject()

const valid = computed(() => validScope.value && validPath.value)
const backPath = computed(() => {
  if (props.path == '/') {
    return '/'
  }
  let index = props.path.length - 2
  for (let i = index; i >= 0; i--) {
    if (props.path[i] == '/') {
      index = i
      break
    }
  }
  const newPath = props.path.slice(0, index + 1)
  return `/${props.scope}/${encodeURIComponent(newPath)}`
})

async function init() {
  const result = await fetchScope(props.scope)
  validScope.value = !!result
  if (!result) {
    return
  }
  origin.value = result.origin
  rootPath.value = result.path
  await refresh()
}

async function refresh() {
  try {
    list.value = await fetchList(origin.value, props.path)
    validPath.value = true
  } catch (error) {
    validPath.value = false
  }
  scrollBreadcrumb()
}

function scrollBreadcrumb() {
  Object.assign(breadcrumb.value?.$el, {
    scrollLeft: 99999
  })
}

watch(() => route.fullPath, refresh)

watch(valid, v => {
  if (!v) {
    router.push({
      name: 'all'
    })
  }
})

init()
</script>


<template>
  <DataView :value="list" :layout="layout" :data-key="undefined" h-full>
    <template #header>
      <div space-y-4>
        <div class="flex items-center">
          <router-link :to="backPath">
            <Button icon="i-mdi:arrow-left" :label="$t('tip.back')" size="small" />
          </router-link>
          <div flex-1></div>
          <DataViewLayoutOptions v-model="layout" />
        </div>
        <Breadcrumb :model="pathItems" ref="breadcrumb">
          <template #item="{ item }">
            <router-link :to="item.route" whitespace-nowrap>
              {{ item.label }}
            </router-link>
          </template>
        </Breadcrumb>
      </div>
    </template>

    <template #list="slotProps">
      <div class="flex flex-wrap">
        <Link v-for="{ name, type } in slotProps.items" :key="name + type" class="w-full p-3"
          :to="type == 'directory' ? `${$route.fullPath}${encodeURIComponent(name + '/')}` : `/file/${encodeURIComponent(origin + props.path + name)}`"
          :type="type" :name="name" :layout="layout">
        </Link>
      </div>
    </template>

    <template #grid="slotProps">
      <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
        <Link v-for="{ name, type } in slotProps.items" :key="name + type" class="p-3"
          :to="type == 'directory' ? `${$route.fullPath}${encodeURIComponent(name + '/')}` : `/file/${encodeURIComponent(origin + props.path + name)}`"
          :type="type" :name="name" :layout="layout">
        </Link>
      </div>
    </template>

    <template #empty>
      <div flex flex-col items-center justify-center h-full>
        <img :src="empty" w-200px sm:w-300px>
        <div text-4 sm:text-6 mt-6>{{ $t('tip.noFile') }}</div>
      </div>
    </template>
  </DataView>
</template>
