<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-flowing-customer-container {
        @extend %content-container;
        .img--preview {
            width: 70%;
            cursor: zoom-in;
        }
    }
</style>

<template>
    <main id="member-flowing-customer-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>最近进入的门店</i>               
                <Department 
                    v-model="fetchParam.last_arrive_department_id"
                    :change="fetchData">
                </Department>
            </section>
            <section>
                <i>顾客姓名</i>
                <el-input
                    v-model="fetchParam.name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>会员卡号</i>
                <el-input
                    v-model="fetchParam.vip_num"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>手机号</i>
                <el-input
                    v-model="fetchParam.mobile"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>客户类型</i>
                <el-select 
                    v-model="fetchParam.is_new" 
                    filterable 
                    clearable 
                    placeholder="请选择" 
                    @change="fetchData">
                    <el-option label="老客" :value="0"></el-option>
                    <el-option label="新客" :value="1"></el-option>
                </el-select>
            </section>
            <section>
                <DateRange 
                    title="最近进店时间" 
                    :start="fetchParam.arrive_start_time" 
                    :end="fetchParam.arrive_end_time"
                    v-on:changeStart="val => { fetchParam.arrive_start_time=val }"
                    v-on:changeEnd="val => { fetchParam.arrive_end_time=val }"
                    :change="fetchData">
                </DateRange>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="头像"
                    prop="face_url"
                    width="80">
                    <img slot-scope="{ row }" :src="row.face_url" alt="会员头像" @click="preview(row)" class="img--preview">
                </el-table-column>
                <el-table-column 
                    label="顾客姓名" 
                    prop="name" 
                    min-width="120">
                </el-table-column>
                <el-table-column 
                    label="性别" 
                    prop="sex" 
                    width="60">
                    <span slot-scope="{ row }">{{row.sex === 1 ? '女' : '男'}}</span>
                </el-table-column>
                <el-table-column 
                    label="年龄" 
                    prop="age" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="会员卡号" 
                    prop="vip_num" 
                    min-width="130">
                </el-table-column>
                <el-table-column 
                    label="手机号" 
                    prop="mobile" 
                    width="110">
                </el-table-column>
                <el-table-column 
                    label="最近进入的门店" 
                    prop="last_arrive_department_name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="客户类型" 
                    prop="is_new" 
                    width="80">
                    <span slot-scope="{ row }">{{row.is_new | new}}</span>
                </el-table-column>
                <el-table-column 
                    label="最近进店时间" 
                    prop="last_arrive_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="进店次数" 
                    prop="arrive_num" 
                    width="80">
                    <el-button 
                        slot-scope="{ row }"  
                        type='text' 
                        :disabled="row.arrive_num===0"
                        @click="viewFlowing(row)">
                        {{row.arrive_num}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="购药详情"
                    width="80">
                    <el-button 
                        slot-scope="{ row }" 
                        type="text" 
                        size="small"
                        @click="$router.push({name: 'member-flowing-medicine', query: { customer_crowd_id: row.id }})">
                        查看
                    </el-button>
                </el-table-column>
            </el-table>
            <el-pagination 
                class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="total">
            </el-pagination>
        </section>

        <FlowingCount 
            :visible.sync="flowingCount.showDialog"
            :id="flowingCount.id">
        </FlowingCount>
        <ImagePreview v-model="showImagePreview" :url="face_url" :needFillPath="false"></ImagePreview>
    </main>
</template>

<script>
    import flowingService from 'services/member/flowingService'
    import Department from 'components/select/Department.vue'
    import DateRange from 'components/form/DateRangePicker.vue'
    import FlowingCount from '../component/FlowingCount.vue'
    import ImagePreview from 'components/dialog/ImagePreview.vue'

    export default {
        components: {
            Department,
            DateRange,
            FlowingCount,
            ImagePreview
        },
        props: {},
        activated () {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                face_url: '',
                showImagePreview: false,
                loading: false,
                data: [],
                total: 0,
                flowingCount: {
                    showDialog: false,
                    id: 0
                },
                fetchParam: {
                    last_arrive_department_id: '',
                    name: '',
                    vip_num: '',
                    mobile: '',
                    is_new: '',
                    arrive_start_time: '',
                    arrive_end_time: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return flowingService.searchFlowing(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            viewFlowing (row) {
                this.flowingCount.showDialog = true
                this.flowingCount.id = row.id
            },
            preview (row) {
                this.face_url = row.face_url
                this.showImagePreview = true
            }
        },
        filters: {
            new (val) {
                let map = {
                    0: '老客',
                    1: '新客'
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
