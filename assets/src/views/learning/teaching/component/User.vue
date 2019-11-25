<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-map-exam-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .select {
            padding: 0 0 10px 10px;
            span {
                margin-right: 30px;
            }
            .tip {
                color: #afafaf;
            }
        }
    }
</style>

<template>
    <el-dialog 
        :title="title" 
        @close="close"
        :visible.sync="showDialog">
        <main id="learning-map-exam-container">
            <div class="select">
                <span>学员: {{selectObj.user_name}}</span>
                <span>教员: {{selectObj.coacher_name}}</span>
                <el-button 
                    type='text' 
                    @click="reset">
                    重置
                </el-button>
                <p class="tip">重新选择门店请点击重置</p>
            </div>
            <section class="search">
                <!-- 搜索条件 -->
                <section>
                    <i>用户名称</i>
                    <el-input
                        v-model="fetchParam.keyword"
                        @keyup.enter.native="userType">
                    </el-input>
                </section>
                <section v-show="!mutex">
                    <i>门店</i>
                    <Department 
                        v-model="fetchParam.department_id" 
                        @change="userType">
                    </Department>
                </section>
                <section>
                    <i>人员类别</i>
                    <el-select v-model="fetchParam.user_status" @change="userType">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                   </el-option>
                </el-select>
                </section>
            </section>
            <section>
                <!-- 内容主体 -->
                <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
                <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
                <!-- 固定列通过配置fixed="right || left"-->
                <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                    <el-table-column 
                        label="姓名" 
                        prop="name" 
                        min-width="140">
                    </el-table-column>
                    <el-table-column
                        label="操作" 
                        prop="operate">
                        <template slot-scope="scope">
                            <el-button 
                                type='text' 
                                @click="pick(scope.row, 'user')"
                                v-if="fetchParam.user_status!=='2'">
                                指定学员
                            </el-button>
                            <el-button 
                                type='text' 
                                @click="pick(scope.row, 'coacher')"
                                 v-if="fetchParam.user_status!=='1'">
                                指定教员
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination 
                    class="block"
                    @size-change="handSizeChange"
                    @current-change="handCurrentChange"
                    :current-page="fetchParam.page"
                    :page-size="fetchParam.page_size"
                    :page-sizes="[10, 15, 30, 60, 100]"
                    layout="sizes, total, prev, pager, next" 
                    :total="total">
                </el-pagination>
            </section>
        </main>
        <span slot="footer">
            <!-- <el-button type="primary" @click=""></el-button> -->
            <el-button @click="submit" type="primary">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Department from 'components/select/Department'
    import {userNameList} from 'services/userService'
    import { clone } from 'utils/common'
    import teachingService from 'services/learning/teaching'
    export default {
        components: {
            Department
        },
        props: {
            visible: Boolean,
            title: String,
            selected: Object,
            taskType: Number,
        },
        activated () {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
            if (this.selected.user_department_id && this.selected.coacher_department_id) {
                this.pick({
                    id: this.selected.user_id,
                    name: this.selected.user_name,
                    department_id:  this.selected.user_department_id
                }, 'user')
            }
        },
        mounted () {},
        computed: {},
        watch: {
            visible (val) {
                if (val) this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            return {
                options:[{
                    value:'1',
                    label:'学员'
                },{
                    value:'2',
                    label:'教员'
                }],
                showDialog: this.visible,
                selectObj: this.selected,
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    keyword: '',
                    department_id: '',
                    page: 1,
                    page_size: 10,
                    user_status:'1'
                },
                mutex: 0,
            }
        },
        methods: {
            userType(){
              if(this.fetchParam.user_status=="1"){
                  this.fetchData()
              }else if(this.fetchParam.user_status=="2"){
                  this.handCurrentChange(1)
                  this.getTeacher()
              }else{
                  this.fetchData()
              }
            },
            fetchData () {//获取学员信息
                this.loading = true
                return userNameList(this.fetchParam).then(ret => {
                    this.data = ret.list || ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            getTeacher(){
                return teachingService.getTeachingUserList(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            handSizeChange(val){
              this.fetchParam.page_size=val
              if(this.fetchParam.user_status=='1'){
                 this.fetchData()
              }else if(this.fetchParam.user_status=="2"){
                  this.getTeacher()
              }
            },
            handCurrentChange(val){
              this.fetchParam.page=val
              if(this.fetchParam.user_status=='1'){
                 this.fetchData()
              }else if(this.fetchParam.user_status=="2"){
                  this.getTeacher()
              }
            },
            pick (row, type) {
                // if (this.mutex === 0 ) {
                //     this.fetchParam.page = 1
                //     this.fetchParam.keyword = ''
                //     this.fetchParam.department_id = row.department_id
                //     this.fetchData().then(() => {
                //         this.mutex++
                //     })
                //     // let fetchParam = clone(this.fetchParam)
                //     // fetchParam.department_id = row.department_id
                //     // this.loading = true
                //     // userNameList(fetchParam).then(ret => {
                //     //     this.data = ret.list || ret.data
                //     //     this.total = ret.total
                //     //     this.loading = false
                //     // })
                // }
                if (type === 'user') {
                    this.selectObj = Object.assign({}, this.selectObj, {
                        user_id: row.id,
                        user_name: row.name,
                        user_department_id: row.department_id
                    })
                } else {
                    this.selectObj = Object.assign({}, this.selectObj, {
                        coacher_id: row.id,
                        coacher_name: row.name,
                        coacher_department_id: row.department_id
                    })
                }
                // this.selectedExam.length = 0
            },
            reset () {
                this.fetchParam.department_id = ''
                this.mutex = 0
                for (let k of Object.keys(this.selectObj)) {
                    this.selectObj[k] = ''
                }
                this.userType()
            },
            submit () {
                // if (this.selectObj.user_department_id !== this.selectObj.coacher_department_id) {
                //     return xmview.showTip('error', '请选择相同门店')
                // }
                this.$emit('pick', this.selectObj)
                this.showDialog = false
            },
            close () {
                // if (this.selectObj.user_department_id !== this.selectObj.coacher_department_id) {
                //     this.showDialog = true
                //     return xmview.showTip('error', '请选择相同门店')
                // }
                // this.$emit('pick', this.selectObj)
            }
        },
        filters: {},
        directives: {},
    }
</script>
