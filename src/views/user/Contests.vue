<template>
    <div class="contests user-container" id="contests">
        <!-- 竞赛列表 -->
        <transition name="cross">
            <div v-if="pageNow == 'contests'" class="contest-list contents-item" id="contest-list">
                <contestlist :buttons="contestButtons" @queryStart="queryStart" />
            </div>
        </transition>
        <transition name="cross">
            <!-- 题目列表 -->
            <div v-if="pageNow == 'questions'" class="contest-questions contents-item" id="contest-questions">
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
                    <a-tab-pane key="standing" tab="Standing" :forceRender="true">
                        <rank  />
                    </a-tab-pane>
                    <a-tab-pane key="status" tab="Online Status">
                        <status :url="'/api/match/' + $route.params.CID + '/submit'" :isSolution="false" :contestsID="Number($route.params.CID)" />
                    </a-tab-pane>
                    <a-tab-pane key="statistics" tab="Statistics">
                        <a-table
                            :columns="statisticsColumn"
                            :data-source="statistics"
                            :pagination="false"
                            :loading="statisticsLoading"
                            bordered
                        >
                            <span slot="AC" slot-scope="AC">
                                <span v-text="AC == 0? ' ': AC"></span>
                            </span>
                            <span slot="WA" slot-scope="WA">
                                <span v-text="WA == 0? ' ': WA"></span>
                            </span>
                            <span slot="TLE" slot-scope="TLE">
                                <span v-text="TLE == 0? ' ': TLE"></span>
                            </span>
                            <span slot="MLE" slot-scope="MLE">
                                <span v-text="MLE == 0? ' ': MLE"></span>
                            </span>
                            <span slot="RE" slot-scope="RE">
                                <span v-text="RE == 0? ' ': RE"></span>
                            </span>
                            <span slot="SE" slot-scope="SE">
                                <span v-text="SE == 0? ' ': SE"></span>
                            </span>
                            <span slot="CE" slot-scope="CE">
                                <span v-text="CE == 0? ' ': CE"></span>
                            </span>
                            <span slot="RU" slot-scope="RU">
                                <span v-text="RU == 0? ' ': RU"></span>
                            </span>
                            <span slot="OLE" slot-scope="OLE">
                                <span v-text="OLE == 0? ' ': OLE"></span>
                            </span>
                            <span slot="PE" slot-scope="PE">
                                <span v-text="PE == 0? ' ': PE"></span>
                            </span>
                            <span slot="TE" slot-scope="TE">
                                <span v-text="TE == 0? ' ': TE"></span>
                            </span>
                        </a-table>
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
import rank from '@/views/outer/Rank.vue'
export default {
    components: {
        contestlist,
        status,
        rank
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
                    dataIndex: "place"
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
            questions: [],
            questionLoader: false,
            tabkey: 'problems',
            statistics: [],
            statisticsColumn: [
                {
                    title: "Problem",
                    dataIndex: "place"
                },
                {
                    title: "AC",
                    dataIndex: "ACCEPT",
                    scopedSlots: { customRender: 'AC' },
                },
                {
                    title: "WA",
                    dataIndex: "WRONG_ANSWER",
                    scopedSlots: { customRender: 'WA' },
                },
                {
                    title: "TLE",
                    dataIndex: "TIME_LIMIT_EXCEEDED",
                    scopedSlots: { customRender: 'TLE' },
                },
                {
                    title: "MLE",
                    dataIndex: "MEMORY_LIMIT_EXCEEDED",
                    scopedSlots: { customRender: 'MLE' },
                },
                {
                    title: "RE",
                    dataIndex: "RUNTIME_ERROR",
                    scopedSlots: { customRender: 'RE' },
                },
                {
                    title: "SE",
                    dataIndex: "SYSTEM_ERROR",
                    scopedSlots: { customRender: 'SE' },
                },
                {
                    title: "CE",
                    dataIndex: "COMPILE_ERROR",
                    scopedSlots: { customRender: 'CE' },
                },
                {
                    title: "RU",
                    dataIndex: "RUNNED",
                    scopedSlots: { customRender: 'RU' },
                },
                {
                    title: "OLE",
                    dataIndex: "OUTPUT_LIMIT_EXCEEDED",
                    scopedSlots: { customRender: 'OLE' },
                },
                {
                    title: "PE",
                    dataIndex: "PRESENTATION_ERROR",
                    scopedSlots: { customRender: 'PE' },
                },
                {
                    title: "TE",
                    dataIndex: "Test_ERROR",
                    scopedSlots: { customRender: 'TE' },
                },
                
            ],
            statisticsLoading: false,
        }
    },
    methods: {
        handelTabs(tab) {
            if(tab == 'back') {
                this.tabkey = "problems"
                this.handleBack();
            } else if(tab == 'statistics') {
                this.statistics = [];
                this.statisticsLoading = true;
                // 初始化statistics
                for(let i in this.questions) {
                    const item = {
                        ID: this.questions[i].ID,
                        place: this.questions[i].place,
                        ACCEPT: 0,
                        WRONG_ANSWER: 0,
                        TIME_LIMIT_EXCEEDED: 0,
                        MEMORY_LIMIT_EXCEEDED: 0,
                        RUNTIME_ERROR: 0,
                        SYSTEM_ERROR: 0,
                        COMPILE_ERROR: 0,
                        RUNNED: 0,
                        OUTPUT_LIMIT_EXCEEDED: 0,
                        PRESENTATION_ERROR: 0,
                        Test_ERROR: 0,
                    }
                    this.statistics.push(item);
                }
                // 获取比赛的参赛选手
                let namelist = [];
                const namelistUrl = `/api/match/${ this.$route.params.CID }/user`;
                this.$axios.get(namelistUrl).then(rep => {
                    const data = rep.data.data;
                    for(let i in data) {
                        if(data[i].ContestUid) {
                            namelist.push(data[i].ContestUid)
                        } else {
                            namelist.push(data[i].Uid)
                        }
                    }
                    // 获取所有提交信息
                    const url = `/api/match/${ this.$route.params.CID }`;
                    this.$axios.get(url).then(rep => {
                        const data = rep.data.data;
                        // this.list.record = data;
                        for(let i in data) {
                            // 要先筛选出确实是这场比赛的人
                            if(namelist.find(o => o == data[i])) {
                                const _problem =  this.statistics.findIndex(o => o.ID == data[i].c_pid);
                                this.statistics[_problem][this.$resultText[data[i].result]]++;
                            }
                        }
                        this.statisticsLoading = false;
                    })
                })
                
            }
        },
        handleBack() {  // 比赛题目详情回到比赛列表
            this.$router.push(`/contests`);  // 修改route
        },
        queryStart(info) {  // 跳转至比赛题目列表
            // 清空原来的数据
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
            };
            this.questions = [];
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
                        place: (Number(i)+10).toString(36).toUpperCase(),
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
                this.contestDetail.content = "";  //TODO
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