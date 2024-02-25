import 'uno.css'
import '@unocss/reset/tailwind-compat.css'
import './base.css'

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import PrimeVue from 'primevue/config';
import Ripple from 'primevue/ripple';

import Lara from '@/primevue-presets/lara';

import routes from '~pages'

import App from './App.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

createApp(App)
  .use(router)
  .use(PrimeVue, {
    unstyled: true,
    pt: Lara,
    ripple: true
  })
  .directive('ripple', Ripple)
  .mount('#app')
