import Vue from 'vue'
import VueRouter from 'vue-router'

// 首页
// import index from '../index.vue'

// 管理员页面
import admin from '../admin/admin.vue'
import add from '../admin/add.vue'
import addContest from '../admin/addContest.vue'
import manageContest from '../admin/manageContest.vue'
import person from '../admin/person.vue'
import read from '../admin/read.vue'
// import welcome from '../admin/welcome.vue'

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
  {
    path: '/admin',
    name: 'admin',
    component: admin,
    children: [
      {
        path: 'add',
        component: add,
      },
      {
        path: 'addContest',
        component: addContest,
      },
      {
        path: 'manageContest',
        component: manageContest,
      },
      {
        path: 'person',
        component: person,
      },
      {
        path: 'read',
        component: read,
      }
      // TODO 任意匹配的*（用于404）在这里报错？
    ]
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
