<template>
    <div class="admin-contest-add" id="admin-contest-add">
        <h2 class="admin-title">创建比赛</h2>
        <a-radio-group style="margin-left:120px;margin-bottom:20px" v-model="createMode">
            <a-radio value="new">新建</a-radio>
            <a-radio value="clone">克隆</a-radio>
        </a-radio-group>
        <a-form-model
            ref="addForm"
            :model="form"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 12 }"
            :rules="rules"
            v-show="createMode=='new'"
        >
            <a-form-model-item label="比赛名称">
                <a-input 
                    style="width: 210px"
                    v-model="form.name"
                    placeholder="题目名称"
                ></a-input>
            </a-form-model-item>

            <a-form-model-item label="是否屏蔽">
                <a-radio-group
                    v-model="form.defunct"
                >
                    <a-radio value="Y">是</a-radio>
                    <a-radio value="N">否</a-radio>
                </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="参加方式">
                <a-radio-group v-model="form.contestType">
                    <a-radio :value="0">公开</a-radio>
                    <a-radio :value="1">注册</a-radio>
                    <a-radio :value="2">私人</a-radio>
                </a-radio-group>
            </a-form-model-item>

            <transition name="cross">
                <a-form-model-item label="比赛密码" v-show="form.contestType == '1'">
                    <a-input v-model="form.password" placeholder="私有比赛密码"></a-input>
                </a-form-model-item>
            </transition>

            <a-form-model-item label="比赛形式">
                <a-radio-group
                    v-model="form.contestant"
                >
                    <a-radio :value="0">个人赛</a-radio>
                    <a-radio :value="1">团队赛</a-radio>
                </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="语言类型">
                <a-checkbox-group v-model="form.language" :options="this.$language"></a-checkbox-group>
            </a-form-model-item>

            <a-form-model-item label="判题方式">
                <a-radio-group
                    v-model="form.judge"
                >
                    <a-radio value="AcmMode">AcmMode</a-radio>
                    <a-radio value="OiMode">OiMode</a-radio>
                    <a-radio value="HalfOiMode">HalfOiMode</a-radio>
                </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="比赛内容">
                <a-input v-model="form.contest"></a-input>
            </a-form-model-item>

            <a-form-model-item label="比赛时间">
                <a-range-picker
                    style="width: 500px"
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    :placeholder="['开始时间', '结束时间']"
                    @ok="handleTime"
                />
            </a-form-model-item>

            <!-- <a-form-model-item label="题目">
                <transition-group name="cross">
                    <div class="contests-question" style="display:flex;align-items:center;margin-top:5px;position:relative" v-for="(data,i) in form.questions" :key="data.key">
                        <a-icon :style="{
                            fontSize:'22px',
                            cursor:'pointer',
                            color:i==form.questions.length-1? 'black':'red',
                            transform:i==form.questions.length-1?'':'rotate(45deg)',
                            transition: 'all .6s'
                        }" @click="handleQuestion(i)" type="plus-circle" v-bind:title="i==form.questions.length-1?'新增':'删除'" />
                        <a-input style="width:100px;margin:0 5px" @change="queryTitle(i)" v-model="data.ID" placeholder="题目ID"></a-input>
                        <a-input style="width: 210px" :value="data.name" placeholder="< 题目名称 >" :disabled="true" v-bind:style="{ 'color': data.isValid? '#52c41a':'#FF0000' }"></a-input>
                    </div>
                </transition-group>
                <p>当前题目数量：<span v-text="form.questions.length-1"></span></p>
            </a-form-model-item> -->

            
            

            <a-divider />

            <a-form-model-item :wrapper-col="{ span: 4, offset: 2 }">
                <a-button @click="submitForm" type="primary">创建</a-button>
                <a-button @click="resetForm" type="danger" style="margin-left:10px;">重置</a-button>
            </a-form-model-item>
        </a-form-model>
        <div v-if="createMode=='clone'">
            <div style="white-space:nowrap;margin-left:218px">
                <a-space>
                    <span>对象比赛ID</span>
                    <a-input></a-input>
                </a-space>
            </div>
            <a-button style="margin-left:218px" type="primary">确认</a-button>
        </div>
    </div>
</template>

<script>
import { toBinary, timeFormatter } from "@/utils/tools.js"
export default {
    data() {
        return {
            createMode: "new",  // new是新建比赛，clone是克隆比赛
            form: {
                name: "",
                defunct: "N",     // 用"N"或者"Y"表示比赛是否屏蔽
                contestType: 0,   // 比赛类型，0为公开，1为注册，2为私人
                contestant: 0,    // 0为个人赛，1为团队赛
                language: [],     // 语言类型
                judge: "AcmMode", // 判题方式
                content: "",      // 比赛内容
                // TODO 这个比赛内容是什么？
                time: [],
                // questions: [
                //     {
                //         key: 0,
                //         ID: "",
                //         name: "",
                //         isValid: false,
                //     }
                // ],
                password: "",
            },
            rules: {                     // 表单规则
                name: [                  // 题目名称规则：比如输入内容，否则提示“请输入题目名称”
                    { required: true, message: '请输入比赛名称', trigger: 'change' },
                ],
            },
        }
        
    },
    methods: {
        handleTime(e) {
            this.form.time[0] = e[0]._d;
            this.form.time[1] = e[1]._d;
        },
        handleQuestion(i) {  //删除或者添加某个问题
            if(i == this.form.questions.length-1) {  //如果是最后的问题，那就是添加
                // 只有isValid为true才允许添加
                if(this.form.questions[i].isValid) {
                    this.form.questions.push({
                        key: Symbol(i),
                        ID: parseInt(this.form.questions[i].ID) + 1,
                        name: "",
                        isValid: false,
                    });
                    this.queryTitle(i+1);
                } else {
                    this.$message.warn('这道题是无效的！');
                }
            } else {
                this.form.questions.splice(i,1);
            }
        },
        queryTitle(i) {
            // 获取题目名字
            // 限定四位数
            if(this.form.questions[i].ID/1000 >= 1 && this.form.questions[i].ID/1000 < 10) {
                this.form.questions[i].name = "< 查询中…… >";
                let url = "/api/problem/" + this.form.questions[i].ID;
                this.$axios.get(url).then(rep => {
                    this.form.questions[i].name = rep.data.data.Tittle;
                    this.form.questions[i].isValid = true;
                }).catch(err => {
                    this.form.questions[i].name = "< 题目无效 >";
                    this.form.questions[i].isValid = false;
                    throw err;
                })
            } else {
                // 如果不是四位，就清空内容
                this.form.questions[i].name = "";
                this.form.questions[i].isValid = false;
            }
            
            
        },
        submitForm() { // 上传表单
            // TODO 接口用不了
            const url = "/api/contest"
            const info = {
                Tittle: this.form.name,
                Defunct: this.form.defunct,
                ContestType: this.form.contestType,
                Contestant: this.form.contestant,
                Language: toBinary(this.form.language, this.$language),
                JudegWay: this.form.judge,
                Contest: this.form.contest,
                // TODO 问一下这个date数据类型
                StartTime: timeFormatter(this.form.time[0].getTime(), true),
                EndTime: timeFormatter(this.form.time[1].getTime(), true),
            }
            console.log(info);
            this.$axios.post(url, info).then(rep => {
                console.log(rep);
            })
        },
        resetForm() { // 重置表单
            
        }
    }
}
</script>

<style>
</style>