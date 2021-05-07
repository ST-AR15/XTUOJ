// 传入一个数组，数组的每一项是一个对象，每个对象里面一个text和一个method，text是按钮名字，method是方法。记得监听。
// TODO 和contestlist一样翻页有BUG
<template>
    <div class="questionlist" id="questionlist">
        <a-table
            :columns="columns"
            :data-source="questions"
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
        /**
         * 修改路由 ----------------------------------                                  
         *                                           |->  切换表格页 + 获取数据
         * 切换表格页页面 -> 监听修改 ->  修改路由 -----
         */
        
        // 切换页码有时候会报错是因为那一页的东西在加载过的东西之前而且为空
        // 在加载之前就会触发错误监听
        // 所以会出现console报错.实际上是没关系的.

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
            // 既然要刷新,就肯定得先清空
            this.questions = [];
            // 获取当前页内容
            this.queryPage();
        },
        // 加载某一页的内容
        // 只加载内容，其他的不管
        // 也就是说，这个方法只是对question变量的操作
        queryPage() { // 加载当前页
            const page = this.$route.query.page? this.$route.query.page: 1;  // 页码,query有内容就是数字,没有就是1;
            // 如果已经加载过了，就不加载
            if(this.questions[(page-1) * this.pagination.pageSize] ) {
                return ;
            }
            // 开始加载
            this.loading = true;
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
                this.pagination.pageSize = data.per_page;
                this.pagination.total = data.total;
                // 循环复制给数组questions
                for(let i=(page-1)*this.pagination.pageSize,j=0;j<data.data.length;i++,j++) {
                    let question = {
                        ID: data.data[j].Pid,
                        tittle: data.data[j].Tittle,
                        tips: ['测试','test'],
                        source: "测试来源",
                        status: "测试状态",
                        accept: 100,
                        total: 200,
                    }
                    this.$set(this.questions, i, question);
                }
                // 结束加载
                this.loading = false;
            }).catch(error => {
                // 如果检测到错误，也停止加载
                this.$message.error(`加载问题列表时发生错误${ error }`);
                this.loading = false;
            })
        },
    },
    mounted: function() {
        let page = this.$route.query.page? this.$route.query.page: 1;
        // 页码切换
        this.pagination.current = Number(page);
        // 加载内容
        this.queryPage();
    },
    watch: {
        // query变化的时候调用，通过query切换表页码，与handleTableChange互补
        $route(to) {
            let page = to.query.page? to.query.page: 1;
            // 页码切换
            this.pagination.current = Number(page);
            // 加载内容
            this.queryPage();
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