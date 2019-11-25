<!--视频管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #course-manage-video-container {
        @extend %content-container;

        .manage-container {
            position: absolute;
            right: 0;
            top: -50px;
            > * {
                color: #fff;
                border-radius: 5px;
            }

            // 添加课程
            .add {
                background: rgb(0, 204, 255);
            }

        }

        .search {
            @extend %top-search-container;
        }

        // 底部的管理按钮
        .bottom-manage {
            margin-top: 15px;
            display: inline-block;
        }

    }
</style>

<template>
    <article id="course-manage-video-container">
        <section class="manage-container">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({name:'manage-video-add'})"><i>上传视频</i>
            </el-button>
        </section>
        <article class="search">
            <section>
                <i>视频</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>

            <section>
                <i>状态</i>
                <el-select clearable v-model="fetchParam.status" placeholder="请选择" @change="fetchData">
                    <el-option label="转码中" :value="1"></el-option>
                    <el-option label="转码失败" :value="2"></el-option>
                    <el-option label="待审核" :value="0"></el-option>
                    <el-option label="审核成功" :value="3"></el-option>
                    <el-option label="审核失败" :value="4"></el-option>
                </el-select>
            </section>
            <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       @changeStart="val=> {fetchParam.time_start=val}"
                       @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
            </DateRange>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  border>
            <el-table-column
                min-width="230"
                prop="name"
                label="视频名称">
                <span slot-scope="{row}">
                    {{row.name}}
                    <el-tooltip 
                        v-if="row.product_name"
                        class="item" 
                        effect="dark" 
                        :content="'已关联产品' + row.product_name"
                        placement="top-start">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </span>
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="duration_name"
                    label="时长">
            </el-table-column>
            <el-table-column
                    width="120"
                    label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0">待审核</el-tag>
                    <el-tag v-else-if="scope.row.status == 1" type="warning">转码中
                        <el-button type="text" v-if="scope.row.status == 1" size="small" @click="refreshStatus(scope.$index, scope.row)">
                            <i class="el-icon-refresh" title="点击重试"></i>
                        </el-button>
                    </el-tag>
                    <el-tag v-else-if="scope.row.status == 2" type="danger">转码失败</el-tag>
                    <el-tag v-else-if="scope.row.status == 3" type="success">审核成功</el-tag>
                    <el-tag v-else-if="scope.row.status == 4" type="danger">审核失败
                        <el-tooltip class="item" effect="dark" :content="scope.row.remark ? scope.row.remark: '暂无备注'" placement="bottom">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-tag>

                </template>
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    width="150"
                    label="操作">
                <template slot-scope="scope">
                    <el-button 
                        @click="preview(scope.$index, scope.row)" 
                        type="text" 
                        size="small"
                        v-if="scope.row.status == 0">
                        播放
                    </el-button>
                    <el-button 
                        @click="edit(scope.$index, scope.row)" 
                        type="text" 
                        size="small"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        编辑
                    </el-button>
                    <el-button 
                        @click="del(scope.$index, scope.row)" 
                        type="text" 
                        size="small"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagin"
            @size-change="val => {fetchParam.page_size = val}"
            @current-change="val => {fetchParam.page = val}"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[15, 30, 60, 100]"
            layout="sizes,total, prev, pager, next"
            :total="total">
        </el-pagination>

        <el-dialog :title="dialogAdd.title" v-if="dialogAdd.isShow" :visible.sync="dialogAdd.isShow">
            <el-form label-position="right" label-width="80px" :model="videoModel">
                <el-form-item label="视频名称">
                    <el-input v-model="videoModel.name"></el-input>
                </el-form-item>
                <el-form-item label="视频封面">
                    <UploadImg :defaultImg="videoModel.cover | fillImgPath" :url="uploadImgUrl"
                               :onSuccess="handleOnUploaded"></UploadImg>
                </el-form-item>
                <el-form-item label="视频时长">
                    <el-input v-model="videoModel.duration"></el-input>
                </el-form-item>
                <el-form-item label="视频标签">
                    <vTags v-model="videoModel.tags"></vTags>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAdd.isShow = false">取 消</el-button>
                <el-button type="primary" @click="dialogAdd.confirmFn">确 定</el-button>
            </div>
        </el-dialog>

        <VideoPreview :url="videoUrl" ref="videoPreview"></VideoPreview>
    </article>
</template>

<script>
    import CourseCategorySelect from '../../component/select/CourseCategory.vue'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import vTags from '../../component/form/Tags.vue'
    import VideoPreview from '../../component/dialog/VideoPreview.vue'
    import UploadImg from '../../component/upload/UploadImg.vue'

    import * as _ from 'utils/commonUtils'
    // import config from '../../../utils/config'
    import courseService from 'services/course/videoService'

    function getVideoModel () {
        return {
            name: void 0,
            cover: void 0,
            duration: void 0,
            tags: [],
            time_start: void 0,
            time_end: void 0
        }
    }
    function getFetchParam () {
        return {
            company_id: void 0,
            status: void 0,
            keyword: void 0,
            page: 1,
            page_size: 15,
            time_start: '',
            time_end: ''
        }
    }
    export default{
        data () {
            return {
                loadingData: false,
                total: 0,
                data: [],
                selectedIds: [], // 选中的id
                uploadImgUrl: '', // 上传图片的url
                fetchParam: getFetchParam(),
                dialogAdd: {
                    isShow: false,
                    title: '添加课程',
                    confirmFn: {}
                },
                videoModel: getVideoModel(),
                videoUrl: '' // 预览的视频url
            }
        },
        watch: {
            'fetchParam.page_size' () {
                this.fetchData()
            },
            'fetchParam.page' () {
                this.fetchData()
            }
        },
        created () {
            this.uploadImgUrl = courseService.getVideoUploadCoverUrl()
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        // activated () {
        //     this.fetchData().then(() => {
        //         xmview.setContentLoading(false)
        //     })
        // },
        methods: {
            initFetchParam () {
                this.fetchParam = getFetchParam()
            },
            fetchData () {
                this.loadingData = true
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.status = (fetchParam.status !== 0 && !fetchParam.status) ? -1 : fetchParam.status
                return courseService.getVideo(fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            add () {
                this.dialogAdd.isShow = true
                this.videoModel = getVideoModel()
            },
            edit (index, row) {
                this.dialogAdd.title = '编辑视频'
                this.dialogAdd.isShow = true
                this.videoModel = JSON.parse(JSON.stringify(row))
                this.videoModel.tags = this.videoModel.tags ? this.videoModel.tags.split(',') : []

                this.dialogAdd.confirmFn = () => {
                    courseService.updateVideo(this.videoModel).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.fetchData()
                        this.dialogAdd.isShow = false
                    })
                }
            },
            del (index, row) {
                xmview.showDialog(`你将要删除视频 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                    this.loadingData = true
                    courseService.deleteVideo({id: row.id}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.loadingData = false
                        this.fetchData()
                    }).catch(() => {
                        this.loadingData = false
                    })
                })
            },
            delMulti () {
                xmview.showDialog(`你将要删除选中的视频，操作不可恢复确认吗?`, () => {
                    this.loadingData = true
                    courseService.deleteVideoMulty({id: this.selectedIds.join(',')}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.fetchData() // 重新刷新数据
                    })
                })
            },
            // 预览视频
            preview (index, row) {
                // 拿到播放地址
                courseService.getVideoPreviewUrl(row.id).then((ret) => {
                    this.videoUrl = ret.video
                    this.$refs.videoPreview.show(row.name)
                })
            },
            // 处理图片上传完毕
            handleOnUploaded (ret) {
                this.videoModel.cover = ret.data.url
            },
            // 刷新视频状态
            refreshStatus (index, row) {
                courseService.refreshVideoStatus({id: row.id}).then((ret) => {
                    row.status = ret.data.status
                })
            }
        },
        components: {
            CourseCategorySelect, DateRange, IndustryCompanySelect, vTags, UploadImg, VideoPreview
        }
    }
</script>
