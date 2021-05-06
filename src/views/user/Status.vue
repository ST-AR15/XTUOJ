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
                <pre v-if="item.output" v-html="item.output"></pre>
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
import { Base64 } from 'js-base64'
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
        },
        queryStatus() {
            //  TODO 没有全部的提交情况
            // const url = `/api/problem/{pid}/submit`
            let result = "eyJjcHVfdGltZSI6IFsiNCIsIjMiLCI3IiwiNCIsIjciLCI3IiwiNCIsIjMiLCI4IiwiOCIsIjgiLCI2NjciLCI2MTEiLCI1ODgiLCI1NTQiLCI0OTIiLCI3NzIiLCI3NDkiLCI3MDYiLCI1OTIiLCI1MjMiLCI2MzEiLCI2MjMiLCI1NzUiLCI1MjMiLCI0ODgiLCI3MTciLCI0ODMiLCI0MDYiLCI2NDQiLCI1ODciLCI2MzMiXSwicmVhbF90aW1lIjogWyIzMCIsIjMwIiwiMzAiLCIzMCIsIjMwIiwiMzAiLCIzMCIsIjMwIiwiMzAiLCIzMCIsIjMwIiwiNzgyIiwiNzIzIiwiNjkyIiwiNjMyIiwiNTQxIiwiODQyIiwiODEyIiwiNzgyIiwiNjYxIiwiNTcxIiwiNjkyIiwiNjkyIiwiNjY1IiwiNTcxIiwiNTQyIiwiNzgxIiwiNTQxIiwiNDUxIiwiNzIyIiwiNjYyIiwiNjkxIl0sInRpbWUiOiBbIjQiLCIzIiwiNyIsIjQiLCI3IiwiNyIsIjQiLCIzIiwiOCIsIjgiLCI4IiwiNjY3IiwiNjExIiwiNTg4IiwiNTU0IiwiNDkyIiwiNzcyIiwiNzQ5IiwiNzA2IiwiNTkyIiwiNTIzIiwiNjMxIiwiNjIzIiwiNTc1IiwiNTIzIiwiNDg4IiwiNzE3IiwiNDgzIiwiNDA2IiwiNjQ0IiwiNTg3IiwiNjMzIl0sIm1lbW9yeSI6IFsiMjY4MjgiLCIyNjg2NCIsIjI2ODA0IiwiMjY4NjgiLCIyNjg4OCIsIjI2OTIwIiwiMjc0NzIiLCIyNzI2NCIsIjI3NDA0IiwiMjcyNjAiLCIyNzExMiIsIjE0MTAxNiIsIjE0MDU1NiIsIjExMDA2NCIsIjk3MTI0IiwiODQwMjgiLCI2MzI5MiIsIjYyNzYwIiwiNjEzMzYiLCI1NzI5NiIsIjUzMjIwIiwiNzU5NTYiLCI3NjI0NCIsIjY1Mzc2IiwiNjIwNDgiLCI2Mjc2OCIsIjk5OTQ4IiwiNTc5MjgiLCI1NDk0NCIsIjg3MDQ4IiwiNjYyMjQiLCI3MzgxMiJdLCJvdXRwdXQiOiBbIk1TQXpJRGNnWEc0PSIsIk1TQXlJRFVnTVRFZ01qTWdORGNnT1RVZ1hHND0iLCJNU0ExSURnNUlGeHUiLCJNaUF5TUNBNE15QmNiZz09IiwiTVNBeklEVWdNVEVnTnpFZ1hHND0iLCJOQ0ExT1NCY2JnPT0iLCJNU0F5SURRZ05TQTJJRGtnTVRBZ01UTWdNVFFnTWpBZ01qRWdNamtnTXpJZ016UWdOREVnTlRRZ05qVWdOamtnTnpZZ01UQTBJREV3T1NBeE5UTWdNVFkwSURJd09TQXlNekFnTXpJNUlETTROQ0EwTmpFZ056WTVJREV4TlRRZ01qTXdPU0E1TWpNNUlGeHUiLCJNU0F5SURNZ055QTNOVFU1SUZ4dSIsIk1TQXlJRE1nTlNBM0lERXhJREV5SURJeklESTFJRE00SURVeElEYzNJREV3TXlBeE5UVWdNekV4SURrek5Ua2dYRzQ9IiwiTVNBeklEUWdOaUE1SURFeklESTBJRE0wSURRNUlEWTVJREUzTkNBek5Ea2dPRE01T1NCY2JnPT0iLCJNU0F6SURjZ01UVWdOemt4T1NCY2JnPT0iLCJNU0F5SURNZ05DQTFJRFlnTnlBNElEa2dNVEFnTVRFZ01UTWdNVFFnTVRVZ01UY2dNVGtnTWpBZ01qRWdNak1nTWpZZ01qY2dNamtnTXpFZ016SWdNelFnTXpVZ016a2dOREVnTkRNZ05EUWdORGNnTlRNZ05UUWdOVFVnTlRrZ05qSWdOalVnTmprZ056RWdOellnTnprZ09EQWdPRE1nT0RjZ09Ea2dPVFVnT1RnZ01UQTBJREV3TnlBeE1Ea2dNVEV4SURFeE9TQXhNalVnTVRNeElERXpOQ0F4TXprZ01UUXpJREUxTXlBeE5Ua2dNVFl4SURFMk5DQXhOamNnTVRjMUlERTNPU0F4T0RnZ01UazNJREl3T1NBeU1UVWdNakU1SURJeU15QXlNekFnTWpNNUlESTFNU0F5TmpNZ01qWTVJREkzT1NBeU9EY2dNamsySURNd055QXpNVFFnTXpJeklETXlPU0F6TXpVZ016VXhJRE0xT1NBek56Y2dNemcwSURNNU5TQTBNRFFnTkRFNUlEUXpNU0EwTXprZ05EWXhJRFEzT1NBME9UUWdOVEF6SURVeU55QTFNemtnTlRVNUlEVTJOaUExT1RNZ05qRTFJRFl5T1NBMk5EY2dOalU1SURZM01TQTJPVElnTnpFNUlEYzFOU0EzTmprZ056a3hJRGd3T1NBNE16a2dPRFl6SURnM09TQTRPVEFnT1RJeklEazBOQ0E1T0RrZ01UQXdOeUF4TURVMUlERXdOemtnTVRFeE9TQXhNVE16SURFeE5UUWdNVEU0TnlBeE1qTXhJREV5TlRrZ01USTVOU0F4TXpFNUlERXpPRFVnTVRRek9TQXhORGcwSURFMU1URWdNVFV6T1NBeE5UZ3pJREUyTVRrZ01UWT0iLCJNU0F5SURNZ05DQTFJRFlnTnlBNElEa2dNVEVnTVRJZ01UTWdNVFFnTVRVZ01UY2dNVGtnTWpBZ01qTWdNalFnTWpVZ01qWWdNamNnTWprZ016UWdNelVnTXpnZ016a2dOREVnTkRRZ05EY2dORGtnTlRFZ05UTWdOVFVnTlRrZ05qSWdOalFnTmprZ056RWdOelFnTnpjZ056a2dPRE1nT0RrZ09UQWdPVGtnTVRBeklERXdOQ0F4TURjZ01URXhJREV4TmlBeE1Ua2dNVEkxSURFeU9TQXhNelFnTVRNNUlERTBNeUF4TkRrZ01UVTFJREUyTnlBeE56UWdNVGM1SURFNE1TQXhPRGdnTVRrMElERTVPU0F5TURjZ01qQTVJREl4TlNBeU1qUWdNak16SURJek9TQXlOVEVnTWpVNUlESTJPU0F5TnpJZ01qYzVJREk1T1NBek1URWdNekUwSURNeU5DQXpNelVnTXpRNUlETTFNQ0F6TlRrZ016WXpJRE0zTnlBek9Ea2dNems1SURReE9TQTBNekVnTkRRNUlEUTFOQ0EwTmpjZ05UQXpJRFV4T1NBMU1qUWdOVE01SURVME5TQTFOVGtnTlRnMElEVTVPU0EyTWpNZ05qSTVJRFkwT1NBMk56UWdOams1SURjd01TQTNNVGtnTnpJM0lEYzFOU0EzTnprZ09ERTRJRGd6T1NBNE9Ua2dPVEE1SURrek5TQTVORFFnT1RjMElERXdNRGNnTVRBek9TQXhNRFE1SURFd056a2dNVEE1TVNBeE1UWTVJREV4T1RrZ01USTFPU0F4TWprNUlERXpORGtnTVRNMk5DQXhNems1SURFME1ETWdNVFExTlNBeE5URXhJREUxTlRrZ01UVTNOQ0F4TmpNM0lERT0iLCJNU0F5SURNZ05DQTFJRFlnTnlBNElEa2dNVEFnTVRFZ01UTWdNVFFnTVRVZ01UWWdNVGNnTVRrZ01qQWdNakVnTWpNZ01qY2dNamtnTXpJZ016TWdNelFnTXpVZ016a2dOREVnTkRNZ05EUWdORGNnTlRBZ05UUWdOVFVnTlRrZ05qSWdOalVnTmpjZ05qa2dOekVnTnpZZ056a2dPRE1nT0RRZ09EY2dPRGtnT1RnZ01UQXhJREV3TkNBeE1Ea2dNVEV4SURFeE9DQXhNVGtnTVRJMUlERXpNU0F4TXpVZ01UTTVJREUwTXlBeE5USWdNVFV6SURFMk5DQXhOamNnTVRZNUlERTNOU0F4TnprZ01UZzJJREU1TnlBeU1ETWdNakE1SURJeE9TQXlNekFnTWpNM0lESXpPU0F5TlRFZ01qVTBJREkyTXlBeU56RWdNamM1SURNd05TQXpNRGNnTXpFMElETXlPU0F6TXpVZ016TTVJRE0xTmlBek5Ua2dNemN6SURNNE5DQXpPVFVnTkRBM0lEUXhPU0EwTXprZ05EWXhJRFEzTlNBME9UUWdOVEF6SURVd09TQTFNamNnTlRVNUlEVTJNQ0ExT1RRZ05qRXhJRFl4TlNBMk1qa2dOalU1SURZM09TQTJPVElnTnpFeklEY3hPU0EzTkRjZ056WTBJRGMyT1NBM09URWdPREUxSURnek9TQTROemtnT1RJeklEa3pOQ0E1TlRFZ09UZzVJREV3TURjZ01UQXhPU0F4TURjd0lERXhNakVnTVRFMU5DQXhNVGc1SURFeU1qTWdNVEl6TVNBeE1qVTVJREV6TURnZ01UTXhPU0F4TXpVNUlERXpPRFVnTVRReU55QXhORGsxSURFMU1qa2dNVFV6T1NBeE5UZz0iLCJNU0F5SURNZ05DQTFJRFlnTnlBNElEa2dNVEFnTVRFZ01UTWdNVFFnTVRVZ01UY2dNVGtnTWpBZ01qRWdNak1nTWpRZ01qWWdNamNnTWprZ016SWdNelFnTXpVZ016a2dOREVnTkRNZ05EUWdORGNnTkRrZ05UTWdOVFFnTlRVZ05Ua2dOaklnTmpVZ05qa2dOekVnTnpRZ056WWdOemtnT0RNZ09EY2dPRGtnT1RnZ09Ua2dNVEEwSURFd055QXhNRGtnTVRFeElERXhPU0F4TWpVZ01UTXhJREV6TkNBeE16a2dNVFF6SURFME9TQXhOVE1nTVRZMElERTJOeUF4TnpRZ01UYzFJREUzT1NBeE9EZ2dNVGszSURFNU9TQXlNRGtnTWpFMUlESXhPU0F5TWpRZ01qTXdJREl6T1NBeU5URWdNall6SURJMk9TQXlOelFnTWpjNUlESTVOaUF5T1RrZ016QTNJRE14TkNBek1qa2dNek0xSURNME9TQXpOVGtnTXpjM0lETTROQ0F6T1RVZ016azVJRFF4T1NBME16RWdORE01SURRME9TQTBOakVnTkRrMElEVXdNeUExTWpRZ05USTNJRFV6T1NBMU5Ea2dOVFU1SURVNU15QTFPVGtnTmpFMUlEWXlPU0EyTlRrZ05qYzBJRFk1TWlBMk9Ua2dOekU1SURjMU5TQTNOamtnTnpreElEZ3lOQ0E0TXprZ09EYzVJRGc1T1NBNU1qTWdPVFEwSURrNE9TQXhNREEzSURFd05Ea2dNVEEzT1NBeE1EazVJREV4TlRRZ01URTROeUF4TVRrNUlERXlNekVnTVRJMU9TQXhNekU1SURFek5Ea2dNVE00TlNBeE16azVJREUwT0RRZ01UVXhNU0F4TlRNNUlERT0iLCJNU0F5SURNZ05DQTFJRFlnTnlBNElEa2dNVEFnTVRFZ01USWdNVE1nTVRRZ01UVWdNVGNnTVRrZ01qQWdNakVnTWpNZ01qVWdNamNnTWprZ016SWdNelFnTXpVZ016Z2dNemtnTkRFZ05ETWdORFFnTkRjZ05URWdOVFFnTlRVZ05Ua2dOaklnTmpRZ05qVWdOamtnTnpFZ056WWdOemNnTnprZ09ETWdPRGNnT0RrZ09UQWdPVGdnTVRBeklERXdOQ0F4TURrZ01URXhJREV4TmlBeE1Ua2dNVEkxSURFeU9TQXhNekVnTVRNNUlERTBNaUF4TkRNZ01UVXpJREUxTlNBeE5qUWdNVFkzSURFM05TQXhOemtnTVRneElERTVOQ0F4T1RjZ01qQTNJREl3T1NBeU1Ua2dNak13SURJek15QXlNemtnTWpVeElESTFPU0F5TmpNZ01qY3lJREkzT1NBeU9EVWdNekEzSURNeE1TQXpNVFFnTXpJNUlETXpOU0F6TlRrZ016WXpJRE00TkNBek9Ea2dNemsxSURReE9TQTBNamdnTkRNNUlEUTFOQ0EwTmpFZ05EWTNJRFE1TkNBMU1ETWdOVEU1SURVeU55QTFORFVnTlRVNUlEVTNNU0ExT0RRZ05qRTFJRFl5TXlBMk1qa2dOalU1SURZNU1pQTNNVFFnTnpFNUlEY3lOeUEzTmprZ056YzVJRGM1TVNBNE1UZ2dPRE01SURnMU55QTROemtnT1RBNUlEa3lNeUE1TXpVZ09UZzVJREV3TURBZ01UQXdOeUF4TURNNUlERXdPVEVnTVRFME15QXhNVFUwSURFeE5qa2dNVEl6TVNBeE1qVTVJREV5T0RZZ01UTXhPU0F4TXpZMElERXpPRFVnTVRReU9TQT0iLCJPVGszT1RFNUlGeHUiLCJPVGd5TnprNUlGeHUiLCJPVFF5TkRjNUlGeHUiLCJPRE14TlRrNUlGeHUiLCJOekl3TnpFNUlGeHUiLCJNU0F5SURNZ05TQTJJRGdnTVRFZ01UTWdNVGNnTWpBZ01qWWdNamNnTXpVZ05ERWdOVE1nTmpJZ09EQWdPRE1nTVRBM0lERXlOU0F4TmpFZ01UZzRJREkxTVNBek1qTWdNemMzSURVMk5pQTNOVFVnTVRFek15QXlNalkzSURrNU56a3hPU0JjYmc9PSIsIk1TQXlJRE1nTkNBMUlEa2dNVEVnTVRJZ01UUWdNVGtnTWpRZ01qVWdNamtnTXpnZ05Ea2dOVEVnTlRrZ05qUWdOelFnTnpjZ09Ua2dNVEk1SURFME9TQXhOVFVnTVRrMElESTFPU0F5T1RrZ016STBJRE00T1NBMk5Ea2dOemM1SURrM05DQXhNams1SURFNU5Ea2dNemc1T1NBNU9ESTNPVGtnWEc0PSIsIk1TQXlJRE1nTlNBeE1DQXhNU0F5TVNBek1pQTBNeUEyTlNBeE16RWdPVFF5TkRjNUlGeHUiLCJNU0F6SURRZ055QTVJREV3SURFNUlESXhJRE01SURReklEVTBJRGczSURFd09TQXlNVGtnTkRNNUlEZ3pNVFU1T1NCY2JnPT0iLCJNU0F5SURNZ05TQTJJRGdnTVRBZ01URWdNVElnTVRNZ01UY2dNakFnTWpFZ01qVWdNamNnTXpJZ016VWdNemdnTkRFZ05ETWdOVEVnTmpJZ05qVWdOellnTnpjZ09ETWdPVEFnT1RnZ01URTJJREV5TlNBeE16RWdNVFF5SURFMU15QXhOVFVnTVRneElERTVOeUF5TXpBZ01qTXpJREkxTVNBeU56SWdNamcxSURNd055QXpOak1nTXprMUlEUXlPQ0EwTmpFZ05EWTNJRFUwTlNBMU56RWdOamt5SURneE9DQTROVGNnT1RJeklERXdNREFnTVRBNU1TQXhNamcySURFek9EVWdNVFl6TnlBeE56RTFJREl3TURFZ01qVTNNeUF5TnpjeElETXdNRElnTXpJM05TQTBNREF6SURVeE5EY2dOakF3TlNBNU1EQTRJREV5TURFeElERTRNREUzSURNMk1ETTFJRGN5TURjeE9TQmNiZz09IiwiTVNBeUlETWdOQ0ExSURZZ055QTVJREV3SURFeElERXlJREV6SURFMElERTFJREU1SURJd0lESXhJREl6SURJMUlESTNJREk1SURNeElETXlJRE0wSURNNElETTVJRFF4SURReklEUTNJRFV4SURVMElEVTFJRFU1SURZMElEWTFJRFk1SURjMklEYzNJRGM1SURneklEZzNJRGt3SURrMUlERXdNeUF4TURRZ01UQTVJREV4TVNBeE1Ua2dNVEk1SURFek1TQXhNemtnTVRReUlERTFNeUF4TlRVZ01UVTVJREUyTkNBeE5qY2dNVGMxSURFNE1TQXhPVFFnTWpBM0lESXdPU0F5TVRrZ01qSXpJREl6TUNBeU16a2dNalU1SURJMk15QXlOeklnTWpjNUlESTROU0F6TURjZ016RXhJRE15T1NBek16VWdNelV4SURNMk15QXpPRFFnTXpnNUlEUXhOU0EwTVRrZ05ESTRJRFF6T1NBME5UUWdORFl4SURRM09TQTFNVGtnTlRJM0lEVTBOU0ExTlRrZ05UY3hJRFl4TlNBMk1qTWdOalU1SURZM01TQTNNVFFnTnpJM0lEYzJPU0EzTnprZ09ETTVJRGcxTnlBNE56a2dPVEE1SURreU15QXhNREF3SURFd016a2dNVEExTlNBeE1Ea3hJREV4TVRrZ01URTBNeUF4TVRVMElERXlNekVnTVRJME55QXhNekU1SURFek5qUWdNVFF5T1NBeE5EVTFJREUxTXprZ01UVTFPU0F4TmpjNUlERTNNVFVnTVRjMU9TQXhPREU1SURFNE5EY2dNakF3TVNBeU1EYzVJREl4TkRRZ01qRTRNeUF5TWpnM0lESXpNRGtnTWpRMk15QXlOak01SURJM01qa2dNamc9IiwiTVNBeUlEVWdOaUF4TXlBeU1DQTBNU0EzT0RZeU16a2dYRzQ9IiwiTVNBeklEUWdOaUEzSURrZ01UTWdNVFVnTVRrZ01qY2dNelFnTXprZ05UVWdOamtnTnprZ01URXhJREV6T1NBeU56a2dOVFU1SURZMk5USTNPU0JjYmc9PSIsIk1TQXlJRFFnTlNBMklEZ2dPU0F4TUNBeE15QXhOQ0F4TnlBeU1DQXlNU0F5T1NBek1pQXpOQ0EwTVNBME5DQTBPQ0ExTkNBMk1pQTJOU0EyT1NBM05pQTRPU0E1TnlBNU9DQXhNRFFnTVRBNUlERXlOU0F4TkRZZ01UVXpJREUyTkNBeE9UY2dNakE1SURJek1DQXlORFFnTWpreklETXhOQ0F6TWprZ016ZzBJRFEwTUNBME5qRWdORGc1SURRNU5DQTFNemdnTmpJNUlEWTVNaUEzTXpRZ056WTVJRGc0TVNBNU9Ea2dNVEEzTnlBeE1UVTBJREV6T0RVZ01UUTJPU0F4TmpFMklESXlNRFFnTWpNd09TQXlOamswSURNeU16TWdNelEyTkNBME5EQTVJRFE0TlRBZ05UTTRPU0EyT1RJNUlEZ3dPRFFnT1Rjd01TQXhOakUyT1NBeU5ESTFOQ0EwT0RVd09TQTVOekF4T1RrZ1hHND0iLCJOaUF4TXlBNU5UYzFPVGtnWEc0PSIsIk5DQXlOQ0F4TWpRZ05qSTBJRGs1T1RrNU9TQmNiZz09Il0sInJlc3VsdCI6IFsiOSIsIjkiLCI5IiwiOSIsIjkiLCI5IiwiOSIsIjkiLCI5IiwiOSIsIjkiLCI5IiwiOSIsIjkiLCI5IiwiOSIsIjkiLCI5IiwiOSIsIjkiLCI5IiwiOSIsIjkiLCI5IiwiOSIsIjkiLCI5IiwiOSIsIjkiLCI5IiwiOSIsIjkiXSwiY29tcGlsZV9lcnJvciI6IjAiLCJzeXN0ZW1fZXJyb3IiOiIwIiwiY29tcGlsZV9lcnJvcl9pbmZvIjoiIn0="
            let result2 = JSON.parse(Base64.decode(result));
            for(let i in result2.output) {
                console.log(Base64.decode(result2.output[i]))
                
            }
            this.solution.test[0].output = (Base64.decode(result2.output[0])+"123123123\\n").replaceAll('\\n','\n');
            
        }
    },
    mounted() {
        // 加载数据
        this.queryStatus();
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