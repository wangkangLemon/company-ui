<!--地点管理-->
<style lang='scss' rel='stylesheet/scss'>
@import "../../../utils/mixins/showDetail";
@import "../../../utils/mixins/topSearch";
@import "../../../utils/mixins/common";
#server-local-container {
    @extend %content-container;
    .add  { 
        float: right;
    }
    .search {
        @extend %top-search-container;
    }
    .search-box {
        z-index: 10000;
    }
    .block {
        margin-top: 10px;
        text-align: right;
    }
}
</style>

<template>
  <article id="server-local-container">
       <!-- 增加修改弹窗 -->
       <el-dialog title="设置考勤地点" v-if="showdialog" :visible.sync="showdialog">
            <el-form label-position="top" :model="form" :rules="rules" label-width="100px" ref="form">
                <el-form-item label="选择考勤门店" prop="department_id">
                <DepSelect v-model="form.department_id" :placeholder="department_name"></DepSelect>
                </el-form-item>
                <el-form-item label="考勤地点名称" prop="name" >
                    <el-input  v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item  prop="address">
                    <p>详细地址</p>
                    <Map ref="localMap" :nowAddress="form.address" :position="position" @getposition="getPosition" :range="form.range"></Map>
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
        <i>考勤地点</i>
        <el-input @keyup.enter.native="fetchData" v-model="fetchParam.name" auto-complete="off"></el-input>
      </section>
       <section class="add">
            <el-button type="primary" icon="el-icon-plus" @click="add">添加地点</el-button>
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
                        label="考勤地点名称"
                        min-width="150">
                </el-table-column>
                   <el-table-column
                        prop ='address'
                        label="定位地点"
                        min-width="170">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="添加时间"
                        width="200">
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
import Map from '../component/Map.vue'
import localService from 'services/server/localService'
import clone from 'clone'
function clearFn () {
    return {
        keyword: '',
        type: '',
        page: 1,
        page_size: 15
    }
}
function clearForm () {
    return {
        id: '',
        department_id: '',
        name: '',
        address: '', // 地址
        longitude: '', // 经度
        latitude: '', // 维度
        range: 500 // 打卡范围

    }
}
export default {
    components: {
        DepSelect,
        Map
    },
    watch: {
    },
    data () {
        return {
            position: void 0,
            dataList: [],
            loading: false,
            showdialog: false,
            total: 0,
            dialogtitle: '',
            department_name: '',
            fetchParam: clearFn(),
            form: clearForm(),
            rules: {
                department_id: [
                   {required: true, type: 'number', message: '请选择门店', trigger: 'change'}
                ],
                name: [
                    {required: true, message: '请输入地点名称', trigger: 'blur'}
                ],
                address: [
                    {required: true, message: '请输入具体地点地点名称', trigger: 'blur'}
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
            return localService.getLocalList(this.fetchParam).then((ret) => {
                this.dataList = ret.data
                this.total = ret.total
            }).then(() => {
                this.loading = false
            })
        },
        add () {
            this.department_name = ''
            this.form = clearForm()
            this.dialogtitle = '添加'
            this.showdialog = true
            this.$nextTick(() => {
                this.$refs.localMap.initMarker()
            })
        },
        del (index, row) {
            xmview.showDialog(`你确认要删除 <span style="color:red">${row.name}</span> 吗?`, () => {
                localService.deleteLocal(row.id).then((ret) => {
                    xmview.showTip('success', '删除成功')
                    this.fetchData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            })
        },
        edit (row) {
            this.dialogtitle = '修改'
            this.form = clearForm()
            this.department_name = row.department_name
            this.form = clone(row)
            this.position = [row.longitude, row.latitude]
            this.showdialog = true
        },
        getPosition (lng, lat, address) {   // 获取 地址
            this.form.address = address // 地址
            this.form.longitude = lng   // 经度
            this.form.latitude = lat    // 纬度
        },
        submit (form) {
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return false
                }
                let reqFn
                if (this.form.id) {
                    reqFn = localService.updateLocal
                    delete this.form.create_time_name
                } else {
                    reqFn = localService.addLocal
                }
                reqFn(this.form).then((ret) => {
                    xmview.showTip('success', '保存成功')
                    this.fetchData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
                this.showdialog = false
            })
        }

    }
}
</script>
