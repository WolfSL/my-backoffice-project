import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme' // MODIFIED: Import theme store

const app = createApp(App)

app.use(createPinia())
app.use(router)

// MODIFIED: Initialize the theme when the app starts
const themeStore = useThemeStore()

app.mount('#app')