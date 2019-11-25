<!--企业幻灯片-->
<style lang='scss' rel='stylesheet/scss'>
@import "../../../utils/mixins/showDetail";
@import "../../../utils/mixins/topSearch";
@import "../../../utils/mixins/common";
#server-wifi-container {
  @extend %content-container;
  .add  { 
    float: right;
  }
  .search {
            @extend %top-search-container;
        }
  .block {
    margin-top: 10px;
    text-align: right;
  }
}
</style>

<template>
    <article id="server-wifi-container">
        <!-- 增加修改弹窗 -->
        <el-dialog title="设置考勤WIFI" :visible.sync="showdialog">
            <el-form  :model="form" :rules="rules" label-width="120px" ref="form">
                <el-form-item label="选择考勤门店" prop="department_id">
                <DepSelect  :placeholder="department_name" v-model="form.department_id" ></DepSelect>
                </el-form-item>
                <el-form-item label="WIFI名称" >
                    <el-input  v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="MAC地址">
                    <el-input v-model="form.mac"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showdialog = false">取 消</el-button>
                <el-button type="primary" @click ="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <section class="search">
            <section>
                <i>门店</i>
                <DepSelect v-model="fetchParam.department_id"  :change="fetchData"></DepSelect>
            </section>
            <section>
                <i>WIFI名称</i>
                <el-input @keyup.enter.native="fetchData" v-model="fetchParam.name" auto-complete="off"></el-input>
            </section>
            <section class="add">
                <el-button type="primary" icon="el-icon-plus" @click="add">添加WIFI</el-button>
            </section>
        </section>
        <el-table border :data="dataList" v-loading="loading" class="table">
            <el-table-column
                prop ='department_name'
                label="门店名称"
                min-width="150">
            </el-table-column>
            <el-table-column
                prop ='name'
                label="考勤WIFI名称"
                min-width="150">
            </el-table-column>
            <el-table-column
                prop ='mac'
                label="MAC地址"
                min-width="150">
            </el-table-column>
            <el-table-column
                prop ='create_time_name'
                label="添加时间"
                min-width="150">
            </el-table-column>
            <el-table-column prop="operate" label="操作">
                <template slot-scope="scope">
                    <el-button 
                        type="text" 
                        size="small" 
                        @click="edit(scope.row)"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        修改
                    </el-button>
                    <el-button 
                        type="text" 
                        size="small" 
                        @click="del(scope.$index, scope.row)"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <section class="block">
            <el-pagination
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </section> 
    </article>
</template>
<script>
import DepSelect from '../../component/select/Department.vue'
import wifiService from 'services/server/wifiService'
import clone from 'clone'
function clearFn () {
    return {
        keyword: '',
        type: '',
        page: 1,
        page_size: 15,
        total: 0
    }
}
function clearForm () {
    return {
        department_id: '',
        name: '',
        mac: ''
    }
}
export default {
    components: {
        DepSelect
    },
    data () {
        return {
            dataList: [],
            loading: false,
            showdialog: false,
            total: 0,
            dialogtitle: '',
            fetchParam: clearFn(),
            form: clearForm(),
            department_name: '',
            rules: {
                department_id: [
                   {required: true, type: 'number', message: '请选择门店', trigger: 'change'}
                ]
            }
        }
    },
    created () {
        this.fetchData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        fetchData () {
            this.loading = true
            return wifiService.getWifiList(this.fetchParam).then((ret) => {
                this.dataList = ret.data
                this.total = ret.total
                this.loading = false
            })
        },
        add () {
            this.form = clearForm()
            this.department_name = ''
            this.dialogtitle = '添加'
            this.showdialog = true
        },
        del (index, row) {
            xmview.showDialog(`你将要删除 <span style="color:red">${row.name}</span>  确认吗?`, () => {
                wifiService.deleteWifi(row.id).then((ret) => {
                    xmview.showTip('success', '删除成功')
                    this.dataList.splice(index, 1)
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            })
        },
        edit (row) {
            this.dialogtitle = '修改'
            this.department_name = row.department_name
            this.form = clone(row)
            this.showdialog = true
        },
        submit (form) {
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return false
                }
                let reqFn
                reqFn = this.form.id ? wifiService.updateWifi : wifiService.addWifi
                reqFn(this.form).then((ret) => {
                    this.showdialog = false
                    xmview.showTip('success', '保存成功')
                    this.fetchData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            })
        }

    }
}
</script>
