// 传入一个数组，数组的每一项是一个对象，每个对象里面一个text和一个method，text是按钮名字，method是方法。记得监听。
<template>
    <div class="questionlist" id="questionlist">
        <a-table
            :columns="columns"
            :data-source="questions"
            style="width:98%; background-color:#FCFDFE; margin:0 auto"
            :pagination="pagination"
            :loading="loading"
            rowKey="ID"
            @change="handleTableChange"
        >
            <!-- ID -->
            <span slot="ID"></span>
            <!-- title -->
            <span slot="QTitle"></span>
            <!-- tips -->
            <span slot="tips" slot-scope="tips">
                <a-tag v-for="item in tips" :key="item">
                    <span>{{ item }}</span>
                </a-tag>
            </span>
            <!-- status -->
            <span slot="status"></span>
            <!-- AC/Total -->
            <span slot="AT" slot-scope="text, record">
                <span v-text="record.accept"></span>
                /
                <span v-text="record.total"></span>
            </span>
            <!-- 表头 -->
            <template slot="title">
                <h2 style="font-size: 22px">
                    问题列表
                    <a-icon class="refreshIcon" type="redo" @click="refresh()" />
                </h2>
            </template>
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
                pageSize:0,     // 每页题目数量
                showQuickJumper: true,  // 快速跳转
                total: 0,
                current: 1,
            },
            columns: [          // 表格的表头
                {
                    title: "ID",
                    dataIndex: "ID",
                },
                {
                    title: "题目名称",
                    dataIndex: "tittle",
                },
                {
                    title: "标签",
                    dataIndex: "tips",
                    scopedSlots: { customRender: 'tips' },
                },
                {
                    title: "来源",
                    dataIndex: "source"
                },
                {
                    title: "状态",
                    dataIndex: "status",
                },
                {
                    title: "AC/Total",
                    scopedSlots: { customRender: 'AT' },
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: 'buttons' },
                }
            ],
            questions: [
                // {
                //     key: "1000",
                //     ID: 1000,
                //     tittle: "A+BA",
                //     tips: ["dp","geometry","math","greedy"],
                //     status: "ATTEMPT",
                //     accept: 100,
                //     total: 200,
                //     source: "昶浩出题"
                // },
                // {
                //     key: "1001",
                //     ID: 1001,
                //     tittle: "A+BW",
                //     tips: ["dp","geometry","math","greedy"],
                //     status: "ACCEPT",
                //     accept: 100,
                //     total: 200,
                // },
            ],
        }
    },
    methods: {
        // TODO 如果开始加载的不是第一页，再去加载第一页，就会控制台报错。原因不明。
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
        refresh(p = 1) { // 刷新表格
            let that = this;
            // 变到第一页。如果传了值就加载那一页。
            that.pagination.current = p;
            // 初始化结果数组
            this.questions = [];
            // 加载第一页的内容，并确认每一页的内容数量和总页数
            this.loadPage(p);
            // console.log(that.pagination.current);
        },
        // 加载某一页的内容
        // 只加载内容，其他的不管！
        // 也就是说，这个方法只是对question变量的操作
        loadPage(page) { // 加载某一页
            let that = this;
            // 如果已经加载过了，就不加载
            if(that.questions[(page-1) * that.pagination.pageSize] ) {
                return ;
            }
            // 开始加载
            that.loading = true;
            // url
            let url = '/api/problem';
            // 开始请求
            this.$axios.get(url, {
                params: {
                    page: page,
                },
            }).then(rep => {
                const data = rep.data.data;
                // 设置页码相关的东西
                that.pagination.pageSize = data.per_page;
                that.pagination.total = data.total;
                // console.log(that.pagination.pageSize);
                // 循环复制给数组questions
                for(let i=(that.pagination.current-1)*that.pagination.pageSize,j=0;j<data.data.length;i++,j++) {
                    that.questions[i] = {};
                    that.questions[i]["ID"] = data.data[j].Pid;
                    that.questions[i]["tittle"] = data.data[j].Tittle;
                    that.questions[i]["tips"] = ['测试','test'];
                    that.questions[i]["source"] = "测试来源";
                    that.questions[i]["status"] = "测试状态";
                    that.questions[i]["accept"] = "100";
                    that.questions[i]["total"] = "200";
                }
                // 结束加载
                that.loading = false;
            }).catch(error => {
                // 如果检测到错误，也停止加载
                console.log(error);
                that.loading = false;
            })
        },
    },
    mounted: function() {
        let that = this;
        // 刷新表格
        that.refresh(Number(this.$route.query.page)? Number(this.$route.query.page): 1);
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