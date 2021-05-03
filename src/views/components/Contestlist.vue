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
                    比赛列表
                    <a-icon class="refreshIcon" type="redo" @click="refresh()" />
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
                        <a-button v-else type="danger" :key="i" @click="callbackMethod(item.method,record)">
                            {{ item.text }}
                        </a-button>
                    </template>
                </a-space>
            </span>
        </a-table>
    </div>
</template>

<script>
export default {
    props: {
        buttons: Array
    },
    data() {
        return {
            loading: false,
            pagination: {       // 页面设置 
                pageSize:10,     // 每页题目数量
                showQuickJumper: true,  // 快速跳转
                current: 1,
            },
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
        // a-table监测页面切换前调用
        // 只用用a-table自己的方法切换页面才调用（按下面的数字或者输入跳转）
        handleTableChange(pagination) {
            // 修改query
            this.$router.push({ query: {page: pagination.current }})
            // 修改query后，剩下的都交给query去做
        },
        // 用于调用父接口
        callbackMethod(fatherMethod,param) {
            this.$emit(fatherMethod, param);
        },
        // 刷新表格
        refresh() { // 刷新表格
            let that = this;
            // 变到第一页。如果传了值就加载那一页。
            that.pagination.current = 1;
            // 初始化结果数组
            this.contests = [];
            // 加载第一页的内容，并确认每一页的内容数量和总页数
            this.loadContests();
            // console.log(that.pagination.current);
        },
        // 加载竞赛
        // 只加载内容，其他的不管！
        // 也就是说，这个方法只是对contests变量的操作
        loadContests() { // 加载竞赛
            // 开始加载
            this.loading = true;
            // url
            const url = '/api/contest';
            // 开始请求
            // TODO 这个API无效
            this.$axios.get(url).then(rep => {
                console.log(rep);      
            }).catch(error => {
                // 如果检测到错误，也停止加载
                console.log(error);
                this.loading = false;
            })
        }
    },
    mounted: function() {
        // 刷新表格
        // TODO 还原这个刷新表格
        // this.refresh();
    },
    watch: {
        // query变化的时候调用，通过query切换表页码，与handleTableChange互补
        $route(to) {
            // 页码切换
            this.pagination.current = Number(to.query.page);
            // 加载内容
            this.loadPage(Number(to.query.page));
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