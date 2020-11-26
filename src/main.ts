import Vue from 'vue'
import App from './App.vue'
import filters from './filters'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import tools from './tools'
import * as api from './api'
Vue.config.productionTip = false
Vue.prototype.$tools = tools // 暴露在 vue 对象中
Vue.prototype.$api = api // 暴露在 vue 对象中
Vue.use(ElementUI)
filters(Vue) // 注册全局过滤器
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
