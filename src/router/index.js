import Vue from 'vue'
import VueRouter from 'vue-router'

// 首页
// import index from '../index.vue'

// 管理员页面
// 主页
// import adminWelcome from '@/admin/welcome.vue'
import admin from '@/admin/admin.vue'
// question
import questionAdd from '@/admin/question/add.vue'
import questionRead from '@/admin/question/read.vue'
import questionWelcome from '@/admin/question/welcome.vue'
// contest
import contestManage from '@/admin/contest/add.vue'
import contestAdd from '@/admin/contest/manage.vue'
import contestWelcome from '@/admin/contest/welcome.vue'
// user
import userSearch from '@/admin/user/search.vue'
import userMe from '@/admin/user/me.vue'
import userWelcome from '@/admin/user/welcome.vue'

// 用户页面
import user from '../user/user.vue'
import home from '../user/home.vue'
import problems from '../user/problems.vue'
import contests from '../user/contests.vue'
import ranklist from '../user/ranklist.vue'
import status from '../user/status.vue'
import question from '../user/question.vue'

// 通用页面
import rank from '../rank.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/admin',
    name: 'admin',
    component: admin,
    children: [
      {
        path: 'question',
        name: 'question',
        component: questionWelcome,
        children: [
          {
            path: 'add',
            name: 'question-add',
            component: questionAdd,
          },
          {
            path: 'read',
            name: 'question-read',
            component: questionRead,
          },
          {
            path: '*',
            name: 'question-404',
            component: questionWelcome,
          }
        ]
      },
      {
        path: '/contest',
        name: 'contest',
        component: contestWelcome,
        children: [
          {
            path: '/add',
            name: 'contest-add',
            component: contestAdd,
          },
          {
            path: '/manage',
            name: 'contest-manage',
            component: contestManage,
          },
          {
            path: '*',
            name: 'contest-404',
            component: contestWelcome,
          }
        ]
      },
      {
        path: '/user',
        name: 'user',
        component: userWelcome,
        children: [
          {
            path: '/me',
            name: 'user-me',
            component: userMe,
          },
          {
            path: '/search',
            name: 'user-search',
            component: userSearch,
          },
          {
            path: '*',
            name: 'user-404',
            component: userWelcome,
          }
        ]
      }
      
    ]
  },
  {
    path: '/',
    name: 'user',
    component: user,
    children: [
      {
        path: '/',
        component: home,
      },
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
  {
    path: '/rank',
    name: 'rank',
    component: rank,
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

export default router
