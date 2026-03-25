import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
import store from '@/store'

import '@/assets/styles/main.scss'

const app = createApp(App)

app
  .use(router)
  .use(store)
  .mount('#app')