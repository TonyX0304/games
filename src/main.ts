import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import tools from './tools'
import * as api from './api'
Vue.config.productionTip = false
Vue.prototype.$tools = tools // 暴露在 vue 对象中
Vue.prototype.$api = api // 暴露在 vue 对象中

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
