// 传入一个数组，数组的每一项是一个对象，每个对象里面一个text和一个method，text是按钮名字，method是方法。记得监听。
<template>
    <div class="questionlist" id="questionlist">
        <a-table
            :columns="columns"
            :data-source="questions"
            style="width:98%; background-color:#FCFDFE; margin:0 auto"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
        >
            <!-- ID -->
            <span slot="ID"></span>
            <!-- title -->
            <span slot="title"></span>
            <!-- tips -->
            <span slot="tips"></span>
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
                        <a-button type="primary" v-bind:key="i" @click="callbackMethod(item.method,record)">
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
            searchText: "",
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
                    dataIndex: "title",
                },
                {
                    title: "标签",
                    dataIndex: "tips",
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
                //     title: "A+BA",
                //     tips: ["dp","geometry","math","greedy"],
                //     status: "ATTEMPT",
                //     accept: 100,
                //     total: 200,
                //     source: "昶浩出题"
                // },
                // {
                //     key: "1001",
                //     ID: 1001,
                //     title: "A+BW",
                //     tips: ["dp","geometry","math","greedy"],
                //     status: "ACCEPT",
                //     accept: 100,
                //     total: 200,
                // },
            ],
        }
    },
    methods: {
        handleTableChange(pagination) {
            // 修改页码
            this.pagination.current = pagination.current;
            // 变量
            // let page = {
            //     page: pagination.current,
            // };
            // 只有未加载过的页面才需要加载
            if(this.questions[(pagination.current-1)*this.pagination.pageSize] == undefined) {
                this.loadPage(pagination.current)
            }
            
        },
        callbackMethod(fatherMethod,param) {
            this.$emit(fatherMethod, param);
        },
        refresh() { // 刷新表格
            let that = this;
            // 变到第一页
            that.pagination.current = 1;
            // 初始化结果数组
            this.questions = [];
            // 加载第一页的内容，并确认每一页的内容数量和总页数
            this.loadPage(1);
            // console.log(that.pagination.current);
        },
        loadPage(page) { // 加载某一页
            let that = this;
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
                that.pagination.pageSize = that.pagination.pageSize == 0? data.data.length:that.pagination.pageSize;
                that.pagination.total = data.total;
                // console.log(that.pagination.pageSize);
                // 循环复制给数组questions
                for(let i=(that.pagination.current-1)*that.pagination.pageSize,j=0;j<data.data.length;i++,j++) {
                    that.questions[i] = {};
                    that.questions[i]["key"] = data.data[j].Pid;
                    that.questions[i]["ID"] = data.data[j].Pid;
                    that.questions[i]["title"] = data.data[j].Tittle;
                }
                // 结束加载
                that.loading = false;
            }).catch(error => {
                // 如果检测到错误，也停止加载
                console.log(error);
                that.loading = false;
            })
        }
    },
    mounted: function() {
        let that = this;
        // 刷新表格
        that.refresh();
    }
}
</script>

<style>
    .questionlist * {
        font-size: 15px;
        letter-spacing: 1px;
    }
    .questionlist .ant-table-title {
        padding: 10px 20px;
    }
    .highlight {
        background-color: rgb(255, 192, 105);
        padding: 0px;
    }
    .refreshIcon {
        margin-left: 20px;
        cursor: pointer;
        transition: transform .6s;
    }
    .refreshIcon:hover {
        transform: rotate(360deg);
    }
</style>