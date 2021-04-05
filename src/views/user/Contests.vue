<template>
    <div class="contests" id="contests">
        <!-- 竞赛列表 -->
        <transition name="cross">
            <div v-show="pageNow == 'contests'" class="contest-list contents-item" id="contest-list">
                <a-table
                    :columns="columns"
                    :data-source="contests"
                    style="width:98%; background-color:#FCFDFE; margin:0 auto"
                    :pagination="pagination"
                >
                    <!-- ID -->
                    <span slot="ID"></span>
                    <span slot="title"></span>
                    <!-- 表头 -->
                    <template slot="title">
                        <h2 style="font-size: 22px; display: inline-block; margin-right: 10px">比赛列表</h2>
                        <a-button type="primary" @click="createContest">创建比赛</a-button>
                    </template>
                    <!-- 操作 -->
                    <span slot="buttons" slot-scope="text, record">
                        <a-space>
                            <a-button type="primary" @click="queryContest(record.ID)">查看</a-button>
                            <a-button type="primary" @click="queryRegister()">注册</a-button>
                            <a-button type="primary" @click="queryStart()">开始比赛</a-button>
                        </a-space>
                    </span>
                </a-table>
            </div>
        </transition>
        <transition name="cross2">
            <!-- 题目列表 -->
            <div v-show="pageNow == 'questions'" class="contest-questions contents-item" id="contest-questions">
                <div class="contents-inner" style="margin:20px auto; width: 1000px; background-color:#FCFDFE">
                    <a-page-header
                        style="width: 1000px"
                        title="返回"
                        @back="pageNow = 'contests'"
                    ></a-page-header>
                    <a-table
                        :columns="questionsColumns"
                        :data-source="questions"
                        style="width:1000px; background-color:#FCFDFE; margin:20px auto"
                        :pagination="pagination"
                    >
                        
                    </a-table>
                </div>
            </div>
        </transition>
    </div>
</template>
 
<script>
export default {
    data() {
        return {
            pageNow: "contests", // contests是竞赛列表，questions是问题列表
            pagination: {       // 页面设置
                pageSize:10,    // 每页题目数量
            },
            columns: [          // 表格的表头
                {
                    title: "ID",
                    dataIndex: "ID",
                },
                {
                    title: "比赛名称",
                    dataIndex: "title",
                },
                {
                    title: "发布人",
                    dataIndex: "source"
                },
                {
                    title: "比赛开始时间"
                },
                {
                    title: "总时长"
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: 'buttons' },
                }
            ],
            contests: [
                {
                    key: "1000",
                    ID: 1000,
                    title: "A+BA",
                    source: "昶浩",
                },
                {
                    key: "1001",
                    ID: 1001,
                    title: "A+BA",
                    source: "昶浩",
                },
            ],
            questionsColumns: [ // 问题列表的表格的表头

            ],
            questions: [
                
            ]
        }
    },
    methods: {
        queryContest(contestsID) { // 打开某个竞赛的问题列表
            console.log(contestsID);
        },
        queryRegister() {  // 注册比赛
            this.$message.info('注册成功！');
        },
        queryStart() {  // 参加某比赛（展示题目列表）
            this.pageNow = "questions"
        },
        createContest() {  // 创建比赛
        // TODO 完成创建比赛

        }
    },
}
</script>

<style>
    * {
        font-size: 15px;
        letter-spacing: 1px;
    }
    .contests {
        margin-top: 10px;
    }
    .ant-table-title {
        padding: 10px 20px;
    }
    .contents-item {
        position: absolute;
        width: 100%;
    }
</style>