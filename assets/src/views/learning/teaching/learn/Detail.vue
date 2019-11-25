<style lang="scss">
    @import "~utils/mixins/common";
    // @import "~utils/mixins/mixins";
    #teaching-learn-detail {
        @extend %content-container;
        header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            p:first-child {
                font-weight: bold;
            }
            .mark {
                display: inline-block;
                width: 60px;
                line-height: 25px;
                text-align: center;
                border-radius: 20px 0;
            }   
            .mark__green {
                background: #A5C37C;
            }
            .mark__red {
                background: #FF4724;
            }
        }
        .evaluate {
            padding: 30px;
            margin: 30px 0;
            box-shadow: 2px 1px 20px -2px rgba(0, 0, 0, 0.2);
            .col__line {
                border-right: 1px solid #d8d8d8;
            }
        }
        footer {
            margin: 0 auto;
            width: 155px;
        }
    }
</style>

<template>
    <main id="teaching-learn-detail">
        <header>
            <p>带教名称: {{content.title}}</p>
            <p>
                <i :class="['mark', content.admin_appraisal_user === '合格' ? 'mark__green' : 'mark__red']">{{content.admin_appraisal_user}}</i>
                学员: {{content.user_name}}
            </p>
            <p>
                <i :class="['mark', content.admin_appraisal_coacher === '合格' ? 'mark__green' : 'mark__red']">{{content.admin_appraisal_coacher}}</i>
                教员: {{content.coacher_name}}
            </p>
            <template v-if="content.finish_exam_status==='已通过'">
                <p>结业考试成绩: </p>
                <p>
                    系统考评: 学员
                    <i :class="['mark', content.system_appraisal_user === '合格' ? 'mark__green' : 'mark__red']">
                        {{content.system_appraisal_user}}
                    </i>
                    教员
                    <i :class="['mark', content.system_appraisal_coacher === '合格' ? 'mark__green' : 'mark__red']">{{content.system_appraisal_coacher}}
                    </i>
                </p>
            </template>
            <template v-else>
                <p>进度: {{content.current_phase}}/{{content.total_phase}}</p>
            </template>
        </header>
        <section class="evaluate">
            <el-row :gutter="50">
                <el-col :span="12" class="col__line">
                    <el-form>
                        <el-form-item label="教员自评:">
                            {{appraisal.coacher_self}}
                        </el-form-item>
                        <el-form-item label="教员鉴定学员:">
                            <el-table class="data-table" :data="appraisal.coacher_user.standards" :fit="true" border>
                                <el-table-column 
                                    label="指标" 
                                    prop="name">
                                </el-table-column>
                                <el-table-column 
                                    label="学员获得评级" 
                                    prop="value">
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-form-item label="教员评价学员:">
                            {{appraisal.coacher_user.remark}}
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12">
                    <el-form>
                        <el-form-item label="学员自评:">
                            {{appraisal.user_self}}
                        </el-form-item>
                        <el-form-item label="学员鉴定教员:">
                            <el-table class="data-table" :data="appraisal.user_coacher.standards" :fit="true" border>
                                <el-table-column 
                                    label="指标" 
                                    prop="name">
                                </el-table-column>
                                <el-table-column 
                                    label="教员获得评级" 
                                    prop="value">
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-form-item label="学员评价教员:">
                            {{appraisal.user_coacher.remark}}
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </section>
        <section class="evaluate">
            <el-row :gutter="50">
                <el-col :span="12" class="col__line">
                    <el-form>
                        <template v-if="!appraisal.admin_user">
                            <el-form-item>
                                <Evaluate 
                                    ref="user"
                                    :template-key="appraisal_admin_user" 
                                    @submit="(val) => { this.user = val }">
                                </Evaluate>
                            </el-form-item>
                        </template>
                        <template v-else>
                            <el-form-item label="管理员评价学员:">
                                {{appraisal.admin_user.remark}}
                            </el-form-item>
                            <el-form-item label="管理员鉴定学员:">
                                <span 
                                    v-for="(standard, index) in appraisal.admin_user.standards"
                                    :key="index">
                                    {{standard.value}}
                                </span>
                            </el-form-item>
                        </template>
                    </el-form>
                </el-col>
                <el-col :span="12">
                    <el-form>
                        <template v-if="!appraisal.admin_coacher">
                            <el-form-item>
                                <Evaluate 
                                    ref="coacher"
                                    :template-key="appraisal_admin_coacher" 
                                    @submit="(val) => { this.coacher = val }">
                                </Evaluate>
                            </el-form-item>
                        </template>
                        <template v-else>
                            <el-form-item label="管理员评价教员:">
                                {{appraisal.admin_coacher.remark}}
                            </el-form-item>
                            <el-form-item label="管理员鉴定教员:">
                                <span 
                                    v-for="(standard, index) in appraisal.admin_coacher.standards"
                                    :key="index">
                                    {{standard.value}}
                                </span>
                            </el-form-item>
                        </template>
                    </el-form>
                </el-col>
            </el-row>
        </section>
        <footer>
<!--             <el-button 
                type='primary' 
                @click="close">
                关闭
            </el-button> -->
            <el-button 
                v-if="!appraisal.admin_coacher || !appraisal.admin_user"
                type='primary' 
                @click="submit">
                提交
            </el-button>
        </footer>
    </main>
</template>

<script>
    import teachingService from 'services/learning/teaching'
    import Evaluate from '../component/Evaluate.vue'

    export default {
        name: 'teaching-learn-detail',
        components: {
            Evaluate
        },
        props: {},
        activated () {
        },
        created () {
            Object.keys(this.$route.query).forEach(key => {
                this[key] = this.$route.query[key]
            })
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                // activeNames: ['user', 'coacher', 'admin'],
                content: {},
                appraisal: {
                    admin_coacher: {},
                    admin_user: {},
                    coacher_user: {},
                    user_coacher: {}
                },
                user: {},
                coacher: {},
                appraisal_admin_user: '',
                appraisal_admin_coacher: ''
            }
        },
        methods: {
            fetchData () {
                return teachingService.viewTeachingLearn(this.id).then(ret => {
                    this.content = ret.data
                    this.appraisal = ret.appraisal
                })
            },
            submit () {
                let pass = Object.keys(this.$refs).every(ref => this.$refs[ref].submitForm())
                console.log('user', this.user)
                console.log('coacher', this.coacher)
                if (pass) {
                    this.$confirm('提交后评定结果不可以再修改,是否确认提交?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.user.object_id = this.coacher.object_id = this.content.id
                        this.user.isFetch = !this.appraisal.admin_user   // 没有才提交
                        this.coacher.isFetch = !this.appraisal.admin_coacher
                        try {
                            let fetch = async () => {
                                for (let param of [this.user, this.coacher]) {
                                    if (param.isFetch) {
                                        await teachingService.appraisal(param)
                                    }
                                }
                            }
                            fetch().then(() => {
                                xmview.showTip('success', '评定成功')
                                this.close()
                            }).catch(e => { console.log(e) })
                        } catch (e) {
                            console.log(e)
                        }
                    })
                }
            },
            close () {
                this.$router.replace({ name: 'teaching-learn' })
            }
        },
        filters: {
            title (val) {
                let map = {
                    user: '学员',
                    coacher: '教员',
                    admin: '管理员'
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
