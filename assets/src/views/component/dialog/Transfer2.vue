<!-- 使用实例 -->
<!--
     <Transfer 
        :data="company.companyData"
        @size-change="val => { company.companyParam.page_size = val;  getCompany()}"
        @current-change="val => { company.companyParam.page = val; getCompany() }"
        :current-page="company.companyParam.page"
        :page-size="company.companyParam.page_size"
        :total="company.total"
        v-model="company.selectCompany"
        v-if="company.companyData && company.selectCompany">
    </Transfer> 
    使用created生命周期，外部调用如果数据是异步加载，需要通过v-if来控制组件的创建，保证组件内部到created阶段时候执行正确，如果父组件是keep-alive组件

-->

<style lang="scss" rel="stylesheet/scss">
    .transfer2-container {
        margin: 0 auto;
        .dialog-add-item {
            width: 45%;
            display: inline-block;
            vertical-align: top;
            &:first-of-type {
                margin-right: 2%;
                margin-left: 4%;
                .footer {
                    text-align: left;
                    padding-left: 10px;
                }
            }
            height: 500px;
            // width: 30%;
            // display: inline-block;
            h5 {
                line-height: 40px;
                font-size: 14px;
                padding-left: 20px;
                background: #fbfdff;
                border: 1px solid #d1dbe5;
                border-bottom: none;
            }
            .el-input {
                // width: 100%;
                input {
                    border-radius: 0;
                    border: 1px solid #d1dbe5;
                    border-bottom: none;
                }
            }
            .row-class {
                border: 1px solid #d1dbe5;
            }
            .footer {
                text-align: right;
                line-height: 40px;
                padding-right: 10px;
            }
            .block {
                text-align: right;
                padding-right: 0;
                padding-top: 10px;
            }
            .p-cell {
                line-height: 32px;
            }
        }
    }
</style>
<template>
    <article class="transfer2-container">
        <slot></slot>
        <div class="dialog-add-item">
            <h5>{{title}}</h5>
            <el-input 
                v-if="isSearch"
                :placeholder="placeholder" 
                v-model="keyword"
                @keyup.enter.native="fetchData">
            </el-input>
            <el-table 
                :data="data"
                :height="400"
                :show-header="showHeader"
                :fit="true"
                ref="multiple"
                v-loading="loading"
                class="row-class"
                @select="selectRow"
                @selection-change="selectionChange"
                @select-all="selectionAll"
                >
                <el-table-column type="selection" :selectable="(row) => row.id != -1"></el-table-column>
                <el-table-column label="名称">
                    <template slot-scope="scope">
                        <p v-if="scope.row.id != -1" class="p-cell">
                            {{scope.row[firstColumnProp]}}
                            <slot name="source-column" :row="scope.row"></slot>
                        </p>
                    </template>
                </el-table-column>
                <template v-if="extraColumn && extraColumn.length > 0">
                    <el-table-column 
                        v-for="column in extraColumn"
                        :key="column.value"
                        :prop="column.value"
                        :label="column.label">
                        <template slot-scope="{row}">
                            <span v-if="column.slot">{{row.limit_repeat === 0 ? '不限制' : row.limit_repeat}}</span>
                            <span v-else>{{row[column.value]}}</span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <el-pagination 
                class="block"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                :page-sizes="[15, 30, 60, 100]"
                layout="prev, pager, next" 
                :total="total">
            </el-pagination>
        </div>
        <div class="dialog-add-item" v-if="showSelectedData">
            <h5>已选择</h5>
            <el-table 
                :show-header="false" 
                :data="selectData" 
                :height="440" 
                :fit="true" 
                class="row-class" 
                v-loading="selectLoading">
                <el-table-column>
                    <template slot-scope="scope">
                        <p v-if="scope.row.id != -1" class="p-cell">
                            {{scope.row.name}}
                            <el-button type="text" @click="deleteData(scope.$index, scope.row)" icon="el-icon-delete" size="small" style="float:right;"></el-button>
                            <slot name="target-column" :row="scope.row" :deleteData="deleteData"></slot>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
            <div class="footer"><el-button type="text" @click="deleteAll">全部删除</el-button></div>
        </div>
    </article>
</template>
<script>
    // import clone from 'clone'
    export default {
        props: {
            title: {
                type: String,
                default: '全部'
            },
            type: {
                type: [Number, String],
                required: false
            },
            loading: Boolean,
            extraColumn: {
                type: Array,
                required: false
            },
            data: {
                type: Array,
            },
            value: {
                type: Array,
            },
            placeholder: {
                type: String,
                default: '搜索'
            },
            isSearch: {
                type: Boolean,
                default: true,
            },
            showHeader: {
                type: Boolean,
                default: false,
            },
            showSelectedData: {
                type: Boolean,
                default: true
            },
            currentPage: Number,
            pageSize: Number,
            total: Number,
            firstColumnProp: {
                type: String,
                default: 'name'
            },
        },
        watch: {
            type (val) {
                this.type = val
            },
            loading (val) {
                this.loading = val
            },
            data (val) {
                this.data = val
                this.pageChangeSelect()
            },
            value (val) {
                this.selectData = val
                // this.pageChangeSelect()
            },
            currentPage (val) {
                this.pageChangeSelect()
            }
        },
        mounted () {
            this.pageChangeSelect()
        },
        created () {
            this.pageChangeSelect()
        },
        data () {
            return {
                selectData: this.value,
                keyword: '',
                selectLoading: false,
                selections: []
            }
        },
        methods: {
            fetchData () {
                this.$emit('searchFn', this.keyword)
            },
            handleSizeChange (val) {
                this.$emit('size-change', val)
            },
            handleCurrentChange (val) {
                this.$emit('current-change', val)
            },
            pageChangeSelect () {
                if (!this.selectData || !this.data) return
                if (!this.selectData.length || !this.data.length) return
                // this.selectionChange = true
                for (let i = 0; i < this.selectData.length; i++) {
                    for (let j = 0; j < this.data.length; j++) {
                        if (this.data[j].id === this.selectData[i].id) {
                            // create时dom未更新
                            this.$nextTick(() => {
                                this.$refs.multiple.toggleRowSelection(this.data[j], true)
                            })
                            break
                        }
                    }
                }
                // this.selectionChange = false
            },
            searchSelect () {
            },
            deleteData (index, row) {
                this.selectData.splice(index, 1)
                this.data.forEach((item) => {
                    if (item.id === row.id) this.$refs.multiple.toggleRowSelection(item, false)
                })
                this.$emit('input', this.selectData)
            },
            toggleRowSelectionById (row) {
                this.data.forEach((item) => {
                    if (item.id === row.id) {
                        this.$refs.multiple.toggleRowSelection(item, false)
                    }
                })
            },
            selectionChange (selection) {
                if (selection.length) {
                    this.selections = selection
                } else {
                    // this.$refs.multiple.store.states.selection = this.selections
                }
            },
            selectionAll (selection) {
                this.$emit('select-all', selection)
            },
            // 选中数据
            selectRow (selection, row) {
                if (this.type) {
                    this.$emit('curRow', row)
                }
                if (row.id < 0) return
                for (let i = 0; i < this.selectData.length; i++) {
                    if (this.selectData[i].id == row.id) {
                        this.selectData.splice(i, 1)
                        return
                    }
                }
                this.selectData.push(row)
                this.$emit('input', this.selectData)
            },
            // 全选
            /**
            selectAll () {
                this.data.forEach((item) => {
                    this.$refs.multiple.toggleRowSelection(item, true)
                })
                this.selectData = clone(this.data).splice(0, this.data.length)
                this.$emit('input', this.selectData)
            },
            */
            // 全部删除
            deleteAll () {
                while (this.selectData.length > 0) {
                    this.selectData.splice(0, 1)
                }
                this.data.forEach((item) => {
                    this.$refs.multiple.toggleRowSelection(item, false)
                })
                this.$emit('input', this.selectData)
            },
            toggleRowSelection (selected = false) {
                this.data.forEach((item) => {
                    this.$refs.multiple.toggleRowSelection(item, selected)
                })
            }
        }
    }
</script>
