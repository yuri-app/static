<script setup lang="ts">
import notFound from '@/assets/404.svg'
</script>


<template>
  <div flex flex-col items-center justify-center h-screen>
    <img :src="notFound" width="500">
    <router-link to="/">
      <Button label="Back to Home" mt-100px />
    </router-link>
  </div>
</template>
