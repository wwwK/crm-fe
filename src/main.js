import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8888/"
//让axios发送请求的时候，自动携带cookie（默认不携带cookie）
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
