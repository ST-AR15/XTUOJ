<template>
    <div class="admin-contest-add" id="admin-contest-add">
        <h2 class="admin-title">创建比赛</h2>
        <a-radio-group style="margin-left:120px;margin-bottom:20px" v-model="createMode">
            <a-radio value="new">新建</a-radio>
            <a-radio value="clone">克隆</a-radio>
        </a-radio-group>
        <div v-if="createMode=='clone'">
            <div style="white-space:nowrap;">
                <a-space>
                    <span>对象比赛ID</span>
                    <a-input></a-input>
                </a-space>
            </div>
            <a-button style="margin-left:218px" type="primary">确认</a-button>
        </div>

        <contestform ref="contestform" okText="创建" @querySubmitForm="querySubmitForm" v-else />
        

        <!-- 比赛添加题目的modal -->
        <a-modal
            :title="'请为刚创建的比赛' + addModal.ID + '添加题目！'"
            :visible="addModal.isVisible"
            @cancel="addModal.isVisible = false"
        >
            <!-- TODO 后续完成这里的添加题目 -->
            <transition-group name="cross">
                <div style="margin-top:5px" v-for="(data,i) in addModal.data" :key="data.key">
                    <a-space>
                        <a-icon :style="{
                            fontSize:'22px',
                            cursor:'pointer',
                            color:i==addModal.data.length-1? 'black':'red',
                            transform:i==addModal.data.length-1?'':'rotate(45deg)',
                            transition: 'all .6s'
                        }" @click="handleQuestion(i)" type="plus-circle" :title="i==addModal.data.length-1?'新增':'删除'" />
                        <a-input style="width:100px;margin:0 5px" v-model="data.ID" @change="queryQuestionTitle(i)" placeholder="题目ID"></a-input>
                        <a-input :value="data.name" placeholder="< 题目名称 >" :disabled="true" v-bind:style="{ 'color': data.isValid? '#52c41a':'#FF0000' }"></a-input>
                    </a-space>
                </div>
            </transition-group>
            <p style="margin-top: 1rem; margin-bottom: 0">当前题目数量：<span v-text="addModal.data.length-1"></span></p>
        </a-modal>
    </div>
</template>

<script>
import { toBinary, timeFormatter } from "@/utils/tools.js"
import contestform from '@/views/components/ContestForm.vue'
export default {
    components: {
        contestform
    },
    data() {
        return {
            createMode: "new",  // new是新建比赛，clone是克隆比赛
            addModal: {
                isVisible: true,
                ID: 0,
                data: [
                    {
                        key: 0,
                        ID: "",
                        name: "",
                        isValid: false,
                    }
                ]
            },
        }
        
    },
    methods: {
        querySubmitForm(info) { // 上传的回调
            const url = "/api/contest"
            const params = {
                Tittle: info.name,
                Defunct: info.defunct,
                ContestType: info.contestType,
                Contestant: info.contestant,
                Language: parseInt(toBinary(info.language, this.$language), 2),
                JudgeWay: info.judge,
                // TODO 这个比赛内容是啥
                Contest: info.contest,
                StartTime: timeFormatter(info.time[0].getTime(), true),
                EndTime: timeFormatter(info.time[1].getTime(), true),
            }
            this.$axios.post(url, params).then(rep => {
                if(parseInt(rep.status/100) == 2) {
                    this.$message.info('创建成功');
                    this.addModal.isVisible = true; // 弹出添加题目的页面
                    //TODO 比赛创建成功最好给我返回这个题目的ID，我能直接让它添加题目
                    this.$refs.contestform.resetForm();
                    // this.resetForm(); // TODO 调用子类的重置表单
                }
            })
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
        
    }
}
</script>

<style>
</style>