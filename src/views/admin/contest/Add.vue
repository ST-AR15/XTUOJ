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
            </a-form-model-item>

            <a-form-model-item label="参加方式">
                <a-radio-group v-model="form.join">
                    <a-radio value="public">公开</a-radio>
                    <a-radio value="private">私有</a-radio>
                    <a-radio value="group">群组</a-radio>
                </a-radio-group>
            </a-form-model-item>

            <transition name="cross">
                <a-form-model-item label="比赛密码" v-show="form.join == 'private'">
                    <a-input v-model="form.password" placeholder="私有比赛密码"></a-input>
                </a-form-model-item>
            </transition>
            

            <a-divider />

            <a-form-model-item :wrapper-col="{ span: 4, offset: 2 }">
                <a-button @click="submitForm" type="primary">上传</a-button>
                <a-button @click="resetForm" style="margin-left:10px;">重置</a-button>
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
export default {
    data() {
        return {
            createMode: "new",  // new是新建比赛，clone是克隆比赛
            compilerList: ["GCC","Java","C++","Python"],  // 可使用的编译器列表
            form: {
                name: "",
                judge: "ICPC",
                compiler: ["GCC","Java"],
                questions: [
                    {
                        key: 0,
                        ID: "",
                        name: "",
                        isValid: false,
                    }
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

        },
        resetForm() { // 重置表单
            
        }
    }
}
</script>

<style>
</style>