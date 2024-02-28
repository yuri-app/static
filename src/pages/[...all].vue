<script setup lang="ts">
import notFound from '@/assets/404.svg'
</script>

<template>
  <div flex flex-col items-center justify-center h-screen>
    <img :src="notFound" w-250px sm:w-500px>
    <router-link to="/">
      <Button :label="$t('tip.backToHome')" mt-24 />
    </router-link>
  </div>
</template>
