<template>
    <div class="addContest" id="addcontest">
        <h2 
            style="border-left:10px solid #1890FF; padding-left:5px"
        >
            创建比赛
        </h2>
        <a-form-model
            ref="addForm"
            :model="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
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

            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button @click="submitForm" type="primary">上传</a-button>
                <a-button @click="resetForm" style="margin-left:10px;">重置</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
export default {
    data() {
        return {
            compilerList: ["GCC","Java","C++","Python"],  // 可使用的编译器列表
            isCheckAllCompiler: false, // 目前是否全选编辑器
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form: {
                name: "比赛",
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
            },
        }
        
    },
    methods: {
        chargeQuestion(i) {  //删除或者添加某个问题
            if(i == this.form.questions.length-1) {  //如果是最后的问题，那就是添加
                this.form.questions.push({
                    T: this.form.questions[i].ID + 1,
                    ID: this.form.questions[i].ID + 1,
                    name: ""
                })
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