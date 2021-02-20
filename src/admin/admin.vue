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
                            <a-menu-item key="add" @click="openPage('add')">
                                <span>新增题目</span>
                            </a-menu-item>
                            <a-menu-item key="read" @click="openPage('read')">
                                <span>读取题目</span>
                            </a-menu-item>
                        </a-sub-menu>
                        <!-- 选项二：比赛管理 -->
                        <a-sub-menu>
                            <span slot="title">
                                <a-icon type="code" theme="twoTone" />
                                <span>比赛管理</span>
                            </span>
                            <a-menu-item key="addContest" @click="openPage('addContest')">
                                <span>新建比赛</span>
                            </a-menu-item>
                            <a-menu-item key="manageContest" @click="openPage('manageContest')">
                                <span>管理比赛</span>
                            </a-menu-item>
                        </a-sub-menu>
                        <!-- 选项三：个人中心 -->
                        <a-menu-item @click="openPage('person')">
                            <a-icon type="smile" theme="twoTone" />
                            <span>个人中心</span>
                        </a-menu-item>
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
            page: ["welcome"],
        }
    },
    methods: {
        back() {
            this.$router.replace('/#');
        },
        openPage(page) { // 打开某页
            this.$router.push(page);  // 内容切换
            this.page[0] = page;   // 菜单切换
        }
    },
    mounted() {
        // 检测登录状态，没登录就提示登录
        if(!sessionStorage.token) {
            // 如果没有token值，就跳转
            this.$message.info('没有登录！即将跳转至首页');
            this.$router.replace("/#");
        }
    },
    watch: {
        $route(to) {
            // TODO 这个看能不能不写死7
            this.page[0] = to.path.slice(7);  // 菜单切换，删掉前面的/admin
            console.log(this.page);
            console.log(to);
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