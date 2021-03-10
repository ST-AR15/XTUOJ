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
                    style="user-select:none"
                    v-model="page"
                >
                    <a-menu-item key="home" @click="openPage('/')">
                        <a-icon type="home" />
                        首页
                    </a-menu-item>
                    <a-menu-item key="problems" @click="openPage('problems')">
                        <a-icon type="profile" />
                        问题
                    </a-menu-item>
                    <a-menu-item key="contests" @click="openPage('contests')">
                        <a-icon type="trophy" />
                        竞赛
                    </a-menu-item>
                    <a-menu-item key="status" @click="openPage('status')">
                        <a-icon type="branches" />
                        状态
                    </a-menu-item>
                    <a-menu-item key="ranklist" @click="openPage('ranklist')">
                        <a-icon type="bar-chart" />
                        排名
                    </a-menu-item>
                </a-menu>
                <div class="loginzoom">
                    <a-button class="navButton" v-if="!isLogin" @click="loginVisible = true">登录</a-button>
                    <a-dropdown class="navButton" v-else>
                        <a-button>欢迎</a-button>
                        <a-menu slot="overlay">
                            <a-menu-item @click="goPerson">个人中心</a-menu-item>
                            <a-menu-item @click="logout">退出登录</a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </div>
            </a-layout-header>
            <a-layout-content>
                <div class="container">
                    <div class="page">
                        <transition name="cross">
                            <router-view />
                        </transition>
                    </div>
                    <!-- 当页面需要展示question的时候，footer是不需要展示的，因为整个页面都需要展示题目 -->
                    <!-- <div class="footer" v-if="page != 'question'">
                        XTU Online Judge ©2021 Created by Graduates of network engineering in 2017
                    </div> -->
                </div>
            </a-layout-content>
        </a-layout>
        <login :visible="loginVisible" @ok="login" @close="loginVisible = false" />
    </div>
</template>

<script>
import login from '@/components/login.vue'
export default {
    components: {        
        login,
    },
    data() {
        return {
            from: "",             // 之前的页面
            page: ['home'],       // 当前选择的页面
            isQuestion: false,    // 是否展示问题
            questionID: 1000,     // 需要展示的问题ID
            loginVisible: false,  // 是否显示login
            isLogin: false,       // 登录状态，登录了就变成true
        }
    },
    methods: {
        openPage(page) {  //打开某页
            // 当页面不同时，打开页面
            if(this.$route.fullPath != '/' + page) {
                // this.$router.push(page); // 页面内容切换
                if(page == '/') {
                    this.$router.push({ name: "home" });
                } else {
                    this.$router.push({ name: page });
                }
                
            }
            // menu切换在watch中实现
            // if(page == '/') {
            //     this.page[0] = "home";
            // } else {
            //     this.page[0] = page;
            // }
            // this.$forceUpdate();
        },
        goQuestion(id) {  // 打开某题
            this.questionID = id;
            this.page[0] = 'question';
            this.$forceUpdate();
        },
        goPerson() { // 前往个人中心
            this.$router.replace("/admin");
        },
        login() {
            this.loginVisible = false;
            this.isLogin = true;
            this.$router.go(0);
        },
        logout() {
            let url = "/api/users/logout";
            this.$axios.get(url).then(rep => {
                this.$message.success('登出成功!');
                this.isLogin = false;
                sessionStorage.removeItem('uid');
                sessionStorage.removeItem('token');
                console.log(rep.data.data);
            }).catch(err => {
                this.$message.success('登出成功!');
                this.isLogin = false;
                sessionStorage.removeItem('uid');
                sessionStorage.removeItem('token');
                console.log(err);
            })
            this.$router.go(0);
        }
    },
    mounted() {
        document.body.removeChild(document.getElementById('app-loader'));
        if(sessionStorage.token) {
            // 如果是登录状态
            this.isLogin = true;
        }
        // menu切换
        console.log(this.$route.path.slice(1));
        if(this.$route.path.slice(1)) {
            this.page[0] = this.$route.path.slice(1);
        } else {
            this.page[0] = "home";
        }
        this.$forceUpdate();
    },
    watch: {
        $route(to) {
            // menu切换
            if(to.path.slice(1)) {
                this.page[0] = to.path.slice(1);
            } else {
                this.page[0] = "home";
            }
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
    .user .loginzoom {
        position: absolute;
        right: 0;
        margin-right: 60px;
    }
    .user .loginzoom > button {
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