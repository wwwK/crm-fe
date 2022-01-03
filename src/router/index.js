import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  { "path": "/Home", component:Home},
  {"path": "/Login",component: Login}
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 直接放行Login组件
  if(to.path == "/Login") {
    next();
    return;
  }
  // 判断用户是否登录
  let user = sessionStorage.getItem("user");
  if(!user) {
    router.push("/Login");
    next();
    return;
  }

  next();
  
});

export default router
