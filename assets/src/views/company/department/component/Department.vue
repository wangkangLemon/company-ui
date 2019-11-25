<!--门店列表-->
<style lang="scss" rel='stylesheet/scss'>
    @import "~utils/mixins/showDetail";
    #department-container {
        .operate {
            .el-input {
                width: 200px;
                float: right;
            }
        }
        .el-table {
            margin-top: 20px;
        }
        .el-pagination {
            margin-top: 20px;
            text-align: right;
        }
    }
</style>
<template>
    <article id="department-container">
        <div class="operate">
            <el-button type="primary" @click="addDepartment">新增门店</el-button>
            <el-button type="warning" @click="moveFn">移动到</el-button>
            <el-button type="danger" @click="deletesMulit">批量删除</el-button>
            <el-button type="primary">导出</el-button>
            <el-input
                    placeholder="搜索门店"
                    suffix-icon="el-icon-search"
                    @keyup.enter.native="fetchData"
                    v-model="fetchParams.search">
            </el-input>
        </div>
        <el-table
                @selection-change="handleSelect"
                v-loading="loading"
                tooltip-effect="dark"
                ref="multipleTable"
                :data="data"
                border
                stripe>
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="门店名称"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="company"
                    label="上级部门"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="area_name"
                    width="200"
                    label="地区">
            </el-table-column>
            <el-table-column
                    prop="concact"
                    width="100"
                    label="店长">
            </el-table-column>
            <el-table-column
                    prop="user_count"
                    width="120"
                    label="店员数量">
                <template slot-scope="scope">
                    <el-button type="text" @click="showUser(scope.row.id)">{{scope.row.user_count}}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="address"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="()=>{details = scope.row; showDetail = true;}">详情</el-button>
                    <el-button type="text" @click="$emit('editDepartment', scope.row)">修改</el-button>
                    <el-button type="text" @click="$emit('deleteDepartment', scope.row)">删除</el-button>
                </template>
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
        <el-dialog title="全部员工" :visible.sync="dialogUserList">
            <UserDialog :condition="condition"></UserDialog>
        </el-dialog>
        <!--详情-->
        <el-dialog v-if="details != null" class="show-detail" :visible.sync="showDetail" title="门店信息">
            <div class="info">
                <p><i class="title">门店名称：</i><span class="value">{{details.name || '无'}}</span></p>
                <p><i class="title">上级部门：</i><span class="value">{{details.organization_name || '无'}}</span></p>
                <p><i class="title">店长：</i><span class="value">{{details.concact || '无'}}</span></p>
                <p><i class="title">店长手机号：</i><span class="value">{{details.mobile || '无'}}</span></p>
                <p><i class="title">店员数量：</i><span class="value">{{details.user_count}}</span></p>
                <p><i class="title">地区：</i><span class="value">{{details.area_name || '无'}}</span></p>
                <p><i class="title">传真：</i><span class="value">{{details.fax || '无'}}</span></p>
                <p><i class="title">地址：</i><span class="value">{{details.address || '无'}}</span></p>
                <p><i class="title">电话：</i><span class="value">{{details.tel || '无'}}</span></p>
                <p><i class="title">邮编：</i><span class="value">{{details.zip || '无'}}</span></p>
                <p><i class="title">备注：</i><span class="value">{{details.description || '无'}}</span></p>
            </div>
        </el-dialog>
        <el-dialog title="选择上级部门" :visible.sync="operateTreeDialog">
            <CompanyTree v-on:nodeClick="getParentTree"
                         v-model="depTreeList"
                         :isSelect="false"
                         :operate="false"
                         :isSearch="false"></CompanyTree>
        </el-dialog>
    </article>
</template>
<script>
    import departmentService from 'services/company/departmentService'
    import organizationService from 'services/company/organizationService'
    import UserDialog from './UserDialog.vue'
    import CompanyTree from '../../../component/tree/CompanyTree.vue'
    export default {
        components: {
            UserDialog,
            CompanyTree
        },
        props: {
            organization: Object
        },
        watch: {
            organization (val) {
                this.organization = val
                this.fetchData()
            }
        },
        created () {
            this.fetchData()
            // 获取无门店的树
            organizationService.getPartialTree().then((ret) => {
                this.depTreeList.data = [ret.data]
            })
        },
        data () {
            return {
                details: null, // 显示详情
                showDetail: false,
                depTreeList: {},
                operateTreeDialog: false,
                condition: {}, // 搜索条件
                dialogUserList: false,
                loading: false,
                data: [],
                treeList: [],
                total: 0,
                fetchParams: {
                    search: '',
                    page: 1,
                    page_size: 15,
                },
                selectData: [] // 批量删除的数据
            }
        },
        methods: {
            moveFn () {
                if (this.selectData.length < 1) {
                    xmview.showTip('error', '请选择移动项')
                    return
                }
                this.operateTreeDialog = true
            },
            getParentTree (data) {
                // 获取上级部门数据
                let pid
                let ids = []
                data.type === 0 ? pid = 0 : pid = data.id
                this.selectData.forEach((item) => {
                    ids.push(parseInt(item.id))
                })
                departmentService.moveDepartment({id: ids.toString(), pid}).then(() => {
                    this.$emit('moveDepartment', {
                        parent: data,
                        selectData: this.selectData
                    })
                    this.operateTreeDialog = false
                    this.fetchData()
                })
            },
            showUser (department_id) {
                this.condition = {
                    department_id: department_id,
                    organization_id: this.organization.id,
                    type: this.organization.type,
                }
                this.dialogUserList = true
            },
            fetchData () {
                this.loading = true
                return departmentService.departmentSearch({
                    keyword: this.fetchParams.search,
                    page: this.fetchParams.page,
                    page_size: this.fetchParams.page_size,
                    organization_id: this.organization.id,
                    type: this.organization.type
                }).then((ret) => {
                    this.loading = false
                    this.data = ret.data
                    this.total = ret.total
                })
            },
            addDepartment () {
                this.$emit('addDepartment')
            },
            handleSelect (selects) {
                this.selectData = [...selects]
            },
            // 批量删除
            deletesMulit () {
                if (this.selectData.length < 1) {
                    xmview.showTip('error', '请选择要删除的门店')
                    return
                }
                this.selectData.forEach((item) => {
                    this.$emit('deleteDepartment', item)
                })
            }
        }
    }
</script>
