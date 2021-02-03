<template>
    <div class="admin" id="admin"> 
        <a-layout>
            <a-layout-header>
                <h1>湘潭大学OJ系统 - 管理员端</h1>
            </a-layout-header>
            <a-layout>
                <a-layout-sider>
                    <a-menu
                        mode="inline"
                    >
                        <!-- 选项1 ： 题目管理 -->
                        <a-sub-menu>
                            <span slot="title">
                                <a-icon type="code" theme="twoTone" />
                                <span>题目管理</span>
                            </span>
                            <a-menu-item key="add" @click="page = 'add'">
                                <span>新增题目</span>
                            </a-menu-item>
                            <a-menu-item key="read" @click="page = 'read'">
                                <span>读取题目</span>
                            </a-menu-item>
                        </a-sub-menu>
                        <!-- 选项二：比赛管理 -->
                        <a-sub-menu>
                            <span slot="title">
                                <a-icon type="code" theme="twoTone" />
                                <span>比赛管理</span>
                            </span>
                            <a-menu-item @click="page = 'addContest'">
                                <span>新建比赛</span>
                            </a-menu-item>
                            <a-menu-item @click="page = 'manageContest'">
                                <span>管理比赛</span>
                            </a-menu-item>
                        </a-sub-menu>
                        <!-- 选项三：个人中心 -->
                        <a-menu-item @click="page = 'person'">
                            <a-icon type="smile" theme="twoTone" />
                            <span>个人中心</span>
                        </a-menu-item>
                    </a-menu>
                </a-layout-sider>
                <a-layout-content>
                    <welcome v-show="page == 'welcome'"/>
                    <add v-show="page == 'add'"/>
                    <read v-show="page == 'read'"/>
                    <addContest v-show="page == 'addContest'"/>
                    <manageContest v-show="page == 'manageContest'"/>
                    <person v-show="page == 'person'"/>
                </a-layout-content>
            </a-layout>
            <a-layout-footer>
                <p>Made By XTU</p>
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script>
import welcome from './welcome.vue'
import add from './add.vue'
import read from './read.vue'
import addContest from './addContest.vue'
import manageContest from './manageContest.vue'
import person from './person.vue'
export default {
    components: {
        welcome,
        add,
        read,
        addContest,
        manageContest,
        person,
    },
    data() {
        return {
            // 当前选择的页面
            page: "welcome",
        }
    },
    methods: {

    },
    mounted() {
        // 检测登录状态，没登录就提示登录
        if(!sessionStorage.token) {
            // 如果没有token值，就跳转
            this.$message.info('没有登录！即将跳转至首页');
            this.$router.replace("/#");
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