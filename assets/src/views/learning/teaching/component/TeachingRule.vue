<style lang="scss">

</style>

<template>
    <el-form label-width="120px" v-loading="loading">
        <template v-if="type === 'user'">
            <el-form-item label="教员鉴定标准" v-if="data.appraisal_user">
                <p v-for="(standard,index) in data.appraisal_user.standards" :key="index">
                    {{standard.level | level}}{{standard.inequation | inequation}}{{standard.value}}个
                </p>
                <p>{{data.appraisal_user.is_pass_exam === 1 ? '通过' : '不通过'}}结业考试</p>
                <p>通过{{data.appraisal_user.pass_phase_number}}个周期</p>
            </el-form-item>
        </template>
        <template v-else>
            <el-form-item label="学员鉴定标准" v-if="data.appraisal_coacher">
                <p v-for="(standard,index) in data.appraisal_coacher.standards" :key="index">
                    {{standard.level | level}}{{standard.inequation | inequation}}{{standard.value}}个
                </p>
                <p>学员{{data.appraisal_coacher.user_pass === 1 ? '通过' : '不通过'}}结业考试</p>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
    import teachingService from 'services/learning/teaching'

    export default {
        components: {},
        props: {
            id: Number,
            type: String
        },
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
                data: {},
                total: 0,
                fetchParam: {
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return teachingService.getTeachingRule(this.id).then(ret => {
                    this.data = ret.data
                    this.loading = false
                })
            }
        },
        filters: {
            level (val) {
                let map = {
                    0: '优',
                    1: '良',
                    2: '中',
                    3: '差',
                }
                return map[val]
            },
            inequation (val) {
                let map = {
                    0: '大于',
                    1: '小于',
                    2: '等于',
                }
                return map[val]
            },
        },
        directives: {},
    }
</script>
