import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

import $ from 'jquery'
import 'ztree'
import 'ztree/css/zTreeStyle/zTreeStyle.css'

//layui
// import '../node_modules/layui/dist/css/layui.css'
// import layui from 'layui';

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
