// 传入一个数组，数组的每一项是一个对象，每个对象里面一个text和一个method，text是按钮名字，method是方法。记得监听。
<template>
    <div class="questionlist" id="questionlist">
        <a-table
            :columns="columns"
            :data-source="questions"
            style="width:1000px; background-color:#FCFDFE; margin:20px auto"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
        >
            <!-- 搜索 -->
            <div
                slot="filterDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                style="padding: 8px"
                >
                <a-input
                    v-ant-ref="c => (searchInput = c)"
                    :placeholder="`搜索 ${column.title}`"
                    :value="selectedKeys[0]"
                    style="width: 188px; margin-bottom: 8px; display: block;"
                    @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                    @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                />
                <a-button
                    size="small"
                    style="width: 90px; margin-right: 8px;"
                    @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                    type="green"
                >
                    搜索
                    <a-icon type="search" />
                </a-button>
                <a-button 
                    type="primary"
                    size="small"
                    style="width: 90px" 
                    @click="() => handleReset(clearFilters)"
                >
                    重置
                    <a-icon type="sync" />
                </a-button>
            </div>
            <!-- 高亮 -->
            <template slot="customRender" slot-scope="text, record, index, column">
                <span v-if="searchText && searchedColumn === column.dataIndex">
                    <template
                    v-for="(fragment, i) in text
                        .toString()
                        .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                    >
                    <mark
                        v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                        :key="i"
                        class="highlight"
                        >{{ fragment }}</mark
                    >
                    <template v-else>{{ fragment }}</template>
                    </template>
                </span>
                <template v-else>
                    {{ text }}
                </template>
            </template>
            <!-- ID -->
            <span slot="ID"></span>
            <span slot="title"></span>
            <!-- tips -->
            <span slot="tips" slot-scope="tips" style="float:right">
                <a-tag
                    v-for="tip in tips"
                    :key="tip"
                    v-bind:id="'tip-' + tip"
                >
                    {{tip}}
                </a-tag>
            </span>
            <!-- status -->
            <span slot="status" slot-scope="status">
                <a-tag
                    :color="status=='ATTEMPT'? 'orange':status=='ACCEPT'? 'green':'blue'"
                    style="border-radius: 10px;height:22px; line-height:22px"
                >● <span>{{status}}</span></a-tag>
            </span>
            <!-- AC/Total -->
            <span slot="AT" slot-scope="text, record">
                <span v-text="record.accept"></span>
                /
                <span v-text="record.total"></span>
            </span>
            <!-- 表头 -->
            <template slot="title">
                <h2 style="font-size: 22px">问题列表</h2>
            </template>
            <!-- 搜索图标 -->
            <a-icon
                slot="filterIcon"
                type="search"
            />
            <!-- 操作 -->
            <span slot="buttons" slot-scope="text, record">
                <a-space>
                    <template v-for="(item,i) in buttons">
                        <a-button type="primary" v-bind:key="i" @click="callbackMethod(item.method,record.ID)">
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
                pageSize:2,     // 每页题目数量
                showQuickJumper: true,  // 快速跳转
                total: 0,
            },
            columns: [          // 表格的表头
                {
                    title: "ID",
                    dataIndex: "ID",
                    // sorter: (a,b) => a.ID - b.ID,
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.ID
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: visible => {
                        if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        });
                        }
                    },
                },
                {
                    title: "题目名称",
                    dataIndex: "title",
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.title
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: visible => {
                        if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        });
                        }
                    },
                },
                {
                    title: "",
                    dataIndex: "tips",
                    scopedSlots: { customRender: 'tips' },
                    filters: [
                        {
                            text: 'dp',
                            value: 'dp'
                        },
                        {
                            text: 'math',
                            value: 'math'
                        },
                    ],
                    onFilter: (value, record) => record.tips.indexOf(value) >= 0,
                },
                {
                    title: "来源",
                    dataIndex: "source"
                },
                {
                    title: "状态",
                    dataIndex: "status",
                    scopedSlots: { customRender: 'status' },
                    filters: [
                        {
                            text: 'ACCEPT',
                            value: 'ACCEPT'
                        },
                        {
                            text: 'ATTEMPT',
                            value: 'ATTEMPT'
                        },
                    ],
                    onFilter: (value, record) => record.status.indexOf(value) === 0,
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
        handleSearch(selectedKeys, confirm, dataIndex) {
            confirm();
            this.searchText = selectedKeys[0];
            this.searchedColumn = dataIndex;
        },

        handleReset(clearFilters) {
            clearFilters();
            this.searchText = '';
        },
        handleTableChange(pagination) {
            this.loading = true; // 开始加载
            let page = pagination.current;
            let url = 'http://172.22.114.116/api/showProblem/' + page;
            this.$axios.get(url).then(rep => {
                // 循环复制给数组questions
                for(let i=(page-1)*this.pagination.pageSize,j=0;j<this.pagination.pageSize;j++,i++) {
                    this.questions[i] = {};
                    this.questions[i]["key"] = rep.data[j].ProblemId;
                    this.questions[i]["ID"] = rep.data[j].ProblemId;
                    this.questions[i]["title"] = rep.data[j].Tittle;
                }
                this.loading = false;
            })
        },
        callbackMethod(fatherMethod,param) {
            this.$emit(fatherMethod, param);
        }
    },
    mounted: function() {
        // todo 页面创建时要确认页数
        // todo 这个函数调用两次的BUG
        this.pagination.total = 200;
        this.handleTableChange({current:1});
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
</style>