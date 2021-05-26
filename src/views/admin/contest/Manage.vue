<template>
    <div class="admin-contest-manage" id="admin-contest-manage">
        <!-- TODO 没有重判的接口 -->
        <contestlist ref="contestlist" :buttons="buttons" @queryNamelist="queryNamelist" @queryQuestion="queryQuestion" @queryNotice="queryNotice" @queryDelete="queryDelete" @queryInformation="queryInformation" />
        <!-- 题目管理modal -->
        <a-modal
            :title="'比赛' + questionModal.ID + ' - 题目管理'"
            :visible="questionModal.isVisible"
            @cancel="handleQuestionCancel"
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
                        <a-button type="danger" v-if="i < questionModal.data.length-questionModal.add.length-1" @click="queryRejudge(questionModal.ID,questionModal.data[i].ID)">重判</a-button>
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
        <!-- 管理比赛信息的modal -->
        <a-modal
            :title="'比赛' + informationModal.ID + '信息修改'"
            :visible="informationModal.isVisible"
            @cancel="informationModal.isVisible = false"
            :footer="null"
            :width="1000"
        >
            <contestform okText="修改" :form="informationModal.form" @querySubmitForm="querySubmitForm" />
        </a-modal>
        <!-- 比赛名单的modal -->
        <a-modal
            :title="'比赛' + namelistModal.ID + '名单'"
            :visible="namelistModal.visible"
            @cancel="namelistModal.visible = false"
            @ok="namelistModal.visible = false"
        >
            <a-table
                :data-source="namelistModal.data"
                rowKey="contestID"
                :columns="namelistModal.columns"
                :pagination="false"
                bordered
            >
            </a-table>
        </a-modal>
    </div>
</template>

<script>
import { timeFormatter } from "@/utils/tools.js"
import moment from 'moment'
import 'moment/locale/zh-cn';
import contestform from '@/views/components/ContestForm.vue'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import contestlist from '@/views/components/Contestlist.vue'
export default {
    components: {
        mavonEditor,
        contestlist,
        contestform
    },
    data() {
        return {
            moment,
            buttons: [
                {
                    text: "信息修改",
                    method: "queryInformation"
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
            },
            informationModal: {  // 比赛信息对话框
                isVisible: false,
                ID: 0,
                form: {
                    name: "",
                    defunct: "N",     // 用"N"或者"Y"表示比赛是否屏蔽
                    contestType: 0,   // 比赛类型，0为公开，1为注册，2为私人
                    contestant: 0,    // 0为个人赛，1为团队赛
                    language: [],     // 语言类型
                    judge: "AcmMode", // 判题方式
                    content: "",      // 比赛内容
                    time: [],
                    timePicker: Symbol(1),
                    password: "",
                },
            },
            namelistModal: { // 名单信息对话框
                visible: false,
                ID: 0,
                data: [],
                columns: [
                    {
                        title: "比赛UID",
                        dataIndex: "contestUid"
                    },
                    {
                        title: "UID",
                        dataIndex: "ID"
                    },
                    {
                        title: "学号",
                        dataIndex: "studentID"
                    },
                    {
                        title: "姓名",
                        dataIndex: "name"
                    },
                ]
            }
        }
    },
    methods: {
        querySubmitForm(info) {   // 比赛信息修改回调
            const url = `api/contest/${ this.informationModal.ID }`;
            let language = 0;
            for(let i in info.language) {
                language += this.$language.num[this.$language.name.findIndex(o => o == info.language[i])];
            }
            const params = {
                Tittle: info.name,
                Defunct: info.defunct,
                ContestType: info.contestType,
                Contestant: info.contestant,
                Language: language,
                JudgeWay: info.judge,
                Contest: info.contest,
                StartTime: timeFormatter(info.time[0]._i, true),
                EndTime: timeFormatter(info.time[1]._i, true),
            }
            this.$axios.put(url, params).then(rep => {
                if(parseInt(rep.status/100) == 2) {
                    this.$message.info('修改成功！');
                    this.$refs.contestlist.refresh();
                    this.informationModal.isVisible = false;
                }
            })
        },
        queryInformation(info) {  // 管理比赛信息
            // 获取到当前比赛信息，然后传给form组件
            this.informationModal.isVisible = true;
            this.informationModal.ID = info.ID;
            this.informationModal.form.name = info.tittle;
            // TODO 没有  是否屏蔽 和 比赛内容 的信息 可以在get的那个直接传
            this.informationModal.form.contestType = info.contestType == '公开'? 0: info.contestType == '注册'? 1: 2;
            this.informationModal.form.contestant = info.contestant == '个人赛'? 0: 1;
            // TODO 语言类型和 获取比赛题目的时候好像也没有这个  另外还有判题方式
            this.informationModal.form.time = [moment(info.start), moment(info.end)];
        },
        queryNamelist(info) {  // 管理名单
            // 初始化modal
            this.namelistModal.visible = true;
            this.namelistModal.ID = info.ID;
            this.namelistModal.data = [];
            const url = `/api/match/${ info.ID }/user`;
            this.$axios.get(url).then(rep => {
                const data = rep.data.data;
                for(let i in data) {
                    const item = {
                        ID: data[i].Uid,
                        contestUid: data[i].ContestUid,
                        studentID: data[i].StudentID,
                        name: data[i].Name,
                    }
                    this.$set(this.namelistModal.data, i, item);
                }
            })
        },
        queryRejudge(CID, PID) {  // 题目重判
            const url = `/api/rejudge/contest/${ CID }/problem/${ PID }`;
            // TODO API写的是post,但提示是put
            this.$axios.put(url).then(rep => {
                if(parseInt(rep.status/100) == 2) {
                    this.$message.success(rep.statusText);
                }
            })
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
        queryDelete(info) {  // 删除比赛
            const url = `/api/contest/${ info.ID }`;
            this.$axios.delete(url).then(rep => {
                if(parseInt(rep.status/100) == 2) { // 返回2开头的成功码
                    // 提示操作结果
                    this.$message.info('删除成功');
                    // 刷新表格
                    this.$refs.contestlist.refresh();
                }
            })
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
            this.$axios.post(url, { ProblemId:params }).then(rep => {
                this.$message.success(rep.statusText);
                this.questionModal.isVisible = false;
            }) 
        },
        handleQuestionCancel() {  // 关闭题目管理的modal
            this.questionModal.isVisible = false;
            this.questionModal.data = [
                    {
                        key: 2,
                        ID: "",
                        name: "",
                        isValid: false,
                    }
                ];
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