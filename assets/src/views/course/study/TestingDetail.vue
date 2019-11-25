<style lang="scss">
    @import "~utils/mixins/testingDetail";
    #testingdetail-container {
        // font-size: 20px;
        padding: 15px;
        padding-left: 50px;
        background: #fff;
        .subject__title {
            margin-bottom: 5px;
        }
    }
</style>

<template>
    <main id="testingdetail-container" v-loading="loading">
        <legend class="pull-left width-full">
            图注：
            <small> 
                <i class="fa fa-check-circle"></i>
                正确
                <i class="fa fa-times-circle"></i>
                错误
                <i class="fa fa-exclamation-circle"></i>
                漏选
            </small>
        </legend>
        <el-row v-for="subject in data.Subjects" :key="subject.ID" class="subject">
            <el-col :span="24" class="subject__title">
                <h4>
                    <span class="label label-default m-r-5">{{subject.Type | type}}</span>
                    {{subject.Description}}
                    <small> {{subject.HasAnswer ? '' : '(未作答)'}}</small> 
                </h4>
            </el-col>
            <el-col :span="12" class="options">
                <dl class="dl-horizontal">
                    <template v-for="option in subject.Options" v-if="subject.Type!=2">
                        <dt>
                            <i :class="option.UserAnswerStatus | statusClass" class="fa"></i>
                        </dt>
                        <dd>{{option.Description}}</dd>
                    </template>
                    <template v-else>
                        <dt>
                            <i :class="option.UserAnswerStatus | statusClass" class="fa"></i>
                        </dt>
                        <dd>{{option.Description}}</dd>
                    </template>
                </dl>
            </el-col>
        </el-row>
    </main>
</template>

<script>
    import testingService from 'services/course/hisotyService'

    export default {
        components: {},
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
                loading: false,
                data: [],
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return testingService.getTestingDetail(this.$route.query.id).then(ret => {
                    this.data = ret.data
                    this.loading = false
                })
            }
        },
        filters: {
            type (val) {
                let map = {
                    0: '判断',
                    1: '单选',
                    2: '多选'
                }
                return map[val]
            },
            statusClass (val) {
                let map = {
                    0: 'fa-circle-o',
                    1: 'fa-check-circle',
                    2: 'fa-times-circle',
                    3: 'fa-exclamation-circle'
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
