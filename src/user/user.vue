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
                <!-- todo 两个按钮只显示一个，根据登录状态决定 -->
                <a-button class="navButton">登录</a-button>
                <a-button class="navButton">通知</a-button>
            </a-layout-header>
            <a-layout-content style="position: relative">
                <home v-show="page == 'home'"/>
                <problems v-show="page == 'problems'" />
                <contests v-show="page == 'contests'"/>
                <status v-show="page == 'status'"/>
                <ranklist v-show="page == 'ranklist'"/>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>
import home from './home.vue'
import problems from './problems.vue'
import contests from './contests.vue'
import status from './status.vue'
import ranklist from './ranklist.vue'
export default {
    components: {
        home,
        problems,
        contests,
        status,
        ranklist,
    },
    data() {
        return {
            page: ['home'],       // 当前选择的页面
        }
    },
    methods: {
        openPage(page) {  //打开某页
            this.page[0] = page;
            this.$forceUpdate();
        }
    }
}
</script>

<style>
    .user {
        min-width: 1080px;
        height: 100vh;
        background-color: #F2F4F9;
        overflow: hidden;
    }
    .user .ant-layout-header {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E8E8E8;
        position: relative;
        background-color: rgb(252, 253, 254);
        color: rgb(90, 90, 90);
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
    .user .ant-layout-header > .navButton {
        position: absolute;
        right: 0;
        color: rgb(81, 141, 225);
        font-weight: 700;
        margin-right: 60px;
        padding: 0 20px;
    }
</style>