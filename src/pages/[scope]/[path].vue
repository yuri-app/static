<script setup lang="ts">
import { ListResponse } from '@/request/'
import { DataViewProps } from 'primevue/dataview';

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
const layout = ref<DataViewProps['layout']>('list')

const root = computed(() => props.path == '/')
const valid = computed(() => validScope.value && validPath.value)

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

function back() {
  let index = props.path.length - 2
  for (let i = index; i >= 0; i--) {
    if (props.path[i] == '/') {
      index = i
      break
    }
  }
  const newPath = props.path.slice(0, index + 1)
  router.push(`/${props.scope}/${encodeURIComponent(newPath)}`)
}

watchImmediate(() => route.fullPath, init)
</script>


<template>
  <div>
    <div v-if="valid">
      <DataView :value="list" :layout="layout" :data-key="undefined">
        <template #header>
          <div class="flex">
            <Button v-if="!root" icon="i-mdi:arrow-left" label="back" @click="back" />
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
          <div class="flex flex-wrap">
            <Link v-for="{ name, type } in slotProps.items" :key="name + type" class="w-1/2 sm:w-1/3 xl:w-1/4 p-3"
              :to="type == 'directory' ? `${$route.fullPath}${encodeURIComponent(name + '/')}` : `/file/${encodeURIComponent(origin + props.path + name)}`"
              :type="type" :name="name" :layout="layout">
            </Link>
          </div>
        </template>
      </DataView>
    </div>
    <div v-else>
      scope or path is invalid
    </div>
  </div>
</template>
