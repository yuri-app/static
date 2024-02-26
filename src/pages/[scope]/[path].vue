<script setup lang="ts">
import { ListResponse } from '@/request/'
import { appInject } from '@/inject'


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
  try {
    list.value = await fetchList(result.origin, props.path)
    validPath.value = true
  } catch (error) {
    validPath.value = false
  }
}

watchImmediate(() => route.fullPath, init)

watch(valid, v => {
  if (!v) {
    router.push('/404')
  }
})
</script>


<template>
  <DataView :value="list" :layout="layout" :data-key="undefined" h-full>
    <template #header>
      <div class="flex items-center">
        <router-link :to="backPath">
          <Button icon="i-mdi:arrow-left" label="back" size="small" />
        </router-link>
        <div flex-1></div>
        <DataViewLayoutOptions v-model="layout" />
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
  </DataView>
</template>
