import { createApp } from 'vue'

import { router } from './router.js'
import { store } from './store/store.js'
import vue3GoogleLogin from 'vue3-google-login'

import './assets/styles/main.scss'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(vue3GoogleLogin, {
  clientId:
    '422574143406-8ldr9in53ureob73lgahn6mpjll1n7vp.apps.googleusercontent.com',
})

app.mount('#app')
