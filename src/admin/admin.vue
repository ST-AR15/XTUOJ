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
                        <a-sub-menu>
                            <span slot="title">
                                <a-icon type="code" theme="twoTone" />
                                <span>比赛管理</span>
                            </span>
                            <a-menu-item @click="page = 'welcome'">
                                <span>新建比赛</span>
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </a-layout-sider>
                <a-layout-content>
                    <welcome v-show="page == 'welcome'"/>
                    <add v-show="page == 'add'"/>
                    <read v-show="page == 'read'"/>
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
export default {
    components: {
        welcome,
        add,
        read,
    },
    data() {
        return {
            // 当前选择的页面
            page: "welcome",
        }
    },
    methods: {

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