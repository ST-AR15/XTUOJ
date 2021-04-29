<template>
    <div class="status user-container" id="status">
        <a-table
            :columns="columns"
            :data-source="status"
            style="width:98%; background-color:#FCFDFE; margin:0 auto"
            :pagination="pagination"
        >
            <!-- solution -->
            <span 
                slot="solutionID"
                slot-scope="solutionID"
                :style="{ 
                    cursor: true? 'pointer':'default',
                    color: true? '#40A9FF':'#000000'
                }"
            >
                <span @click="solution.visible = true" v-text="solutionID"></span>
            </span>
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
                    :style="{ 
                        cursor: true? 'pointer':'default',
                        color: true? '#40A9FF':'#000000'
                    }"
                >
                    <span v-text="codeLength"></span>
                    <span> b</span>
                </span>
            </a-tooltip>
        </a-table>
        <a-modal
            title = "solution"
            :visible = "solution.visible"
            :footer = "null"
            width= "1100px"
            class="status-solution"
            @cancel = "solution.visible = false"
        >
            <p class="modal-title">
                By {{ solution.author }}, contest:{{ solution.contest }}, problem: {{ solution.problem }},
                <span :class="solution.result=='Accept'? 'accept':status=='Wrong Answer'? 'wa':'others'">{{ solution.result }}</span>,
                <a>#</a>,
                <a @click="copy(solution.code)">copy</a>
            </p>
            <hr />
            <codemirror
                ref="code"
                v-model="solution.code"
                :options="cmOptions"
                >
            </codemirror>
            <hr />
            <p class="bold" style="margin: 5px 0;">→Judgement Protocol</p>
            <div v-for="(item, i) in solution.test" :key="i">
                <a-divider />
                <p class="bold" v-text="`#${ i + 1 }, time: ${ item.time }ms, memory: ${ item.memory }KB, exit code: ${ item.exit }, checker exit code: ${ item.checker }, verdict: ${ item.verdict }`"></p>
                <p v-if="item.input">Input</p>
                <pre v-if="item.input" v-text="item.input"></pre>
                <p v-if="item.output">Output</p>
                <pre v-if="item.output" v-text="item.output"></pre>
                <p v-if="item.answer">Answer</p>
                <pre v-if="item.answer" v-text="item.answer"></pre>
                <p v-if="item.checkLog">CheckLog</p>
                <pre v-if="item.checkLog" v-text="item.checkLog"></pre>
            </div>
        </a-modal>
    </div>
</template>

<script>
import { copy } from "@/utils/tools.js"
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/ambiance.css'
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/clike/clike')
export default {
    components: {
        codemirror
    },
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
                    scopedSlots: { customRender: 'solutionID' },
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
            ],
            solution: {
                visible: false,
                author: "slight",
                contest: "Contest 2050 and Codeforces Round #718 (Div. 1 + Div. 2)",
                problem: "(A) Sum of 2050",
                result: "Accept",
                info: "Runtime error on test 1",
                code: "int main()\n{\n    int a = 1;\n    return 0;\n}\n",
                test: [
                    {
                        time: 93,
                        memory: 0,
                        exit: 1,
                        checker: 0,
                        verdict: "RUNTIME_ERROR",
                        input: "1",
                        output: "1",
                        answer: "1",
                        checkLog: "ok 1 numbers",
                    },
                    {
                        time: 93,
                        memory: 0,
                        exit: 1,
                        checker: 0,
                        verdict: "RUNTIME_ERROR",
                        input: "1",
                        checkLog: "Exit code is 1",
                    }
                ]
            },
            cmOptions:{
                value:'',
                mode:"text/x-csrc",
                // mode详细：https://codemirror.net/mode/clike/，clike换成python之类就能获得对应的内容
                indentUnit: 4,
                readOnly:false,
                lineNumbers: true,
                matchBrackets: true,
            },
            
        }
    },
    methods: {
        copy(text) {
            return copy(text);
        }
    }
}
</script>

<style>
.status {
    padding-top: 10px;
}
.status-solution p {
    margin: 0;
}
.status-solution .modal-title {
    font-size: 14px;
    letter-spacing: 0;
}
.status-solution pre {
    background-color: #EEEEEE;
    margin: 0;
    border: 1px solid #AAAAAA;
    font-size: 0.6rem;
    padding: 2px;
    color: #000000;
}
</style>