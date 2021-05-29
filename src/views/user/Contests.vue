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
                <a-tabs v-model="tabkey" default-active-key="problems" @change="handelTabs">
                    <a-tab-pane key="back">
                        <span slot="tab">
                            <a-icon type="left" style="color: red" />
                            <span style="color: red">返回</span>
                        </span>
                    </a-tab-pane>
                    <a-tab-pane key="problems" tab="Problems">
                        <a-table
                            :columns="questionsColumns"
                            :data-source="questions"
                            :pagination="false"
                            rowKey="ID"
                            :loading="questionLoader"
                            :showHeader="false"
                        >
                            <span slot="title">
                                <a-spin :spinning="contestDetail.loading">
                                    <h2 style="font-size: 1.8rem">{{ contestDetail.title }}</h2>
                                    <h3 style="font-size: 0.8rem">{{ contestDetail.content }}</h3>
                                </a-spin>
                            </span>
                            <!-- 交互 -->
                            <span slot="button" slot-scope="record">
                                <a-button type="primary" @click="queryQuestion(record.ID)">查看</a-button>
                            </span>
                        </a-table>
                    </a-tab-pane>
                    <a-tab-pane key="standing" tab="Standing" force-render>
                        standing
                    </a-tab-pane>
                    <a-tab-pane key="status" tab="Online Status">
                        <status v-if="statusVisible" :url="'/api/match/' + $route.params.CID + '/submit'" :isSolution="false" />
                    </a-tab-pane>
                    <a-tab-pane key="statistics" tab="Statistics">
                        statistics
                    </a-tab-pane>
                    <a-tab-pane key="detail" tab="detail">
                        <a-spin :spinning="contestDetail.loading">    
                            <div style="padding-left: 15px">
                                <p>比赛名： {{ contestDetail.title }}</p>
                                <p>比赛ID： {{ contestDetail.ID }}</p>
                                <p>比赛介绍： {{ contestDetail.content }}</p>
                                <p>比赛类型： {{ contestDetail.contestType == 0? '公开': contestDetail.contestType == 1? '注册': '私人' }} - {{ contestDetail.contestant == 0? '个人赛': '团队赛' }}</p>
                                <p>判题方式： {{ contestDetail.judge }}</p>
                                <p>可用编译器： {{ contestDetail.language }}</p>
                                <p>比赛时间： {{ contestDetail.start }} ~ {{ contestDetail.end }}</p>
                            </div>
                        </a-spin>
                    </a-tab-pane>
                </a-tabs>
                
            </div>
        </transition>
    </div>
</template>
 
<script>
import { binaryToArray } from '@/utils/tools.js'
import contestlist from '@/views/components/Contestlist.vue'
import status from '@/views/components/Status.vue'
export default {
    components: {
        contestlist,
        status
    },
    data() {
        return {
            pageNow: "contests", // contests是竞赛列表，questions是问题列表
            contestButtons: [
                {
                    text: "开始比赛",
                    method: "queryStart",
                }
            ],
            contestDetail: {
                title: "",
                ID: 0,
                content: "",
                contestType: 0,
                contestant: 0,
                judge: "",
                language: [],
                start: "",
                end: "",
                loading: false,
            },
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
            ],
            questionLoader: false,
            tabkey: 'problems',
            statusVisible: false,
        }
    },
    methods: {
        handelTabs(tab) {
            if(tab == 'back') {
                this.tabkey = "problems"
                this.handleBack();
            }
            if(tab == 'status') {
                this.statusVisible = true;
            } else {
                this.statusVisible = false;
            }
        },
        handleBack() {  // 比赛题目详情回到比赛列表
            this.$router.push(`/contests`);  // 修改route
        },
        queryStart(info) {  // 跳转至比赛题目列表
            this.$router.push(`/contests/${ info.ID }`);  // 修改route
        },
        queryQuestionList() {  // 获取比赛题目
            this.questions = [];  // 清空列表
            this.questionLoader = true;// 开始加载
            // 加载题目列表
            const url = `api/contest/${ this.$route.params.CID }/problem`;
            this.$axios.get(url).then(rep => {
                const data = rep.data.data;
                for(let i in data) {
                    const question = {
                        ID: data[i].c_pid,
                        tittle: data[i].Tittle,
                    }
                    this.questions.push(question);
                }
                // 结束加载
                this.questionLoader = false;
            }).catch(err => {
                // 发生错误也停止加载
                this.questionLoader = false;
                return err;
            })
        },
        queryInfo() {
            // 初始化
            this.contestDetail = {
                title: "",
                ID: 0,
                content: "",
                contestType: 0,
                contestant: 0,
                judge: "",
                language: [],
                start: "",
                end: "",
                loading: false,
            },
            this.contestDetail.loading = true;
            const url =  `/api/match/${ this.$route.params.CID }/info`
            this.$axios.get(url).then(rep => {
                const data = rep.data.data[0];
                this.contestDetail.title = data.Tittle;
                this.contestDetail.ID = data.Cid;
                this.contestDetail.content = "这个比赛的介绍";  //TODO
                this.contestDetail.contestType = data.ContestType;
                this.contestDetail.contestant = data.Contestant;
                this.contestDetail.judge = data.JudgeWay;
                this.contestDetail.language = binaryToArray(this.$language.name, Number(data.Language.toString(2)));
                this.contestDetail.start = data.StartTime;
                this.contestDetail.end = data.EndTime;
                this.contestDetail.loading = false;
            })
        },
        queryQuestion(ID) { // 打开题目
            this.$router.push(`/problems/${ this.$route.params.CID }/${ ID }`);
        },
        createContest() {  // 创建比赛
            // TODO 完成创建比赛

        }
    },
    mounted() {
        if(this.$route.name == "contests_detail") {  // 如果route上是比赛页
            this.pageNow = "questions";
            // 加载题目
            this.queryQuestionList({ ID: this.$route.params.CID });
            // 获取比赛信息
           this.queryInfo();
        } else {
            this.pageNow = "contests";
        }
    },
    watch: {
        $route(to, from) {
            if(to.name == "contests_detail") {  // 如果route上是比赛页
                this.pageNow = "questions";
                // 加载题目
                this.queryQuestionList({ ID: this.$route.params.CID });
                // 如果是初次进来，就获取比赛信息
                if(to.name != from.name) {
                    this.queryInfo();
                }
            } else {
                this.pageNow = "contests";
            }
        },
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
        background-color: #FFFFFF;
    }
</style>