import { createApp } from 'vue'
import { createPinia } from 'pinia'
import md5 from 'js-md5'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import api from '../src/api/api'
import './config/rem'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import cookie from './config/cookie'
import './assets/css/public.less'
import tool from './config/tool'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(tool)

// app.config.globalProperties.$md5 = md5
// app.config.globalProperties.$api = api   // vue3 全局引入调用接口变麻烦，故不使用该形式
// app.config.globalProperties.$cookie = cookie

app.mount('#app')
