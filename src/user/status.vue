<template>
    <div class="status" id="status">
        <a-table
            :columns="columns"
            :data-source="status"
            style="width:1000px; background-color:#FCFDFE; margin:20px auto"
            :pagination="pagination"
        >
            <!-- 搜索 -->
            <div
                slot="filterDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                style="padding: 8px"
                >
                <a-input
                    v-ant-ref="c => (searchInput = c)"
                    :placeholder="`搜索 ${column.title}`"
                    :value="selectedKeys[0]"
                    style="width: 188px; margin-bottom: 8px; display: block;"
                    @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                    @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                />
                <a-button
                    size="small"
                    style="width: 90px; margin-right: 8px;"
                    @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                    type="green"
                >
                    搜索
                    <a-icon type="search" />
                </a-button>
                <a-button 
                    type="primary"
                    size="small"
                    style="width: 90px" 
                    @click="() => handleReset(clearFilters)"
                >
                    重置
                    <a-icon type="sync" />
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
            <!-- 运行状态 -->
            <a-popover style="cursor: pointer" slot="status" slot-scope="status" title="编译信息">
                <template slot="content">
                    <p>编译错误啦哈哈哈</p>
                </template>
                <span v-text="status" v-bind:class="status=='Accept'? 'accept':status=='Wrong Answer'? 'wa':'others'"></span>
            </a-popover>
            <!-- Memory -->
            <span slot="memory" slot-scope="memory">
                <span v-text="memory"></span>
                <span> MB</span>
            </span>
            <!-- Time -->
            <span slot="time" slot-scope="time" style="white-space:nowrap">
                <span v-text="time"></span>
                <span> ms</span>
            </span>
            <!-- 代码长度（codeLength） -->
            <span 
                slot="codeLength" 
                slot-scope="codeLength" 
                v-bind:title="true? '点击查看代码':''" 
                v-bind:style="{ 
                    cursor: true? 'pointer':'default',
                    color: true? '#40A9FF':'#000000'
                }"
            >
                <span v-text="codeLength"></span>
                <span> b</span>
            </span>
        </a-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchText: "",
            pagination: {               // 页面设置
                pageSize: 10,           // 每页展示信息数量
                showQuickJumper: true,  // 快速跳转
            },
            columns: [
                {
                    title: "SolutionID",
                    dataIndex: "solutionID",
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
                    title: "问题ID",
                    dataIndex: "problemID",
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
                    title: "用户ID",
                    dataIndex: "userID",
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
                    title: "运行状态",
                    dataIndex: "status",
                    scopedSlots: { 
                        customRender: 'status',
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
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
                    title: "Code Length",
                    dataIndex: "codeLength",
                    scopedSlots: { customRender: 'codeLength' },
                },
                {
                    title: "提交时间",
                    dataIndex: "submitTime"
                }
            ],
            status: [
                {
                    key: "1000000",
                    solutionID: 1000000,
                    problemID: 1000,
                    userID: 201705551222,
                    status: "Accept",
                    memory: 128,
                    time: 32,
                    language: "javascript",
                    codeLength: 256,
                    submitTime: Date(),
                },
                {
                    key: "1000001",
                    solutionID: 1000001,
                    problemID: 1001,
                    userID: 201705551224,
                    status: "Wrong Answer",
                    memory: 128,
                    time: 32,
                    language: "javascript",
                    codeLength: 256,
                    submitTime: Date(),
                },
                {
                    key: "1000002",
                    solutionID: 1000002,
                    problemID: 1002,
                    userID: 201705551223,
                    status: "Compile Error",
                    memory: 128,
                    time: 32,
                    language: "javascript",
                    codeLength: 256,
                    submitTime: Date(),
                }
            ]
            
        }
    },
    methods: {
        handleSearch(selectedKeys, confirm, dataIndex) {
            confirm();
            this.searchText = selectedKeys[0];
            this.searchedColumn = dataIndex;
        },

        handleReset(clearFilters) {
            clearFilters();
            this.searchText = '';
        },
    }
}
</script>

<style>
.status .accept {
    color: #13C965;
}
.status .wa {
    color: #FF0000;
}
.status .others {
    color: #0000FF;
}
</style>