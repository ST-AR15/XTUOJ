<template>
    <div class="read" id="read">
        <questionlist :buttons="buttons" @getQuestionDetail="getQuestionDetail" @getQuestionData="getQuestionData" />
        <!-- 问题详情 - modal对话框 -->
        <a-modal
            :visible="questionDetailModal.visible"
            :title="'问题' + questionDetailModal.ID + ' - ' + questionDetailModal.title + ' - 详情'"
            @cancel="questionDetailModalCancel"
        >
            <p>
                <span style="margin-right: 30px">ID</span>
                <a-input 
                    v-model="questionDetailModal.ID"
                    :disabled="true"
                    style="width:200px"
                ></a-input>
            </p>
            <p>
                <span style="margin-right: 20px">title</span>
                <a-input 
                    v-model="questionDetailModal.title"
                    style="width:200px"
                ></a-input>
            </p>
            <p>
                <span style="margin-right: 20px">tips</span>
                <template v-for="(tip, index) in questionDetailModal.tips">
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
            </p>
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
export default {
    components: {
        questionlist,
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
            ],
            tipInputVisible: false,  // 添加tip时的input是否出现
            inputValue: "",          // 添加标签时输入的内容
            dataInputIn: "",         // 题目数据 - 输入的输入框
            dataInputOut: "",        // 题目数据 - 输出的输入框
            questionDetailModal : {  // 问题详情的modal
                visible: false,
                ID: 0,
                title: "",
                tips: [],
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
            // 暂定：info是题目的ID等信息，点击题目详情后会调用API来获取题目的其他详情信息
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
            // todo 这个要从后端调取，先随便写个
            this.questionDataModal.data = {
                input: ["2,2","3,3"],
                output: ["3","4"]
            };
            this.questionDataModal.visible = true;
        },
        questionDetailModalCancel() { // 关闭问题详情
            this.questionDetailModal.visible = false;
            console.log('关闭对话框');
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