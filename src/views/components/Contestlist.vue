// 传入一个数组，数组的每一项是一个对象，每个对象里面一个text和一个method，text是按钮名字，method是方法。记得监听。
// TODO 询问是否需要分页
<template>
    <div class="contestlist" id="contestlist">
        <a-table
            :columns="columns"
            :data-source="contests"
            :pagination="false"
            :loading="loading"
            rowKey="ID"
        >
            <!-- 表头 -->
            <template slot="title">
                <h2 style="font-size: 22px">
                    比赛列表
                    <a-icon class="refreshIcon" type="redo" @click="refresh" />
                    <span v-if="!$store.state.uid" style="margin-left: 30px; color: #9A9A9A">找不到比赛？试试登录</span>
                    <!-- TODO 这个按钮不知道为什么按不了 -->
                    <a-button v-if="$store.state.uid" type="primary" style="margin-left: 30px" @click="queryMyContests">查看我创建的比赛</a-button>
                </h2>
            </template>
            <!-- 时间 -->
            <span slot="time" slot-scope="record">
                {{ record.start }} - {{ record.end }}
            </span>
            <!-- 操作 -->
            <span slot="buttons" slot-scope="text, record">
                <a-space>
                    <template v-for="(item,i) in buttons">
                        <a-button v-if="!item.isDanger" type="primary" :key="i" @click="callbackMethod(item.method,record)">
                            {{ item.text }}
                        </a-button>
                        <a-popconfirm
                            :key="i"
                            v-else
                            title="确认这样操作吗？"
                            ok-text="确认"
                            cancel-text="取消"
                            @confirm="callbackMethod(item.method,record)"
                        >
                            <a-button type="danger">
                                {{ item.text }}
                            </a-button>
                        </a-popconfirm>
                    </template>
                </a-space>
            </span>
        </a-table>
    </div>
</template>

<script>
import { binaryToArray } from '@/utils/tools.js'
export default {
    props: {
        buttons: Array
    },
    data() {
        return {
            loading: false,
            columns: [          // 表格的表头
                {
                    title: "ID",
                    dataIndex: "ID",
                },
                {
                    title: "比赛名称",
                    dataIndex: "tittle",
                },
                {
                    title: "比赛类型",
                    dataIndex: "contestType",
                },
                {
                    title: "比赛形式",
                    dataIndex: "contestant",
                },
                {
                    title: "比赛时间",
                    scopedSlots: { customRender: 'time' },
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: 'buttons' },
                }
            ],
            contests: [
                {
                    ID: 3,
                    tittle: "测试",
                    contestType: "公开",
                    contestant: "个人赛",
                    start: "2021-05-02 16:33:45",
                    end: "2021-05-02 16:33:45",
                },
                {
                    ID: 4,
                    tittle: "测试",
                    contestType: "公开",
                    contestant: "个人赛",
                    start: "2021-05-02 16:33:45",
                    end: "2021-05-02 16:33:45",
                },
            ],
        }
    },
    methods: {
        // 用于调用父接口
        callbackMethod(fatherMethod,param) {
            this.$emit(fatherMethod, param);
        },
        // 刷新表格
        refresh() { // 刷新表格
            // 加载内容
            this.queryContest();
        },
        // 加载竞赛
        // 只加载内容，其他的不管！
        // 也就是说，这个方法只是对contests变量的操作
        queryContest() { // 加载竞赛
            // 初始化结果数组
            this.contests = [];
            // 开始加载
            this.loading = true;
            // url
            const url = '/api/contest';
            // 开始请求
            this.$axios.get(url).then(rep => {
                const data = rep.data.data;
                for(let i in data) {
                    const contest = {
                        ID: data[i].Cid,
                        tittle: data[i].Tittle,
                        contestType: data[i].ContestType == 0? '公开': data[i].ContestType == 1?'注册': '私人',    // 0为公开，1为注册，2为私人
                        contestant: data[i].Contestant == 0? '个人赛': '团队赛',  // 0为个人赛，1为团队赛
                        start: data[i].StartTime,
                        end: data[i].EndTime,
                    }
                    this.contests.push(contest);
                }
                this.loading = false;
            }).catch(error => {
                // 如果检测到错误，也停止加载
                this.$message.error('加载比赛列表时发生意外错误' + error);
                this.loading = false;
            })
        },
        queryMyContests() {
            console.log('cnm');
            // 初始化结果数组
            this.contests = [];
            // 开始加载
            this.loading = true;
            // url
            const url = '/api/contest/my';
            // 开始请求
            this.$axios.get(url).then(rep => {
                const data = rep.data.data;
                for(let i in data) {
                    const contest = {
                        ID: data[i].Cid,
                        tittle: data[i].Tittle,
                        defunct: data[i].Defunct == 'Y'? true: false,
                        contestType: data[i].ContestType == 0? '公开': data[i].ContestType == 1?'注册': '私人',    // 0为公开，1为注册，2为私人
                        contestant: data[i].Contestant == 0? '个人赛': '团队赛',  // 0为个人赛，1为团队赛
                        language: binaryToArray(this.$language, data[i].Language),
                        creator: data[i].Creator,
                        judgeWay: data[i].JudgeWay,
                        start: data[i].StartTime,
                        end: data[i].EndTime,
                        createTime: data[i].created_at,
                        updateTime: data[i].updated_at,
                        inviteCode: data[i].InviteCode,
                        content: data[i].Content,
                    }
                    this.contests.push(contest); 
                }
                this.loading = false;
            }).catch(error => {
                // 如果检测到错误，也停止加载
                this.$message.error('加载比赛列表时发生意外错误' + error);
                this.loading = false;
            })

        }
    },
    mounted: function() {
        // 刷新表格
        this.refresh();
    },
}
</script>

<style>
    .refreshIcon {
        margin-left: 20px;
        cursor: pointer;
        transition: transform .6s;
    }
    .refreshIcon:hover {
        transform: rotate(360deg);
    }
</style>