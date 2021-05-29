<template>
    <div class="admin-question-manage" id="admin-question-manage">
        <questionlist ref="questionlist" baseUrl="/api/problem/admin" :buttons="buttons" @queryDetail="queryDetail" @queryData="queryData" @queryDelete="queryDelete" @queryCompilation = "queryCompilation" @queryRejudge="queryRejudge" />
        <!-- 问题详情 - modal对话框 -->
        <a-modal
            :visible="detailModal.visible"
            :title="'问题' + detailModal.data.ID + ' - ' + detailModal.data.title + ' - 详情'"
            @cancel="detailModal.visible = false"
            width="90%"
            :footer="null"
        >
            <questionform ref="questionForm" :form="detailModal.data" okText="修改" @querySubmit="queryChange" />
        </a-modal>
        <!-- 数据管理 - modal对话框 -->
        <a-modal
            :visible="dataModal.visible"
            :title="'问题' + dataModal.ID + ' - ' + dataModal.title + ' - 数据管理'"
            @cancel="dataModal.visible = false"
            width= "900px"
        >
            
        </a-modal>
        <!-- 编译信息 - modal对话框 -->
        <a-modal
            :visible="compilationModal.visible"
            title="编译信息"
            @cancel="compilationModal.visible = false"
            width="90%"
            :footer="null"
        >
            <a-table
                :columns="compilationModal.columns"
                :data-source="compilationModal.data"
                :scroll="{x: 1100}"
                :pagination="false"
                rowKey="name"
                bordered
            >
                <span slot="timeToStandard" slot-scope="timeToStandard">
                    <span v-text="timeToStandard.toFixed(2)"></span>
                </span>
                <span slot="memoryToStandard" slot-scope="memoryToStandard">
                    <span v-text="memoryToStandard.toFixed(2)"></span>
                </span>
            </a-table>
        </a-modal>
    </div>
</template>

<script>
import questionlist from '@/views/components/Questionlist.vue'
import questionform from '@/views/components/QuestionForm.vue'
import { message } from 'ant-design-vue'
export default {
    components: {
        questionlist,
        questionform
    },
    data() {
        return {
            buttons: [               // 传给questionlist组件的按钮  
                {
                    text: "题目详情",
                    method: "queryDetail"
                },
                {
                    text: "数据管理",
                    method: "queryData"
                },
                {
                    text: "管理编译信息",
                    method: "queryCompilation"
                },
                {
                    text: "重判",
                    method: "queryRejudge",
                    isDanger: true,
                },
                {
                    text: "删除题目",
                    method: "queryDelete",
                    isDanger: true,
                },
            ],
            detailModal : {          // 问题详情的modal
                visible: false,
                data: {
                    ID: NaN,
                    name: "",
                    source: "",
                    content: "",
                    timeLimit: NaN,
                    memoryLimit: NaN,
                    IsBan: false,
                    QType: "",
                },
            },
            dataModal: {             // 问题数据管理的modal
                visible: false,
                ID: 0,
                title: "",
                data: {},
            },
            compilationModal: {      // 编译信息的modal
                visible: false,
                data: [
                    {
                        name: "GCC",
                        isC: 1,
                        address: "/user/bin/g++",
                        complieCommand: "g++/home/oj/user/main.cpp-o/home/oj/user/main",
                        runCommand: "/home/oj/user/main,main",
                        maxStack: 32768,
                        maxOutputSize: 131072,
                        maxSingleRunTime: 60000,
                        maxSingleRunMemory: 1048576,
                        timeToStandard: 1.00,
                        memoryToStandard: 1.00,
                        compileWithRun: 0,
                        suffix: ".cpp",
                        languageNum: 1,
                    },
                    {
                        name: "python3",
                        isC: 1,
                        address: "/user/bin/g++",
                        complieCommand: "g++/home/oj/user/main.cpp-o/home/oj/user/main",
                        runCommand: "/home/oj/user/main,main",
                        maxStack: 32768,
                        maxOutputSize: 131072,
                        maxSingleRunTime: 60000,
                        maxSingleRunMemory: 1048576,
                        timeToStandard: 1.00,
                        memoryToStandard: 1.00,
                        compileWithRun: 0,
                        suffix: ".cpp",
                        languageNum: 1,
                    },
                    {
                        name: "G++",
                        isC: 1,
                        address: "/user/bin/g++",
                        complieCommand: "g++/home/oj/user/main.cpp-o/home/oj/user/main",
                        runCommand: "/home/oj/user/main,main",
                        maxStack: 32768,
                        maxOutputSize: 131072,
                        maxSingleRunTime: 60000,
                        maxSingleRunMemory: 1048576,
                        timeToStandard: 1.00,
                        memoryToStandard: 1.00,
                        compileWithRun: 0,
                        suffix: ".cpp",
                        languageNum: 1,
                    },
                ],
                columns: [
                    {
                        title: "name",
                        dataIndex: "name",
                        key: "name",
                        width: 100,
                        fixed: 'left'
                    },
                    {
                        title: "c_or_cplusplus",
                        dataIndex: "isC",
                        key: "isC",
                        width: 120
                    },
                    {
                        title: "address",
                        dataIndex: "address",
                        key: "address",
                        width: 150
                    },
                    {
                        title: "complie_command",
                        dataIndex: "complieCommand",
                        key: "complieCommand",
                        width: 300
                    },
                    {
                        title: "run_command",
                        dataIndex: "runCommand",
                        key: "runCommand",
                        width: 300
                    },
                    {
                        title: "max_stack",
                        dataIndex: "maxStack",
                        key: "maxStack",
                        width: 120
                    },
                    {
                        title: "max_output_size",
                        dataIndex: "maxOutputSize",
                        key: "maxOutputSize",
                        width: 120
                    },
                    {
                        title: "max_single_run_time",
                        dataIndex: "maxSingleRunTime",
                        key: "maxSingleRunTime",
                        width: 120
                    },
                    {
                        title: "max_single_run_memory",
                        dataIndex: "maxSingleRunMemory",
                        key: "maxSingleRunMemory",
                        width: 120
                    },
                    {
                        title: "time_to_standard",
                        dataIndex: "timeToStandard",
                        key: "timeToStandard",
                        scopedSlots: { customRender: 'timeToStandard' },
                        width: 120
                    },
                    {
                        title: "memory_to_standard",
                        dataIndex: "memoryToStandard",
                        key: "memoryToStandard",
                        scopedSlots: { customRender: 'memoryToStandard' },
                        width: 120
                    },
                    {
                        title: "compile_with_run",
                        dataIndex: "compileWithRun",
                        key: "compileWithRun",
                        width: 120
                    },
                    {
                        title: "suffix",
                        dataIndex: "suffix",
                        key: "suffix",
                        width: 120
                    },
                    {
                        title: "LanguageNum",
                        dataIndex: "languageNum",
                        key: "languageNum",
                        width: 120
                    }
                ]
            }
        }
    },
    methods: {
        queryDetail(info) {  // 获取题目详情和修改
            // 使用info.ID来调取题目信息
            let url = "/api/problem/" + info.ID;
            this.$axios.get(url).then(rep => {
                // 把获取到的信息赋值给detailModal
                const data = rep.data.data[0];
                this.detailModal.data.ID = data.Pid;
                this.detailModal.data.name = data.Tittle;
                this.detailModal.data.source = data.Source==null? "admin":data.Source;
                this.detailModal.data.contents = data.Content;
                this.detailModal.data.timeLimit = data.TimeLimit;
                this.detailModal.data.memoryLimit = data.MemoryLimit;
                this.detailModal.data.IsBan = data.IsBan;
                this.detailModal.data.QType = "normal"
            })
            this.detailModal.ID = info.ID;
            this.detailModal.title = info.tittle;
            this.detailModal.visible = true;
        },
        queryData(info) {  //获取题目数据和修改
            this.dataModal.ID = info.ID;
            this.dataModal.tittle = info.title;
            this.dataModal.visible = true;
        },
        queryDelete(info) { // 删除题目
            let url = "/api/problem/" + info.ID;
            this.$axios.delete(url).then(rep => {
                if(parseInt(rep.status/100) == 2) { // 返回2开头的成功码
                    // 提示操作结果
                    message.info('删除成功');
                    // 刷新表格
                    this.$refs.questionlist.refresh();
                }
            })
        },
        queryRejudge(info) {  // 题目重判
            const url = `/api/rejudge/problem/${ info.ID }`
            this.$axios.put(url).then(rep => {
                if(parseInt(rep.status/100) == 2) {
                    this.$message.success(rep.statusText);
                }
            })
        },
        queryCompilation() { // 获取编译信息
            this.compilationModal.visible = true;
        },
        queryChange() { // 提交问题修改
            const url = '/api/problem/' + this.detailModal.data.ID;
            const info = {
                Tittle: this.detailModal.data.title,
                Source: this.detailModal.data.source,
                Content: this.detailModal.data.content,
                TimeLimit: this.detailModal.data.timeLimit,
                MemoryLimit: this.detailModal.data.memoryLimit,
                IsBan: this.detailModal.data.IsBan,
            }
            // TODO solved意义不明
            this.$axios.put(url, { params: info }).then(rep => {
                this.$message.success(rep.statusText);
                // TODO 这里提示修改成功，但实际上没修改
                this.detailModal.visible = false;
            })
        },
    }
}
</script>

<style>
</style>