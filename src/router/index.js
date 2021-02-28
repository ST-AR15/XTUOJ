import Vue from 'vue'
import VueRouter from 'vue-router'

// 404
import NotFound from '@/notfound.vue'

// 管理员页面
// 主页
// import adminWelcome from '@/admin/welcome.vue'
import admin from '@/admin/admin.vue'
// question
import questionAdd from '@/admin/question/add.vue'
import questionManage from '@/admin/question/manage.vue'
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
    // 用户端
    {
        name: 'user',
        path: '/',
        component: user,
        children: [
            {
                name: 'home',
                path: '/home',
                component: home,
            },
            {
                name: 'problems',
                path: '/problems',
                component: problems,
            },
            {
                name: 'problems-detail',
                path: '/problems/:ID',
                component: question,
            },
            {
                name: 'contests',
                path: '/contests',
                component: contests,
            },
            {
                name: 'status',
                path: '/status',
                component: status,
            },
            {
                name: 'ranklist',
                path: '/ranklist',
                component: ranklist,
            },
        ],
    },
    {
        name: 'rank',
        path: '/rank',
        component: rank
    },
    // 管理端
    {
        name: 'admin',
        path: '/admin',
        component: admin,
        children: [
            // 管理端question
            {
                name: 'question-manage',
                path: '/admin/question/manage',
                component: questionManage,
            },
            {
                name: 'question-add',
                path: '/admin/question/add',
                component: questionAdd,
            },
            {
                name: 'question-welcome',
                path: '/admin/question',
                component: questionWelcome,
            },
            // 管理端contest
            {
                name: 'contest-manage',
                path: '/admin/contest/manage',
                component: contestManage,
            },
            {
                name: 'contest-add',
                path: '/admin/contest/add',
                component: contestAdd,
            },
            {
                name: 'contest-welcome',
                path: '/admin/contest',
                component: contestWelcome,
            },
            // 管理端user
            {
                name: 'user-me',
                path: '/admin/user/me',
                component: userMe,
            },
            {
                name: 'user-search',
                path: '/admin/user/search',
                component: userSearch,
            },
            {
                name: 'user-welcome',
                path: '/admin/user',
                component: userWelcome,
            },
        ]
    },
    {
        name: '404',
        path: '*',
        component: NotFound,
    }
]

const router = new VueRouter({
// mode: 'history',
base: process.env.BASE_URL,
routes: routes
})

export default router
