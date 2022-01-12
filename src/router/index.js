import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'


import Service from '../views/Service.vue'
import ServiceAdd from '../views/ServiceAdd.vue'
import ServiceEdit from '../views/ServiceEdit.vue'
import ServiceList from '../views/ServiceList.vue'

import ServiceDistribute from '../views/ServiceDistribute.vue'
import ServiceHandle from '../views/ServiceHandle.vue'
import ServiceFeedback from '../views/ServiceFeedback.vue'
import ServiceArchive from '../views/ServiceArchive.vue'
import ServiceArchiveList from '../views/ServiceArchiveList.vue'



Vue.use(VueRouter)

const routes = [
  {"path": "/Login",component: Login},
  {"path": "/Home", component:Home,
    children:[
      { "path": "/Home/Service", component: Service,
        redirect: "/Home/Service/ServiceAdd",
        children:[
          { "path": "/Home/Service/ServiceAdd", component: ServiceAdd },
          { "path": "/Home/Service/ServiceEdit", component: ServiceEdit },
          { "path": "/Home/Service/ServiceList", component: ServiceList },
          ]
        },
        { "path": "/Home/ServiceDistribute", component: ServiceDistribute },
        { "path": "/Home/ServiceHandle", component: ServiceHandle },
        { "path": "/Home/ServiceFeedback", component: ServiceFeedback },
        {"path":"/Home/ServiceArchive",component:ServiceArchive,
          redirect: "/Home/ServiceArchive/ServiceArchiveList",
          children:[
            {"path":"/Home/ServiceArchive/ServiceArchiveList",component:ServiceArchiveList},
          ]
      },
      ]
    }
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
