<template>
    <div class="user" id="user">
        <a-layout>
            <a-layout-header>
                <div class="logo">
                    <p>XiangTan University</p>
                </div>
                <a-menu
                    class="menu"
                    mode="horizontal"
                    v-model="page"
                    style="user-select:none"
                >
                    <a-menu-item key="home" @click="page[0] = 'home'">
                        <a-icon type="home" />
                        首页
                    </a-menu-item>
                    <a-menu-item key="problems" @click="page[0] = 'problems'">
                        <a-icon type="profile" />
                        问题
                    </a-menu-item>
                    <a-menu-item key="contests" @click="page[0] = 'contests'">
                        <a-icon type="trophy" />
                        竞赛
                    </a-menu-item>
                    <a-menu-item key="status" @click="page[0] = 'status'">
                        <a-icon type="branches" />
                        状态
                    </a-menu-item>
                    <a-menu-item key="ranklist" @click="page[0] = 'ranklist'">
                        <a-icon type="bar-chart" />
                        排名
                    </a-menu-item>
                </a-menu>
                <!-- TODO 两个按钮只显示一个，根据登录状态决定 -->
                <div class="loginZoom">
                    <a-button class="navButton" @click="loginVisible = true">登录</a-button>
                    <a-button class="navButton">通知</a-button>
                </div>
            </a-layout-header>
            <a-layout-content>
                <div class="container">
                    <div class="page">
                        <transition name="cross">
                            <home @goQuestion="goQuestion" v-show="page == 'home'"/>
                        </transition>
                        <transition name="cross">
                            <problems v-show="page == 'problems'" />
                        </transition>
                        <transition name="cross">
                            <contests v-show="page == 'contests'"/>
                        </transition>
                        <transition name="cross">
                            <status v-show="page == 'status'"/>
                        </transition>
                        <transition name="cross">
                            <ranklist v-show="page == 'ranklist'"/>
                        </transition>
                        <transition name="cross">
                            <question v-show="page == 'question'" :ID="questionID" @back="back" />
                        </transition>
                    </div>
                    <!-- 当页面需要展示question的时候，footer是不需要展示的，因为整个页面都需要展示题目 -->
                    <!-- <div class="footer" v-if="page != 'question'">
                        XTU Online Judge ©2021 Created by Graduates of network engineering in 2017
                    </div> -->
                </div>
            </a-layout-content>
        </a-layout>
        <login :visible="loginVisible" @close="loginVisible = false" />
    </div>
</template>

<script>
import home from './home.vue'
import problems from './problems.vue'
import contests from './contests.vue'
import status from './status.vue'
import ranklist from './ranklist.vue'
import question from '@/components/question.vue'
import login from '@/components/login.vue'
export default {
    components: {
        home,
        problems,
        contests,
        status,
        ranklist,
        question,
        login,
    },
    data() {
        return {
            page: ['home'],       // 当前选择的页面
            isQuestion: false,    // 是否展示问题
            questionID: 1000,     // 需要展示的问题ID
            loginVisible: false,  // 是否显示login
        }
    },
    methods: {
        openPage(page) {  //打开某页
            this.page[0] = page;
            this.$forceUpdate();
        },
        goQuestion(id) {  // 打开某题
            this.questionID = id;
            this.page[0] = 'question';
            this.$forceUpdate();
        },
        back() {  // 回到之前的页面
            console.log(this.page);
            this.page[0] = 'home';
            this.$forceUpdate();
        }
    }
}
</script>

<style scoped>
    /* 整个页面 */
    .user {
        min-width: 1000px;
        height: 100vh;
        background-color: #F2F4F9;
        overflow: hidden;
        position: relative;
    }
    /* header */
    .user .ant-layout-header {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E8E8E8;
        /* position: relative; */
        background-color: rgb(252, 253, 254);
        color: rgb(90, 90, 90);
        /* overflow: hidden; */
        height: 64px; /* 一开始不打算写死高度的- -为了后面的内容还是写一下吧，毕竟这样才能让它保持在最顶上 */
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }
    .user .ant-layout-header > .logo {
        min-width: 180px;
        height: 100%;
        letter-spacing: 1px;
		font-size: 18px;
		line-height: 66px;
        margin-right: 20px;
    }
    .user .ant-layout-header > .menu {
        height: 64px;
        line-height: 64px;
    }
    .user .ant-layout-header > .menu li {
        height: 64px;
        margin: 0 5px;
    }
    .user .loginZoom {
        position: absolute;
        right: 0;
        margin-right: 60px;
    }
    .user .loginZoom > button {
        color: rgb(81, 141, 225);
        font-weight: 700;
        padding: 0 20px;
    }
    /* content */
    .user .ant-layout-content {
        position: absolute;
        top: 64px;  /* 因为设定了header的高度是64px */
        left: 0;
        overflow: hidden;
        width: 100%;
        height: calc(100vh - 64px);
    }
    .user .container {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        position: absolute;
    }
    .user .page {
        position: relative;
        width: 100%;
        min-height: calc(100vh - 64px - 64px);
        /* padding: 20px 0; */
    }
    .user .page > div {
        position: absolute;
        width: 100%;
    }
    .user .page > .question {
        height: calc(100vh - 64px); /* question页面要占据整个展示区域 */
    }
    /* footer，为了让滚动逻辑正常，这个footer是写在content里面的 */
    .user .footer {
        width: 100%;
        height: 64px;
        line-height: 64px;
        position: relative;
        text-align: center;
        padding: 10px 0;
    }
</style>