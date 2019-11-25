<!--使用实例-->
<!--<Transfer placeholder="搜索用户"-->
          <!--@searchFn="(val)=>{page=1;users=[];keyword=val;getAllUser();}"-->
          <!--@moreFn="()=>{page++;getAllUser();}" :total="usersTotal"-->
          <!--:data="users"-->
          <!--v-model="selectUser"></Transfer>-->
<style lang="scss" rel="stylesheet/scss">
    .transfer-container {
        .dialog-add-item {
            vertical-align: top;
            &:first-of-type {
                .footer {
                    text-align: left;
                    padding-left: 10px;
                }
            }
            h5 {
                line-height: 40px;
                font-size: 14px;
                padding-left: 20px;
                background: #fbfdff;
                border: 1px solid #d1dbe5;
                border-bottom: none;
            }
            .el-input {
                width: 100%;
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
        }
    }
</style>
<template>
    <article class="transfer-container">
        <el-row :gutter="15">
            <el-col :span="12">
                <div class="dialog-add-item">
                    <h5>全部</h5>
                    <el-input :placeholder="placeholder" v-model="keyword"
                              @keyup.enter.native="fetchData"></el-input>
                    <el-table :data="data"
                              :height="365"
                              :show-header="false"
                              :fit="true"
                              ref="multiple"
                              v-loading="loading"
                              class="row-class"
                              @select="selectRow" @select-all="selectRow">
                        <el-table-column type="selection" :selectable="(row) =>  row.id != -1"></el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <i v-if="scope.row.id != -1">{{scope.row.name}}</i>
                                <el-button @click="$emit('moreFn')" class="dialog-getmore-btn" type="text"
                                           v-else :disabled="data.length >= total">
                                    <i>{{data.length >= total ? '已无更多' : '点击加载更多'}}</i>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="footer"><el-button type="text" @click="selectAll">全选</el-button></div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="dialog-add-item" v-if="showSelectedData">
                    <h5>已选择</h5>
                    <el-table
                            :show-header="false"
                            :data="selectData"
                            :height="400"
                            :fit="true"
                            class="row-class"
                            v-loading="selectLoading">
                        <el-table-column prop="name" label="课程名"></el-table-column>
                        <el-table-column
                                width="50"
                                label="">
                            <template slot-scope="scope">
                                <el-button type="text" @click="deleteData(scope.$index, scope.row)" icon="el-icon-delete"
                                           size="small">
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="footer"><el-button type="text" @click="deleteAll">全部删除</el-button></div>
                </div>
            </el-col>
        </el-row>
    </article>
</template>
<script>
    import clone from 'clone'
    export default {
        props: {
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
            total: {
                type: Number,
                default: 0
            },
            showSelectedData: {
                type: Boolean,
                default: true
            },
            type: {
                type: String,
                required: false
            },
        },
        watch: {
            data (val) {
                this.data = val
                this.initSelect()
            },
            total (val) {
                this.total = val
            },
            value (val) {
                this.selectData = val
            }
        },
        data () {
            return {
                selectData: this.value,
                keyword: '',
                loading: false,
                selectLoading: false,
                page: 1,
            }
        },
        methods: {
            fetchData () {
                this.$emit('searchFn', this.keyword)
            },
            deleteData (index, row) {
                this.selectData.splice(index, 1)
                this.toggleRowSelectionById(row)
                this.$emit('input', this.selectData)
            },
            toggleRowSelectionById (row) {
                this.data.forEach((item) => {
                    if (item.id === row.id) this.$refs.multiple.toggleRowSelection(item, false)
                })
            },
            initSelect () {
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
            },
            // 选中数据
            selectRow (selection, row) {
                this.type && this.$emit('curRow', row, this.type)
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
            selectAll () {
                this.toggleRowSelection(true)
                this.selectData = clone(this.data).splice(0, this.data.length).filter(item => item.id != -1)
                this.$emit('input', this.selectData)
                this.type && this.$emit('selectAll', this.type)
            },
            // 全部删除
            deleteAll () {
                this.selectData = []
                this.toggleRowSelection()
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
