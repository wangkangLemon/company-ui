<!--文档管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";

    #course-manage-doc-container {
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
            display: inline-block;
            margin-top: 15px;
        }

        // 替换文档
        .el-form-item {
            margin-bottom: 0;
        }
    }
</style>

<template>
    <main id="course-manage-doc-container">
        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  border>
            <el-table-column
                    min-width="230"
                    prop="industry_name"
                    label="工业名称">
            </el-table-column>
            <el-table-column
                    min-width="200"
                    prop="create_time_name"
                    label="屏蔽时间">
            </el-table-column>
            <el-table-column
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click="shieldReason(scope.$index, scope.row)" type="text" size="small">屏蔽原因</el-button>
                    <el-button @click="cancelShield(scope.$index, scope.row)" type="text" size="small">取消屏蔽</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
            @size-change="val => {fetchParam.page_size = val}"
            @current-change="val => {fetchParam.page = val}"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[15, 30, 60, 100]"
            layout="sizes, total, prev, pager, next"
            :total="total">
        </el-pagination>
    </main>
</template>

<script>
    import industryService from 'services/course/industryService'
    // import config from 'utils/config'

    function getFetchParam () {
        return {
            enterprise_id: void 0, // 工业id
            course_id: void 0,
            page: 1,
            page_size: 15,
        }
    }

    export default{
        components: {
        },
        data () {
            return {
                loadingData: false,
                total: 0,
                data: [],
                fetchParam: getFetchParam(),
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
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam () {
                this.fetchParam = getFetchParam()
            },
            fetchData () {
                this.loadingData = true
                return industryService.getDeniedIndustryList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            shieldReason (index, row) {
                industryService.getDeniedIndustryReason({industry_id: row.industry_id}).then(ret => {
                    this.$alert(ret.data.reason, '屏蔽原因', {confirmButtonText: '确定'})
                })
            },
            cancelShield (index, row) {
                industryService.cancelDeniedIndustry({industry_id: row.industry_id}).then(() => {
                    xmview.showTip('success', '成功')
                    this.fetchData()
                }).catch(ret => {
                    xmview.showTip('error', ret.message || '失败')
                })
            },
        },
    }
</script>
