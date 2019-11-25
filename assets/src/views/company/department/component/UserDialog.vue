<!--用户弹窗列表-->
<style lang="scss" rel='stylesheet/scss'>
    #user-dialog-container {
        .operate {
            text-align: right;
        }
        .tip {
            line-height: 50px;
            text-align: center;
            background: #FFEFB2;
            margin-top: 10px;
        }
    }
</style>
<template>
    <article id="user-dialog-container">
        <div class="operate">
            <el-button type="primary">导出excel</el-button>
        </div>
        <el-table
                v-loading="loading"
                tooltip-effect="dark"
                ref="multipleTable"
                border
                :data="data"
                stripe>
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="员工姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="手机号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="所属门店">
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="(val)=>{fetchParams.page_size = val;}"
                @current-change="(val)=>{fetchParams.page = val;}"
                :current-page="fetchParams.page"
                :page-sizes="[15, 30, 60, 100]"
                :page-size="fetchParams.page_size"
                layout="total, sizes, prev, pager, next"
                :total="total">
        </el-pagination>
    </article>
</template>
<script>
    import userService from 'services/company/userService'
    export default {
        props: {
            condition: {
                type: Object,
                default: {}
            }
        },
        watch: {
            condition (val) {
                this.condition = val
                this.fetchData()
            }
        },
        created () {
            this.fetchData()
        },
        data () {
            return {
                fetchParams: {
                    page: 1,
                    page_size: 15
                },
                loading: false,
                data: [],
                total: 0,
            }
        },
        methods: {
            fetchData () {
                let searchParams = {
                    page: this.fetchParams.page,
                    page_size: this.fetchParams.page_size
                }
                return userService.userSearch({...searchParams, ...this.condition}).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                })
            }
        }
    }
</script>
