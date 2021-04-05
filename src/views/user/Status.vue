<template>
    <div class="status" id="status">
        <a-table
            :columns="columns"
            :data-source="status"
            style="width:98%; background-color:#FCFDFE; margin:0 auto"
            :pagination="pagination"
        >
            <!-- 运行状态 -->
            <a-popover style="cursor: pointer" slot="status" slot-scope="status" title="编译信息">
                <template slot="content">
                    <p>编译错误啦哈哈哈</p>
                </template>
                <span v-text="status" :class="status=='Accept'? 'accept':status=='Wrong Answer'? 'wa':'others'"></span>
            </a-popover>
            <!-- Memory -->
            <span slot="memory" slot-scope="memory">
                <span v-text="memory"></span>
                <span> MB</span>
            </span>
            <!-- Time -->
            <span slot="time" slot-scope="time" style="white-space:nowrap">
                <span v-text="time"></span>
                <span> ms</span>
            </span>
            <!-- 代码长度（codeLength） -->
            <a-tooltip
                slot="codeLength" 
                slot-scope="codeLength" 
            >
                <template slot="title">
                    点击查看代码
                </template>
                <span 
                    v-bind:style="{ 
                        cursor: true? 'pointer':'default',
                        color: true? '#40A9FF':'#000000'
                    }"
                >
                    <span v-text="codeLength"></span>
                    <span> b</span>
                </span>
            </a-tooltip>
        </a-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pagination: {               // 页面设置
                pageSize: 10,           // 每页展示信息数量
                showQuickJumper: true,  // 快速跳转
            },
            columns: [
                {
                    title: "SolutionID",
                    dataIndex: "solutionID",
                },
                {
                    title: "问题ID",
                    dataIndex: "problemID",
                },
                {
                    title: "用户ID",
                    dataIndex: "userID",
                },
                {
                    title: "运行状态",
                    dataIndex: "status",
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: "Memory",
                    dataIndex: "memory",
                    scopedSlots: { customRender: 'memory' },
                },
                {
                    title: "Time",
                    dataIndex: "time",
                    scopedSlots: { customRender: 'time' },
                },
                {
                    title: "Language",
                    dataIndex: "language",
                },
                {
                    title: "Code Length",
                    dataIndex: "codeLength",
                    scopedSlots: { customRender: 'codeLength' },
                },
                {
                    title: "提交时间",
                    dataIndex: "submitTime"
                }
            ],
            status: [
                {
                    key: "1000000",
                    solutionID: 1000000,
                    problemID: 1000,
                    userID: 201705551222,
                    status: "Accept",
                    memory: 128,
                    time: 32,
                    language: "javascript",
                    codeLength: 256,
                    submitTime: Date(),
                },
                {
                    key: "1000001",
                    solutionID: 1000001,
                    problemID: 1001,
                    userID: 201705551224,
                    status: "Wrong Answer",
                    memory: 128,
                    time: 32,
                    language: "javascript",
                    codeLength: 256,
                    submitTime: Date(),
                },
                {
                    key: "1000002",
                    solutionID: 1000002,
                    problemID: 1002,
                    userID: 201705551223,
                    status: "Compile Error",
                    memory: 128,
                    time: 32,
                    language: "javascript",
                    codeLength: 256,
                    submitTime: Date(),
                }
            ]
            
        }
    },
    methods: {

    }
}
</script>

<style>
.status .accept {
    color: #13C965;
}
.status .wa {
    color: #FF0000;
}
.status .others {
    color: #0000FF;
}
.status {
    margin-top: 10px;
}
</style>