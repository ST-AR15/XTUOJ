<template>
    <div class="admin-contest-manage" id="admin-contest-manage">
        <!-- TODO 没有重判的接口 -->
        <contestlist ref="contestlist" :buttons="buttons" @queryNamelist="queryNamelist" @queryQuestion="queryQuestion" @queryNotice="queryNotice" @queryDelete="queryDelete" />
        <!-- 题目管理modal -->
        <a-modal
            :title="'比赛' + questionModal.ID + ' - 题目管理'"
            :visible="questionModal.isVisible"
            @cancel="questionModal.isVisible = false"
            @ok="queryQuestionAdd"
        >
            <a-spin v-if="questionModal.isLoading" :spinning="true"></a-spin>
            <transition-group name="cross2">
                <div style="margin-top:5px" v-for="(data,i) in questionModal.data" :key="data.key">
                    <a-space v-if="!questionModal.isLoading">
                        <a-icon :style="{
                            fontSize:'22px',
                            cursor:'pointer',
                            color:i==questionModal.data.length-1? 'black':'red',
                            transform:i==questionModal.data.length-1?'':'rotate(45deg)',
                            transition: 'all .6s'
                        }" @click="handleQuestion(i)" type="plus-circle" :title="i==questionModal.data.length-1?'新增':'删除'" />
                        <a-input style="width:100px;margin:0 5px" v-model="data.ID" @change="queryQuestionTitle(i)" placeholder="题目ID"></a-input>
                        <a-input :value="data.name" placeholder="< 题目名称 >" :disabled="true" v-bind:style="{ 'color': data.isValid? '#52c41a':'#FF0000' }"></a-input>
                    </a-space>
                </div>
            </transition-group>
            <p style="margin-top: 1rem; margin-bottom: 0">当前题目数量：<span v-text="questionModal.data.length-1"></span></p>
        </a-modal>
        <!-- 发送通知modal -->
        <a-modal
            title="发送通知"
            :visible="noticeModal.isVisible"
            @cancel="noticeModal.isVisible = false"
        >
            <mavon-editor :tabSize="3"></mavon-editor>
        </a-modal>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import contestlist from '@/views/components/Contestlist.vue'
export default {
    components: {
        mavonEditor,
        contestlist
    },
    data() {
        return {
            buttons: [
                {
                    text: "信息修改",
                },
                {
                    text: "名单管理",
                    method: "queryNamelist",
                },
                {
                    text: "题目管理",
                    method: "queryQuestion"
                },
                {
                    text: "发送通知",
                    method: "queryNotice"
                },
                {
                    text: "重判",
                    isDanger: true,
                },
                {
                    text: "删除比赛",
                    isDanger: true,
                    method: "queryDelete"
                }
            ],
            questionModal: {            // 题目管理对话框的内容
                isLoading: false,
                isVisible: false,
                ID: 1000,
                data: [
                    {
                        key: 2,
                        ID: "",
                        name: "",
                        isValid: false,
                    }
                ],
                add: [],
            },
            noticeModal: {      // 发送通知对话框
                isVisible: false,
            }
        }
    },
    methods: {
        queryNamelist(info) {  // 管理名单
            console.log(info.ID);
        },
        queryQuestion(info) { // 管理题目
            // 先把原数组清空
            this.questionModal.data = [
                {
                    key: 2,
                    ID: "",
                    name: "",
                    isValid: false,
                }
            ];
            // 修改ID
            this.questionModal.ID = info.ID;
            // 显示
            this.questionModal.isVisible = true;
            // 开始加载
            this.questionModal.isLoading = true;
            // 把现有的题目加上去
            const url = `/api/contest/${ info.ID }/problem`
            this.$axios.get(url).then(rep => {
                const data = rep.data.data;
                for(let i in data) {
                    // 从后往前
                    let question = {
                        key: Symbol(i),
                        ID: data[data.length-1-i].c_pid,
                        name: data[data.length-1-i].Tittle,
                        isValid: true,
                    };
                    this.questionModal.data.unshift(question);
                }
                this.questionModal.isLoading = false; // 结束加载
            });
        },
        queryDelete(info) {  // 删除题目
            const url = `/api/contest/${ info.ID }`;
            this.$axios.delete(url).then(rep => {
                if(parseInt(rep.status/100) == 2) { // 返回2开头的成功码
                    // 提示操作结果
                    this.$message.info('删除成功');
                    // 刷新表格
                    this.$refs.contestlist.refresh();
                }
            })
            console.log(info);
        },
        handleQuestion(i) { // 修改题目
            if(i == this.questionModal.data.length-1) {  //如果是最后的问题，那就是添加
                // 只有isValid为true才允许添加
                if(this.questionModal.data[i].isValid) {
                    // add数组增加
                    this.questionModal.add.push(parseInt(this.questionModal.data[i].ID));
                    // data数组新增一项
                    this.questionModal.data.push({
                        key: Symbol(i),
                        ID: parseInt(this.questionModal.data[i].ID) + 1,
                        name: "",
                        isValid: false,
                    });
                    this.queryQuestionTitle(i+1);
                } else {
                    this.$message.warn('这道题是无效的！');
                }
            } else {
                if(this.questionModal.add.find(o => o == this.questionModal.data[i].ID)) {
                    this.questionModal.add.splice(this.questionModal.add.findIndex(o => o == this.questionModal.data[i].ID), 1);
                    this.questionModal.data.splice(i,1);
                } else {
                    this.$message.error('无法删除曾经添加过的题目')
                }
            }
            //TODO 好像没有删除题目啊
        },
        queryQuestionAdd() { // 上传添加题目
            const url = `/api/contest/${ this.questionModal.ID }/problem`;
            let params = JSON.stringify({data: this.questionModal.add});
            console.log(params);
            this.$axios.post(url, params).then(rep => {
                // TODO 无法使用
                console.log(rep);
            }) 
        },
        queryQuestionTitle(i) {  // 获取题目名字
            // 限定四位数
            if(this.questionModal.data[i].ID/1000 >= 1 && this.questionModal.data[i].ID/1000 < 10) {
                this.questionModal.data[i].name = "< 查询中…… >";
                let url = "/api/problem/" + this.questionModal.data[i].ID;
                this.$axios.get(url).then(rep => {
                    this.questionModal.data[i].name = rep.data.data.Tittle;
                    this.questionModal.data[i].isValid = true;
                }).catch(err => {
                    this.questionModal.data[i].name = "< 题目无效 >";
                    this.questionModal.data[i].isValid = false;
                    throw err;
                })
            } else {
                // 如果不是四位，就清空内容
                this.questionModal.data[i].name = "";
                this.questionModal.data[i].isValid = false;
            }
        },
        queryNotice(contestID) { // 发送通知
            this.noticeModal.isVisible = true;
            console.log(contestID);
        },
        
        
    }
}
</script>

<style>
</style>