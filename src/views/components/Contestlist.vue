// 传入一个数组，数组的每一项是一个对象，每个对象里面一个text和一个method，text是按钮名字，method是方法。记得监听。
<template>
    <div class="contestlist" id="contestlist">
        <a-table
            :columns="columns"
            :data-source="contests"
            :pagination="pagination"
            :loading="loading"
            rowKey="ID"
            @change="handleTableChange"
        >
            <!-- 表头 -->
            <template slot="title">
                <h2 style="font-size: 22px">
                    {{ $route.query.type == 'my'? '我创建的比赛': '比赛列表' }}
                    <a-icon class="refreshIcon" type="redo" @click="refresh" />
                    <span v-if="!$store.state.uid" style="margin-left: 30px; color: #9A9A9A">找不到比赛？试试<a-button style="padding: 0" @click="loginVisible = true" type="link">登录</a-button></span>
                    <a-button v-if="$store.state.uid" type="primary" style="margin-left: 30px" @click="queryCreate">创建比赛</a-button>
                    <a-button v-if="$store.state.uid" type="primary" style="margin-left: 20px" @click="handleContests" v-text="$route.query.type == 'my'? '查看全部比赛': '查看我创建的比赛'"></a-button>
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
        <a-modal
            :width="1000"
            :visible="createModal.visible"
            title="创建比赛"
            :footer="null"
            @cancel="createModal.visible = false"
        >
            <contestform okText="创建"  @querySubmitForm="querySubmitForm" />
        </a-modal>
        <login :visible="loginVisible" @ok="queryLogin" @close="loginVisible = false" />
    </div>
</template>

<script>
import contestform from '@/views/components/ContestForm.vue'
import login from '@/views/components/Login.vue'
export default {
    components: {
        contestform,
        login
    },
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
            pagination: {       // 页面设置
                pageSize:0,     // 每页题目数量
                showQuickJumper: true,  // 快速跳转
                total: 0,
                current: 1,
            },
            contests: [
                // {
                //     ID: 3,
                //     tittle: "测试",
                //     contestType: "公开",
                //     contestant: "个人赛",
                //     start: "2021-05-02 16:33:45",
                //     end: "2021-05-02 16:33:45",
                // },
                // {
                //     ID: 4,
                //     tittle: "测试",
                //     contestType: "公开",
                //     contestant: "个人赛",
                //     start: "2021-05-02 16:33:45",
                //     end: "2021-05-02 16:33:45",
                // },
            ],
            createModal: {
                visible: false,
            },
            loginVisible: false,
        }
    },
    methods: {
        /**
         * 修改路由 ----------------------------------                                  
         *                                           |->  切换表格页 + 获取数据
         * 切换表格页页面 -> 监听修改 ->  修改路由 -----
         */

        // 用于调用父接口
        callbackMethod(fatherMethod,param) {
            this.$emit(fatherMethod, param);
        },
        handleTableChange(pagination) {
            // 修改query
            if(this.$route.query.type == 'my') {
                this.$router.push({
                    query: {
                        type: 'my',
                        page: pagination.current
                    }
                });
            } else {
                this.$router.push({
                    query: {
                        page: pagination.current
                    }
                });
            }
        },
        handleContests() {  // 切换比赛
            // 直接切换页面的name,然后交给路由监听解决
            if(this.$route.query.type == 'my') {
                this.$router.push({query: {  }});
            } else {
                this.$router.push({
                    query: {
                        type : 'my'
                    }
                });
            }
            
        },
        // 刷新表格
        refresh() { // 刷新表格
            // 清空内容
            this.contests = [];
            // 加载内容
            this.queryContest();
        },
        // 加载竞赛
        // 只加载内容，其他的不管！
        // 也就是说，这个方法只是对contests变量的操作
        queryContest() { // 加载竞赛
            const page = this.$route.query.page? this.$route.query.page: 1;  // 页码,query有内容就是数字,没有就是1
            // 如果这一页加载过了,就不加载
            // 每页的大小存在和这一页的第一项存在就说明这一页加载过了
            if(this.pageSize != 0 && this.contests[(page-1) * this.pagination.pageSize]) {
                return;
            }
            // 开始加载
            this.loading = true;
            // url
            let url = '';
            if(this.$route.query.type == 'my') {
                url = '/api/contest/my';
                
            } else {
                url = '/api/contest';
            }
            // 开始请求
            this.$axios.get(url, {
                params: {
                    page: page
                },
            }).then(rep => {
                // 先设置页面信息
                this.pagination.pageSize = rep.data.data.per_page;  // 每页数量
                this.pagination.total = rep.data.data.total;  // 总数量
                // 然后设置数据
                const data = rep.data.data.data;
                // 第一个数的坐标是页码-1乘以pageSize
                for(let i = (page - 1) * this.pagination.pageSize, j = 0; j < data.length ;i++,j++) {
                    const contest = {
                        ID: data[j].Cid,
                        tittle: data[j].Tittle,
                        contestType: data[j].ContestType == 0? '公开': data[i].ContestType == 1?'注册': '私人',    // 0为公开，1为注册，2为私人
                        contestant: data[j].Contestant == 0? '个人赛': '团队赛',  // 0为个人赛，1为团队赛
                        start: data[j].StartTime,
                        end: data[j].EndTime,
                    }
                    this.$set(this.contests, i, contest);
                }
                this.loading = false;
            }).catch(error => {
                // 如果检测到错误，也停止加载
                // this.$message.error('加载比赛列表时发生意外错误' + error);
                this.$message.error('加载失败');
                this.loading = false;
                return error;
            })
        },
        queryCreate() { // 创建比赛modal
            this.createModal.visible = true;
        },
        querySubmitForm(info) { // 创建比赛请求
            const url = "/api/contest"
            let language = 0;
            for(let i in info.language) {
                language += this.$language.num[this.$language.name.findIndex(o => o == info.language[i])];
            }
            const params = {
                Tittle: info.name,
                Defunct: info.defunct,
                ContestType: info.contestType,
                Contestant: info.contestant,
                Language: language,
                JudgeWay: info.judge,
                Contest: info.contest,
                StartTime: info.time[0].format('YYYY-MM-DD HH:mm'),
                EndTime: info.time[1].format('YYYY-MM-DD HH:mm'),
            }
            this.$axios.post(url, params).then(rep => {
                if(parseInt(rep.status/100) == 2) {
                    this.$message.success('创建成功!');
                    this.createModal.visible = false;
                    this.refresh();
                }
            })
        },
        queryLogin() {  // 登录
            this.loginVisible = false;
        }
    },
    mounted: function() {
        let page = this.$route.query.page? this.$route.query.page: 1;
        // 页码切换
        this.pagination.current = Number(page);
        // 加载内容
        this.queryContest();
    },
    watch: {
        // query变化的时候调用，通过query切换表页码，与handleTableChange互补
        $route(to, from) {
            if(from.query.type != to.query.type) {
                // 如果发生了type的切换,就清空表格
                this.contests = [];
            }
            const page = to.query.page? to.query.page: 1;
            // 页码切换
            this.pagination.current = Number(page);
            // 加载内容
            this.queryContest();
        }
    }
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