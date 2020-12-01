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
            },
        }
        
    },
    methods: {

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