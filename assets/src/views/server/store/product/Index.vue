<style lang='scss' rel='stylesheet/scss'>
    #product-content-container {
        .el-form-item{
            margin-bottom: 15px;
        }
        .multy-choose-item{
            padding: 5px 0;
        }
        .img-content{
            display:flex;
            align-items: center;
            padding: 5px 0;
        }
    }
</style>
<template>
    <div id="product-content-container">
        <section class="manage-container">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({ name:'test-store-add'})"><i>新增商品</i></el-button>
        </section>
        <!-- <section class="search"> -->
        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="商品名称">
                <el-input v-model="fetchParam.name" placeholder="商品名称" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
                <SelectScroll :requestCb="fetchCategory" v-model="fetchParam.category_id" :changeCb="changeCategory" ref="selectScroll"></SelectScroll>
            </el-form-item>
            <el-form-item label="当前状态">
                <el-select v-model="fetchParam.status" @change="fetchData" :clearable="true">
                    <el-option label="上架" :value="0"></el-option>
                    <el-option label="下架" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                           @changeStart="val=> {fetchParam.time_start=val}"
                           @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
                </DateRange>
            </el-form-item>
        </el-form>
        
         <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  @select="selectRow"
                  @select-all="selectRow"
                  border>
            <el-table-column
                    min-width="200"
                    prop="name"
                    label="商品名称">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="商品分类"
                    prop="category_name">
            </el-table-column>
            <el-table-column label="商品预览图" width="150">
                <template slot-scope="scope">
                    <div class="img-content">
                        <img :src="scope.row.image | fillImgPath" width="80"/>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="stock"
                    label="库存">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="score"
                    label="当前售价">
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="create_time"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="当前状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="success">上架</el-tag>
                    <el-tag v-else-if="scope.row.status == 1" type="danger">下架</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="update_time"
                    label="最后操作时间">
            </el-table-column>
            <el-table-column    
                    fixed="right"
                    width="207"
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                        @click="$router.push({name: 'test-store-detail', params: {id: scope.row.id}})"
                        type="text"
                        size="small">
                        详情
                    </el-button>
                     <el-button
                        @click="changePrice(scope.$index, scope.row)"
                        type="text" size="small">修改售价
                    </el-button>
                    <el-button @click="offline(scope.$index, scope.row)" type="text" size="small" v-if="scope.row.status == 0">
                        <i>下架</i>
                    </el-button>
                    <el-button @click="online(scope.$index, scope.row)" type="text" size="small" v-if="scope.row.status && scope.row.status == 1">
                        <i>上架</i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="12" :offset="12">
                <el-pagination
                    style="text-align: right"
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-size="fetchParam.page_size"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="fetchParam.page_total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-dialog :title="editDialog" :visible.sync="dialog.edit" @close='closeDialog'>
            <div class="el-form-item">
                <label for="score" class="el-form-item__label" style="width: 100px;">商品名称：</label>
                <div class="el-form-item__content" style="margin-left: 80px;">
                    {{priceInfo.name}}
                </div>
            </div>
            <div class="el-form-item">
                <label for="score" class="el-form-item__label" style="width: 100px;">当前售价：</label>
                <div class="el-form-item__content" style="margin-left: 80px;">
                    {{priceInfo.score}} 学分
                </div>
            </div>
            <el-form :model="priceInfo" label-width="100px" :rules="rules" ref="scoreForm">
                <el-form-item label="修改售价：" prop="newScore">
                    <el-input v-model.number="priceInfo.newScore" placeholder="请输入当前售价">
                         <template slot="append">学分</template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">确定</el-button>
                    <el-button @click="dialog.edit = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import DateRange from '../../../component/form/DateRangePicker.vue'
    import SelectScroll from '../../../component/form/SelectScroll.vue'
    import testProductService from 'services/server/store/testProductService'
    import testCategoryService from 'services/server/store/testCategoryService'
    import * as _ from 'utils/common'

    export default{
        data () {
            return {
                loadingData: false,
                data: [],
                selectedIds: [],
                fetchParam: this.newFetchParam(),
                categroyArr: {},
                dialog: {
                    edit: false
                },
                editDialog: '修改售价',
                priceInfo: {},
                rules: {
                    newScore: [
                        {required: true, message: '请输入售价'},
                        {type: 'number', min: 0, message: '请输入正整数', trigger: 'blur'},
                    ],
                },
            }
        },
        activated () {
            this.fetchData()
        },
        created () {
        },
        methods: {
            initFetchParam () {
                this.fetchParam = this.newFetchParam()
                this.fetchData()
            },
            fetchData () {
                xmview.setContentLoading(true)
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.status = (!fetchParam.status && fetchParam.status !== 0) ? -1 : fetchParam.status
                testProductService.search(fetchParam).then((ret) => {
                    this.data = ret.data
                    this.fetchParam.page_total = ret.total
                    this.selectedIds = []
                    xmview.setContentLoading(false)
                })
            },
            // 获取分类
            fetchCategory (keyword, length) {
                if (!length) {
                    length = 1
                }
                let page = parseInt(length / 10) + 1
                return testCategoryService.search({keyword, page}).then((ret) => {
                    let result = {
                        data: [],
                        total: ret.total
                    }
                    if (ret.data == null) {
                        ret.data = []
                    }
                    ret.data.forEach((value) => {
                        result.data.push({
                            id: value.id,
                            name: value.name,
                        })
                    })

                    return result
                })
            },
            changeCategory (val) {
                this.fetchParam.category_id = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                if (this.fetchParam.page != val) {
                    this.fetchParam.page = val
                    this.fetchData()
                }
            },
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            changeCategroy (val) {
                this.fetchParam.category_id = val
                this.fetchData()
            },
            newFetchParam () {
                return {
                    name: '',
                    category_id: '',
                    status: '',
                    time_start: void '',
                    time_end: void '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            },
            changePrice (index, row) {
                this.editDialog = '修改售价'
                this.dialog.edit = true
                this.priceInfo = {
                    id: row.id,
                    name: row.name,
                    score: row.score,
                    newScore: void 0,
                }
            },
            online (index, row) {
                if(row.stock==0){
                     xmview.showTip('error', '库存数量不足，不能上架')
                }else{
                    testProductService.online(row.id).then(() => {
                    row.status = 0
                    xmview.showTip('success', '操作成功')
                    this.fetchData()
                })
                }
                
            },
            offline (index, row) {
                return testProductService.offline(row.id).then(() => {
                    row.status = 1
                    xmview.showTip('success', '操作成功')
                    this.fetchData()
                })
            },
            // 提交当前售价
            submitForm () {
                this.$refs['scoreForm'].validate((pass) => {
                    if (!pass) {
                        return
                    }
                    return testProductService.updateScore(this.priceInfo.id, this.priceInfo.newScore).then(() => {
                        this.dialog.edit = false
                        this.fetchData()
                    })
                })
            },
            closeDialog () {
                this.dialog.edit = false
                this.$refs['scoreForm'].resetFields()
            }

        },
        components: {
            DateRange,
            SelectScroll
        }
    }
</script>
