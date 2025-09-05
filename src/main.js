import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme' // MODIFIED: Import theme store
import { auth } from './firebase/firebase'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// MODIFIED: Initialize the theme when the app starts
const themeStore = useThemeStore()

let isAppMounted = false
auth.onAuthStateChanged(user => {
  const authStore = useAuthStore()
  authStore.firebaseUser = user
  
  // 4. Mount the app only after the first auth check is done.
  // This prevents any components from rendering before the user state is known.
  if (!isAppMounted) {
    app.mount('#app')
    isAppMounted = true
  }
})