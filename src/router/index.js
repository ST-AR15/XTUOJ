import Vue from 'vue'
import VueRouter from 'vue-router'

// 404
const NotFound = () => import('@/notfound.vue')

// 管理员页面
// 主页
const adminWelcome = () => import('@/admin/welcome.vue')
const admin = () => import('@/admin/admin.vue')
// question
const questionAdd = () => import('@/admin/question/add.vue')
const questionManage = () => import('@/admin/question/manage.vue')
const questionWelcome = () => import('@/admin/question/welcome.vue')
// contest
const contestManage = () => import('@/admin/contest/manage.vue')
const contestAdd = () => import('@/admin/contest/add.vue')
const contestWelcome = () => import('@/admin/contest/welcome.vue')
// user
const userSearch = () => import('@/admin/user/search.vue')
const userMe = () => import('@/admin/user/me.vue')
const userWelcome = () => import('@/admin/user/welcome.vue')

// 用户页面
const user = () => import('../user/user.vue')
const home = () => import('../user/home.vue')
const problems = () => import('../user/problems.vue')
const contests = () => import('../user/contests.vue')
const ranklist = () => import('../user/ranklist.vue')
const status = () => import('../user/status.vue')
const question = () => import('../user/question.vue')

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
                path: '/',
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
            {
                name: 'admin-welcome',
                path: '/admin',
                component: adminWelcome,
            },
            // 管理端question
            {
                name: 'question-manage',
                path: '/question-manage',
                component: questionManage,
            },
            {
                name: 'question-add',
                path: '/question-add',
                component: questionAdd,
            },
            {
                name: 'question-welcome',
                path: '/question',
                component: questionWelcome,
            },
            // 管理端contest
            {
                name: 'contest-manage',
                path: '/contest-manage',
                component: contestManage,
            },
            {
                name: 'contest-add',
                path: '/contest-add',
                component: contestAdd,
            },
            {
                name: 'contest-welcome',
                path: '/contest',
                component: contestWelcome,
            },
            // 管理端user
            {
                name: 'user-me',
                path: '/user-me',
                component: userMe,
            },
            {
                name: 'user-search',
                path: '/user-search',
                component: userSearch,
            },
            {
                name: 'user-welcome',
                path: '/user',
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
    mode: 'history',
    // base: process.env.BASE_URL,
    routes: routes
})

export default router
