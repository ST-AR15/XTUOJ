<template>
    <div class="manageContest" id="manageContest">
        <a-table
            :columns="columns"
            :data-source="contests"
            style="width:1000px; background-color:#FCFDFE; margin:20px auto"
            :pagination="pagination"
        >
            <!-- ID -->
            <span slot="ID"></span>
            <span slot="title"></span>
            <!-- 表头 -->
            <template slot="title">
                <h2 style="font-size: 22px">比赛列表</h2>
            </template>
            <!-- 操作 -->
            <span slot="buttons" slot-scope="text, record">
                <a-space>
                    <a-button type="primary" @click="queryNamelist(record.ID)">名单管理</a-button>
                    <a-button type="primary" @click="queryQuestion(record.ID)">题目管理</a-button>
                    <a-button type="primary" @click="queryNotice(record.ID)">发送通知</a-button>
                </a-space>
            </span>
        </a-table>
        <!-- 名单管理modal -->
        <a-modal
            :title="questionModal.ID + '名单管理'"
            :visible="questionModal.isVisible"
            @cancel="questionModal.isVisible = false"
        >
            <transition-group name="cross">
                <div style="margin-top:5px" v-for="(data,i) in questionModal.questionList" :key="data.key">
                    <a-space>
                        <a-icon :style="{
                            fontSize:'22px',
                            cursor:'pointer',
                            color:i==questionModal.questionList.length-1? 'black':'red',
                            transform:i==questionModal.questionList.length-1?'':'rotate(45deg)',
                            transition: 'all .6s'
                        }" @click="handleQuestion(i)" type="plus-circle" :title="i==questionModal.questionList.length-1?'新增':'删除'" />
                        <a-input style="width:100px;margin:0 5px" v-model="data.ID" placeholder="题目ID"></a-input>
                        <a-input :value="data.name" placeholder="题目名称" :disabled="true"></a-input>
                        <a-button type="danger">重判</a-button>
                    </a-space>
                </div>
            </transition-group>
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
export default {
    components: {
        mavonEditor
    },
    data() {
        return {
            pagination: {       // 页面设置
                pageSize:10,    // 每页题目数量
            },
            contests: [         // 表格内容
                {
                    key: "1000",
                    ID: 1000,
                    title: "A+BA",
                    source: "昶浩",
                },
                {
                    key: "1001",
                    ID: 1001,
                    title: "A+BA",
                    source: "昶浩",
                },
            ],
            columns: [          // 表格的表头
                {
                    title: "ID",
                    dataIndex: "ID",
                },
                {
                    title: "比赛名称",
                    dataIndex: "title",
                },
                {
                    title: "发布人",
                    dataIndex: "source"
                },
                {
                    title: "比赛开始时间"
                },
                {
                    title: "总时长"
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: 'buttons' },
                }
            ],
            questionModal: {            // 题目管理对话框的内容
                isVisible: false,
                ID: 1000,
                questionList: [
                    {
                        key: 1,
                        ID: 1000,
                    },
                    {
                        key: 2,
                        ID: 1001,
                    }
                ]
            },
            noticeModal: {      // 发送通知对话框
                isVisible: false,
            }
        }
    },
    methods: {
        queryNamelist(contestID) {  // 管理名单
            console.log(contestID);
        },
        queryQuestion(contestID) { // 管理题目
            console.log(contestID);
            this.questionModal.isVisible = true;
        },
        queryNotice(contestID) { // 发送通知
            this.noticeModal.isVisible = true;
            console.log(contestID);
        },
        // TODO 这里和add一样多一个自动获取题目名字
        handleQuestion(i) { // 修改题目
            if(i == this.questionModal.questionList.length-1) {  //如果是最后的问题，那就是添加
                this.questionModal.questionList.push({
                    key: Symbol(i),
                    ID: parseInt(this.questionModal.questionList[i].ID) + 1,
                    name: ""
                });
            } else {
                this.questionModal.questionList.splice(i,1);
            }
        },
        
    }
}
</script>

<style>
    /* .manageContest .inline-element {
        width: 200px;
        display: inline-block;
    } */
</style>