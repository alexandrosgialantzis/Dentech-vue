import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import { createApp } from 'vue'
import './assets/styles.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
