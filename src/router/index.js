import Vue from 'vue'
import VueRouter from 'vue-router'

// 404
// const NotFound = () => import('@/notfound.vue')
import NotFound from '@/views/general/404.vue'

// 用户页面
// const user = () => import('../user/user.vue')
// const home = () => import('../user/home.vue')
// const problems = () => import('../user/problems.vue')
// const contests = () => import('../user/contests.vue')
// const ranklist = () => import('../user/ranklist.vue')
// const status = () => import('../user/status.vue')
// const question = () => import('../user/question.vue')
import user from '@/views/user/App.vue'
import home from '@/views/user/Home.vue'
import problems from '@/views/user/Problems.vue'
import question from '@/views/user/Question.vue'
import contests from '@/views/user/Contests.vue'
import status from '@/views/user/Status.vue'

// 管理端
import admin from '@/views/admin/App.vue'
import adminHome from '@/views/admin/Home.vue'
import addContest from '@/views/admin/contest/Add.vue'
import manageContest from '@/views/admin/contest/Manage.vue'
import addQuestion from '@/views/admin/question/Add.vue'
import manageQontest from '@/views/admin/question/Manage.vue'
import meUser from '@/views/admin/user/Me.vue'
import searchUser from '@/views/admin/user/Search.vue'

// 外部页面
import rank from '@/views/outer/Rank.vue'
import balloon from '@/views/outer/Balloon.vue'


Vue.use(VueRouter)

const routes = [
    // 用户端
    {
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
                name: 'question',
                path: '/problems/:ID',
                component: question,
            },
            {
                name: 'question_contest',
                path: '/problems/:CID/:ID',
                component: question,
            },
            {
                name: 'contests',
                path: '/contests',
                component: contests,
            },
            {
                name: 'contests_detail',
                path: '/contests/:CID',
                component: contests,
            },
            {
                name: 'status',
                path: '/status',
                component: status,
            },
        ]
    },
    // 管理端
    {
        path: '/admin',
        component: admin,
        children: [
            {
                name: 'adminHome',
                path: '/',
                component: adminHome,
            },
            {
                name: 'contest-add',
                path: '/admin/contest-add',
                component: addContest,
            },
            {
                name: 'contest-manage',
                path: '/admin/contest-manage',
                component: manageContest,
            },
            {
                name: 'question-add',
                path: '/admin/question-add',
                component: addQuestion,
            },
            {
                name: 'question-manage',
                path: '/admin/question-manage',
                component: manageQontest,
            },
            {
                name: 'user-me',
                path: '/admin/user-me',
                component: meUser,
            },
            {
                name: 'user-search',
                path: '/admin/user-search',
                component: searchUser,
            },
        ]
    },
    // rank
    {
        name: 'rank',
        path: '/rank/:CID',
        component: rank,
    },
    // balloon
    {
        name: 'balloon',
        path: '/balloon',
        component: balloon,
    },
    {
        name: '404',
        path: '*',
        component: NotFound,
    }
]

const router = new VueRouter({
    // mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    },
    // base: process.env.BASE_URL,
    routes: routes
})
router.onError((err) => {
    alert(err);
})

export default router
