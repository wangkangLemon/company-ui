<!--企业幻灯片-->
<style lang='scss' rel='stylesheet/scss'>
@import "../../utils/mixins/showDetail";
@import "../../utils/mixins/topSearch";
@import "../../utils/mixins/common";
#server-slider-container {
  @extend %content-container;
  .add {
    @extend %right-top-btnContainer;
  }
  .search {
    @extend %top-search-container;
  }
  .showimg {
    display: inline-block;
    width: 50%;
  }
  .table {
    overflow: visible;
    .el-table__body-wrapper {
        overflow: visible;
    }
    .cell {
        overflow: visible;
        i.el-icon-picture {
            position: relative;
            .img-wrap {
                display: none;
                padding: 5px;
                background: #fff;
                width: 213px;
                height: 123px;
                position: absolute;
                bottom: -123px;
                right: -213px;
                z-index: 9999 ;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
  }
  .block {
    margin-top: 10px;
    text-align: right;
  }
}
</style>

<template>
    <article id="server-slider-container">
        <section class="add">
            <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
        </section>
        <section class="search">
            <section>
                <i>标题</i>
                <el-input @keyup.enter.native="fetchData" v-model="fetchParam.keyword" auto-complete="off"></el-input>
            </section>
            <section>
                <i>类型</i>
                <el-select clearable v-model="fetchParam.type" @change="fetchData">
                    <el-option 
                        v-for="item in sliderType"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value">
                    </el-option>
                </el-select>
            </section>
            <DateRange 
                title="创建时间" 
                :start="fetchParam.start_time" 
                :end="fetchParam.end_time"
                v-on:changeStart="val=> {fetchParam.start_time=val}"
                v-on:changeEnd="val=> {fetchParam.end_time=val}"
                :change="fetchData">
            </DateRange>
        </section>
        <!-- 增加修改弹窗 -->
        <el-dialog :title="dialogtitle" v-if="showdialog" :visible.sync="showdialog">
            <el-form  :model="form" :rules="rules" label-width="80px" ref="form">
                <el-form-item label="推荐类别" prop="ref_type">
                    <el-select clearable v-model="form.ref_type" @change="changeRefId">
                        <el-option 
                            v-for="item in sliderType"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <template v-for="item in refType"  v-if="form.ref_type===item.type">
                    <el-form-item :label="item.label" :prop="item.value" :key="item.type">
                        <component 
                            :is="item.component"
                            v-model="form[item.value]"
                            :type="item.type"
                            :industry="item.industry"
                            :placeholder="c_ref_type===item.type ? form.ref_name : ''">
                        </component>
                    </el-form-item>
                </template>

                <el-form-item label="展示标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                
                <el-form-item v-if="form.ref_type==='link'" label="链接地址" prop="url">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>

                <el-form-item label ="展示图片" prop="image">
                    <img v-if="form.image" :src="form.image | fillImgPath" alt="" class="showimg">
                    <div>
                        <el-button class="up-btn" type="primary" @click="() => {$refs.imgupload.chooseImg()}">上传</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input value="number" v-model="form.sort"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showdialog = false">取 消</el-button>
                <el-button type="primary" @click ="submit('form')">确 定</el-button>
            </div>
        </el-dialog>

        <ImagEcropperInput 
            :compress="1" 
            :isShowBtn="false" 
            ref="imgupload" 
            :confirmFn="imguploadFn">
        </ImagEcropperInput>
   
       <el-table border :data="dataList" v-loading="loading" class="table">
            <el-table-column
                prop ='title'
                label="标题"
                min-width="300">
                <template slot-scope="scope">
                    {{scope.row.title}}
                     <i class="el-icon-picture" v-if="scope.row.image" @mouseover="showImg" @mouseout="hideImg">
                        <div class="img-wrap">
                            <img :src="scope.row.image | fillImgPath"/>
                        </div>
                    </i>
                </template>
            </el-table-column>
            <el-table-column
                    prop ='type_name'
                    label="类型"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop ='sort'
                    label="排序"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="创建时间"
                    width="200">
            </el-table-column>
            <el-table-column prop="operate" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">
                        修改
                    </el-button>
                    <el-button type="text" size="small" @click="del(scope.$index, scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="block"
            @size-change="val=> {fetchParam.page_size=val; fetchData()}"
            @current-change="val=> {fetchParam.page=val; fetchData()}"
            :current-page="fetchParam.page"
            :page-sizes="[15, 30, 60, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
  </article>
  
</template>
<script>
import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
import CourseSelect from 'components/select/LoadMoreSelect.vue'
import DateRange from 'components/form/DateRangePicker.vue'
import sliderService from 'services/server/sliderService'
import clone from 'clone'
function clearFn () {
    return {
        keyword: '',
        type: '',
        start_time: '',
        end_time: '',
        page: 1,
        page_size: 15
    }
}
function clearForm () {
    return {
        id: '',
        title: '',
        image: '',
        sort: 0,
        ref_type: '',
        ref_id: '',
        ref_sync: 0,
        url: ''
    }
}
const sliderType = [
    {
        label: '课程',
        value: 'course'
    },
    {
        label: '课程任务',
        value: 'coursetask'
    },
    {
        label: '资讯',
        value: 'article'
    },
    {
        label: '链接',
        value: 'link'
    },
]
const refType = [
    {
        type: 'course',
        label: '选择课程',
        value: 'ref_id',
        component: 'CourseSelect',
        industry: 'private,public'
    },
    {
        type: 'coursetask',
        label: '选择任务',
        value: 'ref_id',
        component: 'CourseSelect'
    },
    {
        type: 'article',
        label: '选择资讯',
        value: 'ref_id',
        component: 'CourseSelect'
    }
]

export default {
    components: {
        CourseSelect,
        ImagEcropperInput,
        DateRange
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
            rules: {
                ref_type: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                ],
                title: {required: true, message: '必填', trigger: 'blur'},
                image: {required: true, message: '必填', trigger: 'blur'},
                url: {required: true, message: '必填', trigger: 'blur'},
                ref_id: {required: true, message: '必填'},  // 不用填写trigger,否则校验不通过
                // sort: {required: true, message: '必填', trigger: 'blur'}
            },
            refType: refType,
            sliderType: sliderType,
            c_ref_type: '',
            c_ref_id: '',
        }
    },
    activated () {
        this.fetchData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        showImg (e) {  // 显示图片
            e.target.firstChild.style.display = 'block'
        },
        hideImg (e) {
            e.target.firstChild.style.display = 'none'
        },
        fetchData () {
            this.loading = true
            return sliderService.getSliderList(this.fetchParam).then((ret) => {
                this.dataList = ret.data
                this.total = ret.total
            }).then(() => {
                this.loading = false
            })
        },
        add () {
            this.form = clearForm()
            this.dialogtitle = '添加'
            this.showdialog = true
        },
        imguploadFn (data, ext) {
            sliderService.uploadImg({
                image: data,
                alias: Date.now() + ext
            }).then((ret) => {
                xmview.showTip('success', '上传成功')
                this.form.image = ret.url
            })
        },
        del (index, row) {
            xmview.showDialog(`你将要删除 <span style="color:red">${row.title}</span>  确认吗?`, () => {
                sliderService.deleteSlider(row.id).then((ret) => {
                    xmview.showTip('success', '删除成功')
                    this.fetchData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            })
        },
        edit (row) {
            this.dialogtitle = '修改'
            this.showdialog = true
            this.form = clone(row)
            this.c_ref_type = this.form.ref_type
            this.c_ref_id = this.form.ref_id
        },
        changeRefId () {
            // let item = this.refType[this._index].type
            if (this.form.ref_type !== this.c_ref_type) {
                this.form.ref_id = ''
            } else if (!this.form.ref_id) {
                this.form.ref_id = this.c_ref_id
            }
        },
        submit (form) {
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return false
                }
                let reqFn = this.form.id ? sliderService.updateSlider : sliderService.addSlider
                reqFn(this.form).then((ret) => {
                    xmview.showTip('success', '保存成功')
                    this.showdialog = false
                    this.fetchData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            })
        }

    }

}
</script>
