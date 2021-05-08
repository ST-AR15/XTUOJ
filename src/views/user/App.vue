<template>
    <div class="user" id="user">
        <header class="user-header">
            <div class="logo">XiangTan University</div>
            <div class="loginzoom">
                <!-- TODO -->
                <a-button class="navButton" v-if="!$store.state.token" @click="loginVisible = true">登录</a-button>
                <a-dropdown class="navButton" v-else>
                    <a-button>欢迎</a-button>
                    <a-menu slot="overlay">
                        <a-menu-item @click="queryPerson">个人中心</a-menu-item>
                        <a-menu-item @click="logout">退出登录</a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>
            <a-menu
                class="menu"
                mode="horizontal"
                :style="{ lineHeight: '64px', userSelect: 'none' }"
                v-model="page"
            >
                <a-menu-item key="home" @click="queryPage('/')">
                    <a-icon type="home" />
                    首页
                </a-menu-item>
                <a-menu-item key="problems" @click="queryPage('problems')">
                    <a-icon type="profile" />
                    问题
                </a-menu-item>
                <a-menu-item key="contests" @click="queryPage('contests')">
                    <a-icon type="trophy" />
                    竞赛
                </a-menu-item>
                <a-menu-item key="status" @click="queryPage('status')">
                    <a-icon type="branches" />
                    状态
                </a-menu-item>
                <!-- <a-menu-item key="ranklist" @click="queryPage('ranklist')">
                    <a-icon type="bar-chart" />
                    排名
                </a-menu-item> -->
            </a-menu>
        </header>
        <main class="user-main">
            <transition name="cross">
                <router-view />
            </transition>
        </main>
        <login :visible="loginVisible" @ok="login" @close="loginVisible = false" />
    </div>
</template>

<script>
import login from '@/views/components/Login.vue'
export default {
    components: {        
        login,
    },
    data() {
        return {
            page: ['home'],       // 当前选择的页面
            loginVisible: false,  // 是否显示login
        }
    },
    methods: {
        queryPage(page) {  //打开某页
            // 当页面不同时，打开页面
            if(this.$route.fullPath != '/' + page) {
                // this.$router.push(page); // 页面内容切换
                if(page == '/') {
                    this.$router.push({ name: "home" });
                } else {
                    this.$router.push({ name: page });
                }
                
            }
        },
        queryPerson() { // 前往个人中心
            this.$router.replace("/admin");
        },
        login() {
            this.loginVisible = false;
        },
        logout() {
            let url = "/api/users/logout";
            this.$axios.get(url).then(rep => {
                this.$message.success('登出成功!');
                this.$store.commit('setUid', null);
                this.$store.commit('setToken', null);
                console.log(rep.data.data);
            }).catch(err => {
                this.$message.success('登出成功!');
                this.$store.commit('setUid', null);
                this.$store.commit('setToken', null);
                console.log(err);
            })
        }
    },
    mounted() {
        // 如果没有登录，自动登录
        if(!this.$store.state.token && localStorage.getItem('account') && localStorage.getItem('password')) {
            const url = "/api/users/login";
            let info = {
                StudentID: localStorage.getItem('account'),
                password: localStorage.getItem('password'),
            };
            this.$axios.post(url, info).then(rep => {
                const data = rep.data.data;
                this.$store.commit('setUid', data.Uid);
                this.$store.commit('setToken', data.token);
                this.$message.success(`自动登录成功!欢迎您,${ this.$store.state.uid }`);
            }).catch(e => {
                console.log(e);
                this.$message.info('自动登录失败');
            })    
        }
        try {
            document.body.removeChild(document.getElementById('app-loader'));
        } catch(e) { return e }
        // menu切换
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

<style>
    .user {
        min-width: 1000px;
        min-height: 100vh;
        background-color: #F2F4F9;
        overflow: hidden;
    }
    .user-header {
        width: 100%;
        height: 66px;
        position: fixed;
        z-index: 499;
    }
    .user-main {
        /* height: calc(100vh - 66px); */
        margin-top: 66px;
    }
    .user-main > div {
        width: 100%;
        box-sizing: border-box;
        position: relative;
    }
    .logo {
        float: left;
        height: 31px;
        line-height: 31px;
        margin: 16px 28px 16px 3%;
    }
    .loginzoom {
        float: right;
        height: 31px;
        line-height: 31px;
        margin: 16px 3% 16px 28px;
    }
    .loginzoom > button {
        color: rgb(81, 141, 225);
        font-weight: 700;
        padding: 0 20px;
    }
    .ant-layout-content > div {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        position: absolute;
    }
</style>