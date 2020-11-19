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
                >
                    <a-menu-item @click="page = 'home'">
                        <a-icon type="home" />
                        Home
                    </a-menu-item>
                    <a-menu-item @click="page = 'problems'">
                        Problems
                    </a-menu-item>
                    <a-menu-item @click="page = 'contests'">
                        Contests
                    </a-menu-item>
                    <a-menu-item @click="page = 'statuss'">
                        Status
                    </a-menu-item>
                    <a-menu-item @click="page = 'ranklist'">
                        Ranklist
                    </a-menu-item>
                </a-menu>
                <a-button class="login">Login{{page}}</a-button>
            </a-layout-header>
            <a-layout-content>
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
        ranklist
    },
    data() {
        return {
            page: 'home',       // 当前选择的页面
        }
    }
}
</script>

<style>
    .user {
        min-width: 1080px;
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
    .user .ant-layout-header > .login {
        position: absolute;
        right: 0;
        color: rgb(81, 141, 225);
        font-weight: 700;
        margin-right: 60px;
    }
</style>