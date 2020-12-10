<template>
    <div class="manageContest" id="manageContest">
        <a-table
            :columns="columns"
            :data-source="contests"
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
            <!-- ID -->
            <span slot="ID"></span>
            <span slot="title"></span>
            <!-- 表头 -->
            <template slot="title">
                <h2 style="font-size: 22px">比赛列表</h2>
            </template>
            <!-- 搜索图标 -->
            <a-icon
                slot="filterIcon"
                type="search"
            />
            <!-- 操作 -->
            <span slot="buttons" slot-scope="text, record">
                <a-button type="primary" @click="namelistManage(record.ID)">名单管理</a-button>
            </span>
        </a-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pagination: {       // 页面设置
                pageSize:10,    // 每页题目数量
            },
            searchText: "",
            contests: [
                {
                    key: "1000",
                    ID: 1000,
                    title: "A+BA",
                    source: "昶浩",
                },
                {
                    key: "1001",
                    ID: 1001,
                    title: "A+BA",
                    source: "昶浩",
                },
            ],
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
                    title: "比赛名称",
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
                    title: "发布人",
                    dataIndex: "source"
                },
                {
                    title: "比赛开始时间"
                },
                {
                    title: "总时长"
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: 'buttons' },
                }
            ],
        }
    },
    methods: {
        namelistManage(contestID) {
            console.log(contestID);
        }
    }
}
</script>

<style>

</style>