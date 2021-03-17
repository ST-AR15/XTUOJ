<template>
    <div class="admin" id="admin"> 
        <a-layout>
            <a-layout-header>
                <h1>个人中心</h1>
                <a-button type="primary" style="position: absolute; top:15px; right:40px" @click="back">回到首页</a-button>
            </a-layout-header>
            <a-layout>
                <a-layout-sider>
                    <a-menu
                        mode="inline"
                        v-model="page"
                    >
                        <!-- 选项1 ： 题目管理 -->
                        <a-sub-menu>
                            <span slot="title">
                                <a-icon type="code" theme="twoTone" />
                                <span>题目管理</span>
                            </span>
                            <a-menu-item key="question-add" @click="handlePage('question','add')">
                                <a-icon type="plus-square" />
                                <span>新增题目</span>
                            </a-menu-item>
                            <a-menu-item key="question-manage" @click="handlePage('question', 'manage')">
                                <a-icon type="edit" />
                                <span>管理题目</span>
                            </a-menu-item>
                        </a-sub-menu>
                        <!-- 选项二：比赛管理 -->
                        <a-sub-menu>
                            <span slot="title">
                                <a-icon type="trophy" theme="twoTone" />
                                <span>比赛管理</span>
                            </span>
                            <a-menu-item key="contest-add" @click="handlePage('contest', 'add')">
                                <a-icon type="plus-circle" />
                                <span>新建比赛</span>
                            </a-menu-item>
                            <a-menu-item key="contest-manage" @click="handlePage('contest', 'manage')">
                                <a-icon type="database" />
                                <span>管理比赛</span>
                            </a-menu-item>
                        </a-sub-menu>
                        <!-- 选项三：用户管理 -->
                        <a-sub-menu>
                            <span slot="title">
                                <a-icon type="smile" theme="twoTone" />
                                <span>用户管理</span>
                            </span>
                            <a-menu-item key="user-search" @click="handlePage('user', 'search')">
                                <a-icon type="file-search" />
                                <span>搜索用户</span>
                            </a-menu-item>
                            <a-menu-item key="user-me" @click="handlePage('user', 'me')">
                                <a-icon type="user" />
                                <span>个人中心</span>
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </a-layout-sider>
                <a-layout-content>
                    <router-view />
                </a-layout-content>
            </a-layout>
            <a-layout-footer>
                <p>Made By XTU</p>
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 当前选择的页面
            page: ["question-add"],
        }
    },
    methods: {
        back() {
            this.$router.replace('/#');
        },
        handlePage(type, page) { // 打开某页
            // this.$router.push(page);  // 内容切换
            // this.page[0] = page;   // 菜单切换
            let name = "";
            if(page) {
                name = type + '-' + page;
            } else {
                name = type + '-welcome';
            }
            this.$router.push({ name: name }); // router
            // this.page[0] = name; // 菜单切换在watch里
        }
    },
    mounted() {
        // 检测登录状态，没登录就提示登录
        if(!this.$store.state.token) {
            // 如果没有token值，就跳转
            this.$message.info('没有登录！即将跳转至首页');
            this.$router.replace("/#");
        }
        // 菜单
        this.page[0] = this.$route.name;
        this.$forceUpdate();
    },
    watch: {
        $route(to) {
            this.page[0] = to.name;  // 菜单切换
            this.$forceUpdate();
        }
    }
}
</script>

<style>
    .admin h1 {
        text-align: center;
    }
    .admin footer {
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-top: 1px solid #AAAAAA;
    }
</style>