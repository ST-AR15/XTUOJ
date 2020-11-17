<template>
    <div class="add" id="add">
        <h2>新增题目</h2>
        <ul>
            <li>
                <span>题目名称</span>
                <a-input :value="name"></a-input>
            </li>
            <li>
                <span>时限</span>
                <a-input 
                    :value="timeLimit"
                    suffix="ms"
                ></a-input>
            </li>
            <li>
                <span>存限</span>
                <a-input
                    :value="storageLimit"
                    suffix="MB"
                ></a-input>
            </li>
            <li>
                <span>题目类型</span>
                <a-radio-group v-model="QType">
                    <a-radio value="normal">普通验证</a-radio>
                    <a-radio value="special">特别验证</a-radio>
                </a-radio-group>
            </li>
            <li>
                <span>题目内容</span>
                <a-textarea
                    :rows="4"
                ></a-textarea>
            </li>
            <li>
                <a-button type="primary">上传</a-button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: "",          // 题目名称
            timeLimit: 1000,   // 时限，默认1000ms
            storageLimit: 128, // 存限，默认128MB
            QType: "normal",   // 题目类型，分普通验证（normal）和特别验证（special），默认普通
        }
    }
}
</script>

<style>
    ul {
        list-style: none;
    }
</style>
