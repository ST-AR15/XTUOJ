<template>
    <div class="read" id="read">
        <questionlist ref="questionlist" :buttons="buttons" @getQuestionDetail="getQuestionDetail" @getQuestionData="getQuestionData" @deleteQuestion="deleteQuestion" />
        <!-- 问题详情 - modal对话框 -->
        <a-modal
            :visible="questionDetailModal.visible"
            :title="'问题' + questionDetailModal.questionDetail.ID + ' - ' + questionDetailModal.questionDetail.title + ' - 详情'"
            @cancel="questionDetailModalCancel"
            @ok="submitChange"
            okText="修改"
            :width="1000"
        >
            <a-form-model
                ref="changeForm"
                :model="questionDetailModal.questionDetail"
                :label-col="questionDetailModal.labelCol"
                :wrapper-col="questionDetailModal.wrapperCol"
                :rules="questionDetailModal.rules"
            >
                <a-form-model-item label="ID">
                    <a-input 
                        v-model="questionDetailModal.questionDetail.ID"
                        :disabled="true"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item label="题目名称">
                    <a-input 
                        v-model="questionDetailModal.questionDetail.title"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item label="来源">
                    <a-input 
                        v-model="questionDetailModal.questionDetail.source"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item label="题目内容">
                    <mavonEditor :tabSize="3" v-model="questionDetailModal.questionDetail.content"></mavonEditor>
                </a-form-model-item>
                <a-form-model-item label="时限">
                    <a-input 
                        v-model="questionDetailModal.questionDetail.timeLimit"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item label="存限">
                    <a-input 
                        v-model="questionDetailModal.questionDetail.memoryLimit"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item label="IsBan">
                    <a-switch
                        v-model="questionDetailModal.questionDetail.IsBan"
                    ></a-switch>
                </a-form-model-item>
                <a-form-model-item label="tips">
                    <template v-for="(tip, index) in questionDetailModal.questionDetail.tips">
                        <a-tag :key="tip" closable @close="deleteTip(index)">
                            {{ tip }}
                        </a-tag>
                    </template>
                    <a-input
                        v-if="tipInputVisible"
                        ref="tipInput"
                        type="text"
                        size="small"
                        :style="{ width: '78px' }"
                        :value="inputValue"
                        @change="inputTip"
                        @blur="addTip"
                        @keyup.enter="addTip"
                    />
                    <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                        <a-icon type="plus" /> 新标签
                    </a-tag>
                </a-form-model-item>
            </a-form-model>
            
            
        </a-modal>
        <!-- 数据管理 - modal对话框 -->
        <a-modal
            :visible="questionDataModal.visible"
            :title="'问题' + questionDataModal.ID + ' - ' + questionDataModal.title + ' - 数据管理'"
            @cancel="questionDataModalCancel"
            width= "900px"
        >
            <div v-bind:key="i" v-for="(data,i) in questionDataModal.data.input" style="display:flex;width:700px;margin-bottom: 5px">
                <a-textarea v-model="questionDataModal.data.input[i]"></a-textarea>
                <div style="white-space: nowrap; margin: 0 20px">
                    输入
                    <a-divider type="vertical" />
                    输出
                </div>
                <a-textarea v-model="questionDataModal.data.output[i]"></a-textarea>
            </div>
            <a-divider />
            <div style="display:flex;align-items:center">
                <div style="display:flex;width:700px;flex-shrink:0">
                    <a-textarea v-model="dataInputIn"></a-textarea>
                    <div style="white-space: nowrap; margin: 0 20px">
                        输入
                        <a-divider type="vertical" />
                        输出
                    </div>
                    <a-textarea v-model="dataInputOut"></a-textarea>
                </div>
                <a-button type="primary" style="margin-left: 20px" @click="addData()">添加</a-button>
            </div>
        </a-modal>
    </div>
</template>

<script>
import questionlist from '../components/questionlist.vue'
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
            buttons: [    // 传给questionlist组件的按钮  
                {
                    text: "题目详情",
                    method: "getQuestionDetail"
                },
                {
                    text: "数据管理",
                    method: "getQuestionData"
                },
                {
                    text: "删除题目",
                    method: "deleteQuestion"
                }
            ],
            tipInputVisible: false,  // 添加tip时的input是否出现
            inputValue: "",          // 添加标签时输入的内容
            dataInputIn: "",         // 题目数据 - 输入的输入框
            dataInputOut: "",        // 题目数据 - 输出的输入框
            questionDetailModal : {  // 问题详情的modal
                visible: false,
                questionDetail: {
                    ID: NaN,
                    title: "",
                    tips: [],
                    source: " ",
                    content: "",
                    timeLimit: NaN,
                    memoryLimit: NaN,
                    IsBan: false,
                },
                labelCol: { span: 4 },
                wrapperCol: { span: 19 },
                rules: {                     // 表单规则
                name: [                  // 题目名称规则：比如输入内容，否则提示“请输入题目名称”
                    { required: true, message: '请输入题目名称', trigger: 'change' },
                ],
            },
            },
            questionDataModal: { // 问题数据管理的modal
                visible: false,
                ID: 0,
                title: "",
                data: {},
            },
        }
    },
    methods: {
        handleSearch(selectedKeys, confirm, dataIndex) {  // 搜索
            confirm();
            this.searchText = selectedKeys[0];
            this.searchedColumn = dataIndex;
        },

        handleReset(clearFilters) {   // 重置
            clearFilters();
            this.searchText = '';
        },
        getQuestionDetail(info) {  // 获取题目详情和修改
            let that = this;
            // 使用info.ID来调取题目信息
            let url = "/api/problem/" + info.ID;
            this.$axios.get(url).then(rep => {
                // 把获取到的信息赋值给questionDetail
                const data = rep.data.data;
                that.questionDetailModal.questionDetail.ID = data.Pid;
                that.questionDetailModal.questionDetail.title = data.Tittle;
                that.questionDetailModal.questionDetail.source = data.Source==null? data.Source:"admin";
                that.questionDetailModal.questionDetail.content = data.Content;
                that.questionDetailModal.questionDetail.timeLimit = data.TimeLimit;
                that.questionDetailModal.questionDetail.memoryLimit = data.MemoryLimit;
                that.questionDetailModal.questionDetail.IsBan = data.IsBan;
            })
            this.questionDetailModal.ID = info.ID;
            this.questionDetailModal.title = info.title;
            if(info.tips) {
                this.questionDetailModal.tips = JSON.parse(JSON.stringify(info.tips));
            }
            this.questionDetailModal.visible = true;
            console.log('打开对话框');
        },
        getQuestionData(info) {  //获取题目数据和修改
            this.questionDataModal.ID = info.ID;
            this.questionDataModal.title = info.title;
            // TODO 这个要从后端调取，先随便写个
            this.questionDataModal.data = {
                input: ["2,2","3,3"],
                output: ["3","4"]
            };
            this.questionDataModal.visible = true;
        },
        deleteQuestion(info) { // 删除题目
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
        questionDetailModalCancel() { // 关闭问题详情
            this.questionDetailModal.visible = false;
            console.log('关闭对话框');
        },
        submitChange() { // 提交问题修改
            const url = '/api/problem/' + this.questionDetailModal.questionDetail.ID;
            const info = {
                Tittle: this.questionDetailModal.questionDetail.title,
                Source: this.questionDetailModal.questionDetail.source,
                Content: this.questionDetailModal.questionDetail.content,
                TimeLimit: this.questionDetailModal.questionDetail.timeLimit,
                MemoryLimit: this.questionDetailModal.questionDetail.memoryLimit,
                IsBan: this.questionDetailModal.questionDetail.IsBan,
            }
            console.log(info);
            this.$axios.put(url, info).then(rep => {
                console.log(rep);
            })
        },
        questionDataModalCancel() {   // 关闭数据管理
            this.questionDataModal.visible = false;
            console.log('关闭对话框');
        },
        deleteTip(i) {  // 删除标签
            console.log('删除下标为' + i + '的标签' + this.questionDetailModal.tips[i])
            let tips = this.questionDetailModal.tips;
            tips.splice(i,1);
            this.questionDetailModal.tips = tips;
        },
        showInput() { // 添加标签时显示input
            this.tipInputVisible = true;     // 显示input
            this.$nextTick(function() {      // 聚焦
                this.$refs.tipInput.focus();
            });
        },
        inputTip(e) {  // 添加标签时修改内容
            this.inputValue = e.target.value;
        },
        addTip() { // 添加标签
            this.tipInputVisible = false;     // 去掉input
            if(this.inputValue != "") {       // 空值不要
                this.questionDetailModal.tips.push(this.inputValue);
                this.inputValue = "";
            }
        },
        addData() { // 添加数据
            this.questionDataModal.data.input.push(this.dataInputIn);
            this.dataInputIn = "";
            this.questionDataModal.data.output.push(this.dataInputOut);
            this.dataInputOut = "";
        }
        
    }
}
</script>

<style>
</style>