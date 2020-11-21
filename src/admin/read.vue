<template>
    <div class="read" id="read">
        <a-table
            :columns="columns"
            :data-source="questions"
            style="width:1000px"
            :pagination="pagination"
        >
            <!-- 表头 -->
            <template slot="title">
                Problem List
            </template>
            <!-- 搜索 -->
            <div
                slot="filterDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                style="padding: 8px"
                >
                <a-input
                    v-ant-ref="c => (searchInput = c)"
                    :placeholder="`搜索 ${column.dataIndex}`"
                    :value="selectedKeys[0]"
                    style="width: 188px; margin-bottom: 8px; display: block;"
                    @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                    @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                />
                <a-button
                    type="primary"
                    icon="search"
                    size="small"
                    style="width: 90px; margin-right: 8px"
                    @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                >
                    搜索
                </a-button>
                <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
                    重置
                </a-button>
            </div>
            <!-- 高亮 -->
            <template slot="customRender" slot-scope="text, record, index, column">
                <span v-if="searchText && searchedColumn === column.dataIndex">
                    <template
                    v-for="(fragment, i) in text
                        .toString()
                        .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                    >
                    <mark
                        v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                        :key="i"
                        class="highlight"
                        >{{ fragment }}</mark
                    >
                    <template v-else>{{ fragment }}</template>
                    </template>
                </span>
                <template v-else>
                    {{ text }}
                </template>
            </template>
            <!-- ID -->
            <span slot="ID"></span>
            <span slot="title"></span>
            <!-- 标签 -->
            <span slot="tips" slot-scope="tips" style="float:right">
                <a-tag
                    v-for="(tip,i) in tips"
                    :key="tip"
                    :color="i%2 ? 'geekblue' : 'green'"
                >
                    {{tip}}
                </a-tag>
            </span>
            <!-- AC/Total -->
            <span slot="AT" slot-scope="text, record">
                <span v-text="record.accept"></span>
                /
                <span v-text="record.total"></span>
            </span>
            <!-- 搜索图标 -->
            <a-icon
                slot="filterIcon"
                type="search"
            />
            <!-- 操作 -->
            <span slot="operation" slot-scope="text, record">
                <a-button style="padding:0 10px" type="primary" @click="getQuestionDetail({
                    ID: record.ID,
                    title: record.title,
                    tips: record.tips,
                })">题目详情</a-button>
                <a-divider type="vertical" />
                <a-button style="padding:0 10px" type="primary" @click="getQuestionData({
                    ID: record.ID,
                    title: record.title,
                })">数据管理</a-button>
            </span>
        </a-table>
        <!-- 问题详情 - modal对话框 -->
        <a-modal
            :visible="questionDetailModal.visible"
            :title="'问题' + questionDetailModal.ID + ' - ' + questionDetailModal.title + ' - 详情'"
            @cancel="questionDetailModalCancel"
        >
            <p>
                <span style="margin-right: 30px">ID</span>
                <a-input 
                    v-model="questionDetailModal.ID"
                    :disabled="true"
                    style="width:200px"
                ></a-input>
            </p>
            <p>
                <span style="margin-right: 20px">title</span>
                <a-input 
                    v-model="questionDetailModal.title"
                    style="width:200px"
                ></a-input>
            </p>
            <p>
                <span style="margin-right: 20px">tips</span>
                <template v-for="(tip, index) in questionDetailModal.tips">
                    <a-tag :key="tip" closable @close="deleteTip(index)">
                        {{ tip }}
                    </a-tag>
                </template>
                <a-input
                    v-if="tipInputVisible"
                    ref="tipInput"
                    type="text"
                    size="small"
                    :style="{ width: '78px' }"
                    :value="inputValue"
                    @change="inputTip"
                    @blur="addTip"
                    @keyup.enter="addTip"
                />
                <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                    <a-icon type="plus" /> 新标签
                </a-tag>
            </p>
        </a-modal>
        <!-- 数据管理 - modal对话框 -->
        <a-modal
            :visible="questionDataModal.visible"
            :title="'问题' + questionDataModal.ID + ' - ' + questionDataModal.title + ' - 数据管理'"
            @cancel="questionDataModalCancel"
            width= "900px"
        >
            <div v-bind:key="i" v-for="(data,i) in questionDataModal.data.input" style="display:flex;width:700px;margin-bottom: 5px">
                <a-textarea v-model="questionDataModal.data.input[i]"></a-textarea>
                <div style="white-space: nowrap; margin: 0 20px">
                    输入
                    <a-divider type="vertical" />
                    输出
                </div>
                <a-textarea v-model="questionDataModal.data.output[i]"></a-textarea>
            </div>
            <a-divider />
            <div style="display:flex;align-items:center">
                <div style="display:flex;width:700px;flex-shrink:0">
                    <a-textarea v-model="dataInputIn"></a-textarea>
                    <div style="white-space: nowrap; margin: 0 20px">
                        输入
                        <a-divider type="vertical" />
                        输出
                    </div>
                    <a-textarea v-model="dataInputOut"></a-textarea>
                </div>
                <a-button type="primary" style="margin-left: 20px" @click="addData()">添加</a-button>
            </div>
        </a-modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tipInputVisible: false,  // 添加tip时的input是否出现
            inputValue: "",          // 添加标签时输入的内容
            dataInputIn: "",         // 题目数据 - 输入的输入框
            dataInputOut: "",        // 题目数据 - 输出的输入框
            searchText: "",
            pagination: {       // 页面设置
                pageSize:10,    // 每页题目数量
            },
            questionDetailModal : {  // 问题详情的modal
                visible: false,
                ID: 0,
                title: "",
                tips: [],
            },
            questionDataModal: { // 问题数据管理的modal
                visible: false,
                ID: 0,
                title: "",
                data: {},
            },
            columns: [          // 表格的表头
                {
                    title: "ID",
                    dataIndex: "ID",
                    // sorter: (a,b) => a.ID - b.ID,
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.ID
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: visible => {
                        if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        });
                        }
                    },
                },
                {
                    title: "Title",
                    dataIndex: "title",
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.title
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: visible => {
                        if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        });
                        }
                    },
                },
                {
                    title: "",
                    dataIndex: "tips",
                    scopedSlots: { customRender: 'tips' },
                    filters: [
                        {
                            text: 'dp',
                            value: 'dp'
                        },
                        {
                            text: 'math',
                            value: 'math'
                        },
                    ],
                    onFilter: (value, record) => record.tips.indexOf(value) >= 0,
                },
                {
                    title: "AC/Total",
                    scopedSlots: { customRender: 'AT' },
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: 'operation' },
                }
            ],
            questions: [
                {
                    key: "1000",
                    ID: 1000,
                    title: "A+BA",
                    tips: ["dp","geometry","math","greedy"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1001",
                    ID: 1001,
                    title: "A+BW",
                    tips: ["dp","geometry","math","greedy"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1002",
                    ID: 1002,
                    title: "A+BE",
                    tips: ["dp","geometry","math","greedy"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1003",
                    ID: 1003,
                    title: "A+BR",
                    tips: ["dp","geometry","math","greedy"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1004",
                    ID: 1004,
                    title: "A+BB",
                    tips: ["dp","geometry","math","greedy"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1005",
                    ID: 1005,
                    title: "A+BW",
                    tips: ["dp","geometry","math","greedy"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1006",
                    ID: 1006,
                    title: "A+BF",
                    tips: ["dp","geometry","math","greedy"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1007",
                    ID: 1007,
                    title: "A+B",
                    tips: ["math","greedy"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1008",
                    ID: 1008,
                    title: "A+B",
                    tips: ["dp","geometry"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1009",
                    ID: 1009,
                    title: "A+B",
                    tips: ["math","greedy"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1010",
                    ID: 1010,
                    title: "A+B",
                    tips: ["dp","geometry"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1011",
                    ID: 10011,
                    title: "A+B",
                    tips: ["math","greedy"],
                    accept: 100,
                    total: 200,
                },
                {
                    key: "1012",
                    ID: 1012,
                    title: "A+B",
                    tips: ["dp"],
                    accept: 100,
                    total: 200,
                },
            ]
        }
    },
    methods: {
        handleSearch(selectedKeys, confirm, dataIndex) {  // 搜索
            confirm();
            this.searchText = selectedKeys[0];
            this.searchedColumn = dataIndex;
        },

        handleReset(clearFilters) {   // 重置
            clearFilters();
            this.searchText = '';
        },
        getQuestionDetail(info) {  // 获取题目详情和修改
            // 暂定：info是题目的ID等信息，点击题目详情后会调用API来获取题目的其他详情信息
            this.questionDetailModal.ID = info.ID;
            this.questionDetailModal.title = info.title;
            this.questionDetailModal.tips = JSON.parse(JSON.stringify(info.tips));
            this.questionDetailModal.visible = true;
            console.log('打开对话框');
        },
        getQuestionData(info) {  //获取题目数据和修改
            this.questionDataModal.ID = info.ID;
            this.questionDataModal.title = info.title;
            // todo 这个要从后端调取，先随便写个
            this.questionDataModal.data = {
                input: ["2,2","3,3"],
                output: ["3","4"]
            };
            this.questionDataModal.visible = true;
        },
        questionDetailModalCancel() { // 关闭问题详情
            this.questionDetailModal.visible = false;
            console.log('关闭对话框');
        },
        questionDataModalCancel() {   // 关闭数据管理
            this.questionDataModal.visible = false;
            console.log('关闭对话框');
        },
        deleteTip(i) {  // 删除标签
            console.log('删除下标为' + i + '的标签' + this.questionDetailModal.tips[i])
            let tips = this.questionDetailModal.tips;
            tips.splice(i,1);
            this.questionDetailModal.tips = tips;
        },
        showInput() { // 添加标签时显示input
            this.tipInputVisible = true;     // 显示input
            this.$nextTick(function() {      // 聚焦
                this.$refs.tipInput.focus();
            });
        },
        inputTip(e) {  // 添加标签时修改内容
            this.inputValue = e.target.value;
        },
        addTip() { // 添加标签
            this.tipInputVisible = false;     // 去掉input
            if(this.inputValue != "") {       // 空值不要
                this.questionDetailModal.tips.push(this.inputValue);
                this.inputValue = "";
            }
        },
        addData() { // 添加数据
            this.questionDataModal.data.input.push(this.dataInputIn);
            this.dataInputIn = "";
            this.questionDataModal.data.output.push(this.dataInputOut);
            this.dataInputOut = "";
        }
        
    }
}
</script>

<style>
</style>