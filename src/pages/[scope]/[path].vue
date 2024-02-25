<script setup lang="ts">
import { ListResponse } from '@/request/'

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
      <Button v-if="!root" icon="i-mdi:arrow-left" label="back" @click="back" />
      <div v-for="{ name, type } in list" :key="name + type">
        <router-link :to="$route.fullPath + encodeURIComponent(name + '/')" v-if="type == 'directory'">{{ name }}</router-link>
        <router-link v-else :to="`/file/${encodeURIComponent(origin + props.path + name)}`">{{ name }}</router-link>
        <div>{{ type }}</div>
      </div>
    </div>
    <div v-else>
      scope or path is invalid
    </div>
  </div>
</template>
