<template>
    <div class="questionlist" id="questionlist">
        <a-table
            :columns="columns"
            :data-source="questions"
            style="width:1000px; background-color:#FCFDFE; margin:20px auto"
            :pagination="pagination"
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
                <a-button type="primary" @click="goQuestion(record.ID)">查看</a-button>
            </span>
        </a-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchText: "",
            pagination: {       // 页面设置
                pageSize:10,    // 每页题目数量
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
                {
                    key: "1000",
                    ID: 1000,
                    title: "A+BA",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ATTEMPT",
                    accept: 100,
                    total: 200,
                    source: "昶浩出题"
                },
                {
                    key: "1001",
                    ID: 1001,
                    title: "A+BW",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1002",
                    ID: 1002,
                    title: "A+BE",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1003",
                    ID: 1003,
                    title: "A+BR",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1004",
                    ID: 1004,
                    title: "A+BB",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1005",
                    ID: 1005,
                    title: "A+BW",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1006",
                    ID: 1006,
                    title: "A+BF",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1007",
                    ID: 1007,
                    title: "A+B",
                    tips: ["math","greedy"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1008",
                    ID: 1008,
                    title: "A+B",
                    tips: ["dp","geometry"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1009",
                    ID: 1009,
                    title: "A+B",
                    tips: ["math","greedy"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1010",
                    ID: 1010,
                    title: "A+B",
                    tips: ["dp","geometry"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1011",
                    ID: 10011,
                    title: "A+B",
                    tips: ["math","greedy"],
                    status: "ACCEPT",
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1012",
                    ID: 1012,
                    title: "A+B",
                    tips: ["dp"],
                    status: "ACCEPT",
                    total: 200,
                },
            ]
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