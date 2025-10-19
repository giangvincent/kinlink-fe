import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { type PluginOptions } from 'vue-toastification'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import router from './router'
import { i18n } from './plugins/i18n'
import { useTheme } from './composables/useTheme'

import '@/assets/main.css'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

const toastOptions: PluginOptions = {
  position: 'top-right',
  timeout: 4000,
  closeOnClick: true
}

app.use(Toast, toastOptions)

useTheme()

registerSW({ immediate: true })

app.mount('#app')
