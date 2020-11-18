<template>
    <div class="user" id="user">
        <a-layout>
            <a-layout-header>
                <div class="logo">
                    <p>XiangTan University</p>
                </div>
                <a-menu
                    class="menu"
                    mode="horizontal"
                >
                    <a-menu-item>
                        <a-icon type="home" />
                        Home
                    </a-menu-item>
                    <a-menu-item>
                        Problems
                    </a-menu-item>
                    <a-menu-item>
                        Contests
                    </a-menu-item>
                    <a-menu-item>
                        Status
                    </a-menu-item>
                    <a-menu-item>
                        Ranklist
                    </a-menu-item>
                </a-menu>
                <a-button class="login">Login</a-button>
            </a-layout-header>
            <a-layout-content>
                <div class="user-questions">
                    <a-table
                        :columns="columns"
                        :data-source="questions"
                        style="width:1000px"
                        :pagination="pagination"
                    >
                        <span slot="ID">
                            
                        </span>
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
                <div class="user-search">

                </div>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pagination: {  //页面设置
                pageSize:10,    // 每页题目数量
            },
            columns: [     // 表格的表头
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
    .user {
        min-width: 1080px;
    }
    .user .ant-layout-header {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E8E8E8;
        position: relative;
        background-color: rgb(252, 253, 254);
        color: rgb(90, 90, 90);
    }
    .user .ant-layout-header > .logo {
        min-width: 180px;
        height: 100%;
        letter-spacing: 1px;
		font-size: 18px;
		line-height: 66px;
        margin-right: 20px;
    }
    .user .ant-layout-header > .menu {
        height: 64px;
        line-height: 64px;
    }
    .user .ant-layout-header > .menu li {
        height: 64px;
        margin: 0 5px;
    }
    .user .ant-layout-header > .login {
        position: absolute;
        right: 0;
        color: rgb(81, 141, 225);
        font-weight: 700;
        margin-right: 60px;
    }
</style>