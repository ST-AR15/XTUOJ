<template>
    <div class="status" id="status">
        <a-table
            :columns="columns"
            :data-source="status"
            :pagination="pagination"
            :loading="loading"
            rowKey="solutionID"
            @change="handleTableChange"
        >
            <!-- solution -->
            <span 
                slot="solutionID"
                slot-scope="solutionID"
                :style="{ 
                    cursor: isSolution? 'pointer':'default',
                    color: isSolution? '#40A9FF':''
                }"
            >
                <span @click="querySolution(solutionID)" v-text="solutionID"></span>
            </span>
            <!-- 问题ID -->
            <span 
                slot="problemID"
                slot-scope="problemID"
            >
                <span v-if="contestsID == -1" v-text="problemID"></span>
                <span v-else v-text="(questions.findIndex(o => o == problemID) + 10).toString(36).toUpperCase()"></span>
            </span>
            <!-- 运行状态 -->
            <span
                slot="status"
                slot-scope="status" 
            >
                <span v-text="$resultText[status]" :class="status == -1? 'problem-accept': status == 0 || status == -2? 'problem-others': 'problem-wa'"></span>
            </span>
        </a-table>
        <solutionnn
            :visible = "solution.visible"
            width = "1100px"
            :loading = "solution.loading"
            :introduce = "solution.introduce"
            :code = "solution.code"
            :compileError = "solution.compileError"
            :systemError = "solution.systemError"
            :compileErrorInfo = "solution.compileErrorInfo"
            :language = "solution.language"
            :time = "solution.time"
            :memory = "solution.memory"
            :test = "solution.test"
            @cancel = "solution.visible = false"
        />
    </div>
</template>

<script>
import solutionnn from '@/views/components/Solution.vue'
export default {
    components: {
        solutionnn
    },
    props: {
        url: {
            type: String,
            default: "",
        },
        isSolution: {
            type: Boolean,
            default: true,
        },
        contestsID: {
            type: Number,
            default: -1,
        }
    },
    data() {
        return {
            loading: false,
            pagination: {               // 页面设置
                pageSize: 0,            // 每页展示信息数量
                total: 0,               // 总数
                current: 1,             // 当前页
                showQuickJumper: true,  // 快速跳转
            },
            columns: [
                {
                    title: "SolutionID",
                    dataIndex: "solutionID",
                    scopedSlots: { customRender: 'solutionID' },
                },
                {
                    title: "问题ID",
                    dataIndex: "problemID",
                    scopedSlots: { customRender: 'problemID' },
                },
                {
                    title: "用户ID",
                    dataIndex: "userID",
                },
                {
                    title: "运行状态",
                    dataIndex: "status",
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: "Memory",
                    dataIndex: "memory",
                    scopedSlots: { customRender: 'memory' },
                },
                {
                    title: "Time",
                    dataIndex: "time",
                    scopedSlots: { customRender: 'time' },
                },
                {
                    title: "Language",
                    dataIndex: "language",
                },
                {
                    title: "Code Length",
                    dataIndex: "codeLength",
                    scopedSlots: { customRender: 'codeLength' },
                },
                {
                    title: "提交时间",
                    dataIndex: "submitTime"
                }
            ],
            solution: {
                visible: false,
                loading: false,
                introduce: "",
                code: "",
                compileError: false,
                systemError: false,
                compileErrorInfo: "",
                language: "GCC",
                time: 100,
                memory: 100,
                test: []
            },
            status: [],
            questions: [],
        }
    },
    methods: {
        handleTableChange(pagination) {
            const p = pagination.current;
            this.queryPage(p);
        },
        queryPage(p) {
            this.loading = true;
            this.$axios.get(this.url, {
                params: {
                    page: p
                }
            }).then(rep => {
                // 先设置页面信息
                this.pagination.pageSize = rep.data.data.per_page;
                this.pagination.total = rep.data.data.total;
                // 赋值信息
                const data = rep.data.data.data;
                console.log(data);
                for(let i in data) {
                    const item = {
                        solutionID: data[i].Jid,
                        problemID: data[i].c_pid,
                        userID: data[i].Uid,
                        status: data[i].result,
                        memory: data[i].RunMemory,
                        time: data[i].RunTime,
                        language: data[i].Language,
                        codeLength: data[i].CodeLength,
                        submitTime: data[i].created_at,
                    }
                    this.$set(this.status, (p-1)*this.pagination.pageSize + Number(i), item);
                }
                console.log(this.status);
                // 更换页码
                this.pagination.current = Number(p);
                this.loading = false;
            }).catch(e => {
                this.loading = false;
                return e;
            })
        },
        querySolution(solution) {
            if(this.isSolution) {
                // TODO solution
                this.solution.visible = true;
                this.solution.introduce = 'Solution' + solution;
            }
        }
    },
    mounted: function() {
        this.questions = [];
        if(this.contestsID != -1) {
            // 获取题目信息
            const url = `api/contest/${ this.$route.params.CID }/problem`;
            this.$axios.get(url).then(rep => {
                const data = rep.data.data;
                for(let i in data) {
                    this.$set(this.questions, i, data[i].c_pid);
                }
            })
            
        }
        // 获取第一页的数据
        this.queryPage(1);
    }
}
</script>

<style>

</style>