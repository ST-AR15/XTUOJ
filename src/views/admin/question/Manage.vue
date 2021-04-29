<template>
    <div class="admin-question-manage" id="admin-question-manage">
        <questionlist ref="questionlist" :buttons="buttons" @queryDetail="queryDetail" @queryData="queryData" @queryDelete="queryDelete" @queryCompilation = "queryCompilation" />
        <!-- 问题详情 - modal对话框 -->
        <a-modal
            :visible="detailModal.visible"
            :title="'问题' + detailModal.data.ID + ' - ' + detailModal.data.title + ' - 详情'"
            @cancel="detailModal.visible = false"
            @ok="querySubmit"
            okText="修改"
            :width="1000"
        >
            <a-form-model
                ref="changeForm"
                :model="detailModal.data"
                :label-col="detailModal.labelCol"
                :wrapper-col="detailModal.wrapperCol"
                :rules="detailModal.rules"
            >
                <a-form-model-item label="ID">
                    <a-input 
                        v-model="detailModal.data.ID"
                        :disabled="true"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item label="题目名称">
                    <a-input 
                        v-model="detailModal.data.title"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item label="来源">
                    <a-input 
                        v-model="detailModal.data.source"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item label="题目内容">
                    <mavonEditor :tabSize="3" v-model="detailModal.data.content"></mavonEditor>
                </a-form-model-item>
                <a-form-model-item label="时限">
                    <a-input 
                        v-model="detailModal.data.timeLimit"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item label="存限">
                    <a-input 
                        v-model="detailModal.data.memoryLimit"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item label="IsBan">
                    <a-switch
                        v-model="detailModal.data.IsBan"
                    ></a-switch>
                </a-form-model-item>
                <a-form-model-item label="题目类型">
                    <a-radio-group 
                        v-model="detailModal.data.QType"
                    >
                        <a-radio value="normal">普通验证</a-radio>
                        <a-radio value="special">特别验证</a-radio>
                    </a-radio-group>
                    <transition name="cross2">
                        <a-button type="primary" v-if="detailModal.data.QType == 'special'">上传特判文件</a-button>
                    </transition>
                </a-form-model-item>
                <a-form-model-item label="tips">
                    <template v-for="(tip, index) in detailModal.data.tips">
                        <a-tag :key="tip" closable @close="queryTipDelete(index)">
                            {{ tip }}
                        </a-tag>
                    </template>
                    <a-input
                        v-if="tipInput.visible"
                        ref="tipInput"
                        type="text"
                        size="small"
                        :style="{ width: '78px' }"
                        :value="tipInput.value"
                        @change="inputTip"
                        @blur="queryTipAdd"
                        @keyup.enter="queryTipAdd"
                    />
                    <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                        <a-icon type="plus" /> 新标签
                    </a-tag>
                </a-form-model-item>
            </a-form-model>
            
            
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
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { message } from 'ant-design-vue'
export default {
    components: {
        questionlist,
        mavonEditor
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
                    text: "删除题目",
                    method: "queryDelete",
                    isDanger: true,
                },
            ],
            detailModal : {          // 问题详情的modal
                visible: false,
                data: {
                    ID: NaN,
                    title: "",
                    tips: [],
                    source: " ",
                    content: "",
                    timeLimit: NaN,
                    memoryLimit: NaN,
                    IsBan: false,
                    QType: "",
                },
                labelCol: { span: 4 },
                wrapperCol: { span: 19 },
                rules: {                     // 表单规则
                    name: [                  // 题目名称规则：比如输入内容，否则提示“请输入题目名称”
                        { required: true, message: '请输入题目名称', trigger: 'change' },
                    ],
                },
            },
            tipInput: {              // 问题详情的标签input
                visible: false,
                value: "",
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
            let that = this;
            // 使用info.ID来调取题目信息
            let url = "/api/problem/" + info.ID;
            this.$axios.get(url).then(rep => {
                // 把获取到的信息赋值给questionDetail
                const data = rep.data.data;
                that.detailModal.data.ID = data.Pid;
                that.detailModal.data.title = data.Tittle;
                that.detailModal.data.source = data.Source==null? data.Source:"admin";
                that.detailModal.data.content = data.Content;
                that.detailModal.data.timeLimit = data.TimeLimit;
                that.detailModal.data.memoryLimit = data.MemoryLimit;
                that.detailModal.data.IsBan = data.IsBan;
                that.detailModal.data.QType = "normal"
            })
            this.detailModal.ID = info.ID;
            this.detailModal.title = info.title;
            if(info.tips) {
                this.detailModal.tips = JSON.parse(JSON.stringify(info.tips));
            }
            this.detailModal.visible = true;
            console.log('打开对话框');
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
        queryCompilation() { // 获取编译信息
            this.compilationModal.visible = true;
        },
        querySubmit() { // 提交问题修改
            const url = '/api/problem/' + this.detailModal.data.ID;
            const info = {
                Tittle: this.detailModal.data.title,
                Source: this.detailModal.data.source,
                Content: this.detailModal.data.content,
                TimeLimit: this.detailModal.data.timeLimit,
                MemoryLimit: this.detailModal.data.memoryLimit,
                IsBan: this.detailModal.data.IsBan,
            }
            console.log(info);
            this.$axios.put(url, { params: info }).then(rep => {
                console.log(rep);
                this.$message.success("修改成功！");
            })
        },
        queryTipDelete(i) {  // 删除标签
            console.log('删除下标为' + i + '的标签' + this.detailModal.data.tips[i])
            let tips = this.detailModal.data.tips;
            tips.splice(i,1);
            this.detailModal.data.tips = tips;
        },
        queryTipAdd() { // 添加标签
            this.tipInput.visible = false;     // 去掉input
            if(this.tipInput.value != "") {       // 空值不要
                this.detailModal.data.tips.push(this.tipInput.value);
                this.tipInput.value = "";
            }
        },
        showInput() { // 添加标签时显示input
            this.tipInput.visible = true;     // 显示input
            this.$nextTick(function() {      // 聚焦
                this.$refs.tipInput.focus();
            });
        },
        inputTip(e) {  // 添加标签时修改内容
            this.tipInput.value = e.target.value;
        },
        
        
        
    }
}
</script>

<style>
</style>