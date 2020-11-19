<template>
    <div class="home" id="home">
        <div class="user-questions">
            <a-table
                :columns="columns"
                :data-source="questions"
                style="width:1000px"
                :pagination="pagination"
            >
                <span slot="ID"></span>
                <span slot="title"></span>
                <span slot="tips" slot-scope="tips" style="float:right">
                    <a-tag
                        v-for="(tip,i) in tips"
                        :key="tip"
                        :color="i%2 ? 'geekblue' : 'green'"
                    >
                        {{tip}}
                    </a-tag>
                </span>
                <span slot="status" slot-scope="status">
                    <a-tag
                        :color="status=='ATTEMPT'? 'orange':status=='ACCEPT'? 'green':'blue'"
                        style="border-radius: 10px;height:22px; line-height:22px"
                    >● <span>{{status}}</span></a-tag>
                </span>
                <span slot="AT"></span>
                <template slot="title">
                    Problem List
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pagination: {       // 页面设置
                pageSize:10,    // 每页题目数量
            },
            columns: [          // 表格的表头
                {
                    title: "ID",
                    dataIndex: "ID",
                    sorter: (a,b) => a.ID - b.ID,
                },
                {
                    title: "Title",
                    dataIndex: "title",
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
                    title: "Status",
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
                    dataIndex:"AT",
                }
            ],
            // todo 拆开AT
            questions: [
                {
                    key: "1000",
                    ID: 1000,
                    title: "A+B",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ATTEMPT",
                    AT: "0/0",
                },
                {
                    key: "1001",
                    ID: 1001,
                    title: "A+B",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1002",
                    ID: 1002,
                    title: "A+B",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1003",
                    ID: 1003,
                    title: "A+B",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1004",
                    ID: 1004,
                    title: "A+B",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1005",
                    ID: 1005,
                    title: "A+B",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1006",
                    ID: 1006,
                    title: "A+B",
                    tips: ["dp","geometry","math","greedy"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1007",
                    ID: 1007,
                    title: "A+B",
                    tips: ["math","greedy"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1008",
                    ID: 1008,
                    title: "A+B",
                    tips: ["dp","geometry"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1009",
                    ID: 1009,
                    title: "A+B",
                    tips: ["math","greedy"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1010",
                    ID: 1010,
                    title: "A+B",
                    tips: ["dp","geometry"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1011",
                    ID: 10011,
                    title: "A+B",
                    tips: ["math","greedy"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
                {
                    key: "1012",
                    ID: 1012,
                    title: "A+B",
                    tips: ["dp"],
                    status: "ACCEPT",
                    AT: "0/0",
                },
            ]
        }
    }
}
</script>

<style>

</style>