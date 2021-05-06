<template>
    <div class="admin-contest-form">
        <a-form-model
            ref="addForm"
            :model="form"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 12 }"
            :rules="rules"
        >
            <a-form-model-item prop="name" label="比赛名称">
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

            <a-form-model-item prop="language" label="语言类型">
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
                    :key="form.timePicker"
                    style="width: 500px"
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    :placeholder="['开始时间', '结束时间']"
                    @ok="handleTime"
                />
            </a-form-model-item>
            
            <a-divider />
            
            <a-form-model-item :wrapper-col="{ span: 4, offset: 2 }">
                <a-button @click="submitForm" type="primary">{{ okText }}</a-button>
                <a-button @click="resetForm" type="danger" style="margin-left:10px;">重置</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
// import { toBinary, timeFormatter } from "@/utils/tools.js"
import moment from 'moment'
import 'moment/locale/zh-cn';
export default {
    props: {
        okText: {
            type: String,
            default: "确认"
        },
        form: {
            type: Object,
            default: function() {
                return {
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
                }
            },
        }
    },
    data() {
        return {
            moment,
            // form: {
            //     name: "",
            //     defunct: "N",     // 用"N"或者"Y"表示比赛是否屏蔽
            //     contestType: 0,   // 比赛类型，0为公开，1为注册，2为私人
            //     contestant: 0,    // 0为个人赛，1为团队赛
            //     language: [],     // 语言类型
            //     judge: "AcmMode", // 判题方式
            //     content: "",      // 比赛内容
            //     // TODO 这个比赛内容是什么？
            //     time: [],
            //     timePicker: Symbol(1),
            //     // questions: [
            //     //     {
            //     //         key: 0,
            //     //         ID: "",
            //     //         name: "",
            //     //         isValid: false,
            //     //     }
            //     // ],
            //     password: "",
            // },
            formDefault: {
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
            rules: {                     // 表单规则
                name: [                  // 题目名称规则：比如输入内容，否则提示“请输入题目名称”
                    { required: true, message: '请输入比赛名称', trigger: 'change' },
                ],
                language: [  // 语言类型需求
                    { required: true, message: '请选择语言类型', trigger: 'change' },
                ],
                // time: [  // 语言类型需求
                //     { required: true, message: '请选择比赛时间', trigger: 'change' },
                // ],
            },
        }
    },
    methods: {
        handleTime(e) {
            this.form.time = e;
        },
        submitForm() { // 创建比赛 - 上传表单
            this.$refs.addForm.validate(valid => {
                if(valid) {
                    this.$emit('querySubmitForm', this.form);
                } else {
                    return false;
                }
            })
        },
        resetForm() { // 重置表单
            this.form = JSON.parse(JSON.stringify(this.formDefault));
        }
    },
}
</script>

<style>

</style>