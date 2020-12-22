<template>
    <div class="addContest" id="addcontest">
        <h2 
            style="border-left:10px solid #1890FF; padding-left:5px"
        >
            创建比赛
        </h2>
        <a-radio-group style="margin-left:218px;margin-bottom:20px" v-model="creatMode">
            <a-radio value="new">新建</a-radio>
            <a-radio value="clone">克隆</a-radio>
        </a-radio-group>
        <a-form-model
            ref="addForm"
            :model="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :rules="rules"
            v-show="creatMode=='new'"
        >
            <a-form-model-item label="比赛名称">
                <a-input 
                    v-model="form.name"
                    class="inline-element"
                    placeholder="题目名称"
                ></a-input>
            </a-form-model-item>

            <a-form-model-item label="判题方式">
                <a-radio-group
                    v-model="form.judge"
                >
                    <a-radio value="ICPC">ICPC</a-radio>
                    <a-radio value="OI">OI</a-radio>
                    <a-radio value="HOI">半OI</a-radio>
                    <a-radio value="CF">CF</a-radio>
                </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="允许使用的编译器">
                <a-checkbox-group v-model="form.compiler" :options="compilerList"></a-checkbox-group>
            </a-form-model-item>

            <a-form-model-item label="题目">
                <transition-group name="cross">
                    <!-- 可以把这个div设置成absolute，然后根据i来设置top属性，这样整个动画就能更加连贯 -->
                    <!-- 后续需求如果需要就这样改 -->
                    <div class="contests-question" style="display:flex;align-items:center;margin-top:5px;position:relative" v-for="(data,i) in form.questions" :key="data.T">
                        <a-icon v-bind:style="{
                            fontSize:'22px',
                            cursor:'pointer',
                            color:i==form.questions.length-1? 'black':'red',
                            transform:i==form.questions.length-1?'':'rotate(45deg)',
                            transition: 'all .6s'
                        }" @click="chargeQuestion(i)" type="plus-circle" v-bind:title="i==form.questions.length-1?'新增':'删除'" />
                        <a-input class="inline-element" style="width:100px;margin:0 5px" v-model="data.ID" placeholder="题目ID"></a-input>
                        <a-input class="inline-element" :value="data.name" placeholder="题目名称" :disabled="true"></a-input>
                    </div>
                </transition-group>
                <p>当前题目数量：<span v-text="form.questions.length-1"></span></p>
            </a-form-model-item>

            <a-form-model-item label="参加方式">
                <a-radio-group v-model="form.join">
                    <a-radio value="public">公开</a-radio>
                    <a-radio value="private">私有</a-radio>
                    <a-radio value="group">群组</a-radio>
                </a-radio-group>
                <div v-show="form.join == 'private'">
                    <span>比赛密码:</span>
                    <a-input v-model="form.password" class="inline-element" style="margin-left:10px" placeholder="私有比赛密码"></a-input>
                </div>
            </a-form-model-item>

            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button @click="submitForm" type="primary">上传</a-button>
                <a-button @click="resetForm" style="margin-left:10px;">重置</a-button>
            </a-form-model-item>
        </a-form-model>
        <div v-if="creatMode=='clone'">
            <div class="flex-between" style="white-space:nowrap;margin-left:218px">
                <span>对象比赛ID</span>
                <a-input style="margin-left:20px"></a-input>
            </div>
            <a-button style="margin-left:218px" type="primary">确认</a-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            creatMode: "new",  // new是新建比赛，clone是克隆比赛
            compilerList: ["GCC","Java","C++","Python"],  // 可使用的编译器列表
            isCheckAllCompiler: false, // 目前是否全选编辑器
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form: {
                name: "",
                judge: "ICPC",
                compiler: ["GCC","Java"],
                questions: [
                    {
                        T: 1,
                        ID: 1000,
                        name: "cnm",
                    },
                    {
                        T: 2,
                        ID: 1001,
                        name: "qqq"
                    },
                    {
                        T: 3,
                        ID: 1002,
                        name: "qqqww"
                    },
                ],
                join: "public",
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
        chargeQuestion(i) {  //删除或者添加某个问题
            if(i == this.form.questions.length-1) {  //如果是最后的问题，那就是添加
                let timer = new Date();  // 时间，为后面的T做准备
                this.form.questions.push({
                    T: timer.getTime(),
                    ID: parseInt(this.form.questions[i].ID) + 1,
                    name: ""
                });
            } else {
                this.form.questions.splice(i,1);
            }
        },
        submitForm() { // 上传表单

        },
        resetForm() { // 重置表单
            
        }
    }
}
</script>

<style>
    .addContest ul {
        list-style: none;
        font-size: 18px;
    }
    .addContest .flex-between {
        width: 300px;
        display: flex;
        justify-content: space-between;
        margin: 10px;
    }
    .addContest .inline-element {
        width: 200px;
        display: inline-block;
    }
</style>