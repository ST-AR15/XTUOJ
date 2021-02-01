import Vue from 'vue'
import VueRouter from 'vue-router'

// 首页
// import index from '../index.vue'

// 管理员页面
import admin from '../admin/admin.vue'

// 用户页面
import user from '../user/user.vue'


Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/',
  //   name: 'index',
  //   component: index
  // },
  {
    path: '/admin',
    name: 'admin',
    component: admin
  },
  {
    path: '/',
    name: 'user',
    component: user
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

export default router
