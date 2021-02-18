import Vue from 'vue'
import VueRouter from 'vue-router'

// 首页
// import index from '../index.vue'

// 管理员页面
import admin from '../admin/admin.vue'

// 用户页面
import user from '../user/user.vue'
import home from '../user/home.vue'
import problems from '../user/problems.vue'
import contests from '../user/contests.vue'
import ranklist from '../user/ranklist.vue'
import status from '../user/status.vue'
import question from '../user/question.vue'

// 通用页面



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
    component: user,
    children: [
      {
        path: 'home',
        component: home,
      },
      {
        path: 'problems',
        component: problems,
      },
      {
        path: 'contests',
        component: contests,
      },
      {
        path: 'ranklist',
        component: ranklist,
      },
      {
        path: 'status',
        component: status,
      },
      {
        path: 'question/:ID',
        component: question,
      }
    ]
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

export default router
