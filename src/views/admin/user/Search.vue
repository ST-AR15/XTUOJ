<template>
    <div class="admin-user-search" id="admin-user-search">
        <a-spin :spinning="loading">
            <h2 class="admin-title">搜索用户</h2>
            <a-space style="margin-left: 20px">
                <span>查询ID</span>
                <a-input v-model="id" placeholder="请输入对方的ID" @pressEnter="queryInfo()"></a-input>
                <a-button type="primary" @click="queryInfo()">查询</a-button>
            </a-space>
            <a-descriptions v-if="name" title="查询结果" bordered style="width: 800px; margin: 20px">
                <a-descriptions-item label="姓名">{{ name }}</a-descriptions-item>
                <a-descriptions-item label="专业">{{ profession }}</a-descriptions-item>
                <a-descriptions-item label="年龄" v-if="studentID">{{ age }}</a-descriptions-item>
                <a-descriptions-item label="学号" v-if="studentID">{{ studentID }}</a-descriptions-item>
                <a-descriptions-item label="身份" v-if="studentID">{{ role }}</a-descriptions-item>
                <a-descriptions-item label="邮箱" v-if="studentID">{{ email }}</a-descriptions-item>
                <a-descriptions-item label="创建时间" v-if="studentID">{{ createTime }}</a-descriptions-item>
                <a-descriptions-item label="更新时间" v-if="studentID">{{ updateTime }}</a-descriptions-item>
            </a-descriptions>
        </a-spin>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            id: '',
            name: '',
            profession: '',
            age: '',
            studentID: '',
            role: '',
            email: '',
            createTime: '',
            updateTime: '',
        }
    },
    methods: {
        queryInfo() {
            this.loading = true;
            let url = "/api/users/" + this.id;
            this.$axios.get(url).then(rep => {
                let data = rep.data.data;
                // 赋值
                console.log(rep);
                try {
                    [this.name, this.age, this.studentID, this.profession, this.role, this.email, this.createTime, this.updateTime] = 
                    [data.Name, data.Age, data.StudentID, data.Profession, data.Role, data.email, data.created_at, data.updated_at];
                }catch {
                    this.$message.info('查无此人');
                }
                this.loading = false;
            })
        }
    }
}
</script>

<style>
.user-search h2 {
    border-left: 10px solid rgb(24, 144, 255);
    padding-left: 5px;
}
.user-search p {
    margin: 20px;
}
</style>