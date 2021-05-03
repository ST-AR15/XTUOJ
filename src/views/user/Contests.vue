<template>
    <div class="contests user-container" id="contests">
        <!-- 竞赛列表 -->
        <transition name="cross">
            <div v-show="pageNow == 'contests'" class="contest-list contents-item" id="contest-list">
                <contestlist :buttons="contestButtons" @queryStart="queryStart" />
            </div>
        </transition>
        <transition name="cross">
            <!-- 题目列表 -->
            <div v-show="pageNow == 'questions'" class="contest-questions contents-item" id="contest-questions">
                <a-table
                    :columns="questionsColumns"
                    :data-source="questions"
                    :pagination="false"
                    rowKey="ID"
                >
                    <!-- 表头 -->
                    <template slot="title">
                        <h2 style="font-size: 22px">
                            <a-icon type="arrow-left" @click="pageNow = 'contests'" />
                            返回
                        </h2>
                    </template>
                    <!-- 交互 -->
                    <span slot="button" slot-scope="record">
                        <a-button type="primary" @click="queryQuestion(record.ID)">查看</a-button>
                    </span>
                </a-table>
            </div>
        </transition>
    </div>
</template>
 
<script>
import contestlist from '@/views/components/Contestlist.vue'
export default {
    components: {
        contestlist
    },
    data() {
        return {
            pageNow: "contests", // contests是竞赛列表，questions是问题列表
            CID: 0, // 当前比赛ID
            contestButtons: [
                {
                    text: "开始比赛",
                    method: "queryStart",
                }
            ],
            questionsColumns: [ // 问题列表的表格的表头
                {
                    title: "ID",
                    dataIndex: "ID"
                },
                {
                    title: "题目名称",
                    dataIndex: "tittle"
                },
                {
                    tittle: "操作",
                    scopedSlots: { customRender: 'button' },
                }
            ],
            questions: [
                {
                    ID: 1000,
                    tittle: "打字机",
                },
                {
                    ID: 1001,
                    tittle: "打字机",
                },
            ]
        }
    },
    methods: {
        queryStart(info) {  // 开始比赛
            this.pageNow = "questions";  // 切换页面
            // 加载题目列表
            // TODO 这个接口不可用
            const url = `api/contest/${ info.ID }/problem`;
            this.CID = info.ID; // TODO 下面成了之后就把这个删了
            this.$axios.get(url).then(rep => {
                this.CID = info.ID;
                console.log(rep);
            })
        },
        queryQuestion(ID) { // 打开题目
            this.$router.push(`/problems/${ this.CID }/${ ID }`);
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
        padding-top: 10px;
    }
    .contents-item {
        width: 100%;
    }
</style>