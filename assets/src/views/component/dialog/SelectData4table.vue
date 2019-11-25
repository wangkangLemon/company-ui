<!--弹出表格选则数据-->
<!--使用demo-->

<!--<dialogSelectData v-model="dialogCourse.isShow" :fetchData="fetchCourse" title="选择课程"-->
<!--:selectedList="form.courses" @changeSelected="val=>form.courses=val">-->
<!--<div style="margin-bottom: 15px" slot="search">-->
<!--<el-input @keyup.enter.native="fetchCourse(true)" v-model="dialogCourse.keyword" icon="search"-->
<!--placeholder="请输入关键字搜索"></el-input>-->
<!--</div>-->
<!--</dialogSelectData>-->

<style lang='scss' rel='stylesheet/scss'>
    .comp-dialog-select4table {
        main {
            > section {
                >aside{
                    margin-bottom: 5px;
                }
                display: inline-block;
                width: 43%;

                &:first-of-type {
                    margin-right: 5%;
                }
            }
        }
    }
</style>

<template>
    <el-dialog :title="title" :visible.sync="currVal" class="comp-dialog-select4table">
        <main>
            <slot name="search"></slot>
            <section>
                <aside>未选中</aside>
                <el-table ref="courseTable" v-loading="loading" :data="data" :show-header="false"
                          :height="500"
                          @select="rowSelected">
                    <el-table-column type="selection" :selectable="(row) =>  row.id != -1"></el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <i v-if="scope.row.id != -1">{{scope.row.name}}</i>
                            <el-button @click="fetchData(false)" class="dialog-getmore-btn" type="text"
                                       v-else :disabled="data.length - 1 >= total">
                                <i>{{data.length - 1 >= total ? '已无更多' : '点击加载更多'}}</i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </section>
            <section>
                <aside>已选中</aside>
                <el-table :show-header="false" :height="500" :data="currSelectedList">
                    <el-table-column>
                        <template slot-scope="scope">
                            {{scope.row.name}}
                            <el-button style="float: right;margin-right: 10px" type="text" size="tiny" icon="el-icon-delete"
                                       @click="delItem(scope.row)">删除
                                <!--i-->
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </section>
        </main>

        <span slot="footer">
                <el-button type="primary" @click="currVal=false">确定</el-button>
            </span>
    </el-dialog>
</template>

<script>
    export default{
        props: {
            title: String, // dialog的标题
            value: { // 是否显示
                type: Boolean,
                default: false
            },
            // 获取数据的方法 返回一个Promise,  数据格式: { total: 9, data:[{ name:'xxx', id:1 }] }
            fetchData: Function,
            // 被选中的列表集合
            selectedList: Array
        },
        data () {
            return {
                currVal: this.value,
                currSelectedList: this.selectedList,
                fetchParam: {
                    page: 1,
                    page_size: 15,
                },
                total: 0,
                data: [],
                loading: false
            }
        },
        watch: {
            currVal (val) {
                this.$emit('input', val)
            },
            value (val) {
                val !== this.currVal && (this.currVal = val)

                if (val && this.data.length < 1) this.fetchData()

                val && this.setSelected()
            },
            selectedList (val) {
                if (val !== this.currSelectedList && val.length !== this.currSelectedList.length)
                    this.currSelectedList = val
            }
        },
        created () {
        },
        activated () {
        },
        methods: {
            fetchData (isFirst) {
                this.loading = true
                if (isFirst) this.fetchParam.page = 1
                this.fetchData(this.fetchParam).then((ret) => {
                    this.total = ret.total

                    // 是否首次加载
                    if (this.fetchParam.page === 1) {
                        this.fetchParam.page = 1
                        this.data = []
                        if (ret.data.length < 1) return
                    }
                    this.data.splice(-1, 1)
                    this.data.push(...[...ret.data, {id: -1}])

                    // 设置选中
                    this.setSelected()

                    this.fetchParam.page++
                }, () => {
                }).then(() => {
                    this.loading = false
                })
            },
            rowSelected (selection, row) {
                // 排除已选课程
                if (selection.indexOf(row) > -1)
                    this.currSelectedList.push(row)
                else
                    this.currSelectedList.splice(this.currSelectedList.indexOf(row), 1)

                this.$emit('changeSelected', this.currSelectedList)
            },
            delItem (row) {
                this.currSelectedList.splice(this.currSelectedList.findIndex(item => {
                    return item.id === row.id
                }), 1)
                // 重新设置选中
                this.setSelected()
                this.$emit('changeSelected', this.currSelectedList)
            },
            // 设置选中
            setSelected () {
                this.$nextTick(() => {
                    this.$refs.courseTable.clearSelection()
                    this.currSelectedList.forEach((row) => {
                        let currRow = this.data.find((item) => {
                            return item.id == row.id
                        })
                        this.$refs.courseTable.toggleRowSelection(currRow, true)
                    })
                })
            }
        },
        components: {}
    }
</script>
