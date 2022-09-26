import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'

import 'ant-design-vue/dist/antd.css'
import '~/assets/styles/main.scss'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
