<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-flowing-medicine-container {
        @extend %content-container;
    }
</style>

<template>
    <main id="member-flowing-medicine-container">
        <orderDetail :data="data"></orderDetail>
    </main>
</template>

<script>
    import orderDetail from '../component/orderDetail.vue'
    import flowingService from 'services/member/flowingService'

    export default {
        components: {
            orderDetail
        },
        props: {},
        activated () {},
        created () {
            this.fetchParam.customer_crowd_id = this.$route.query.customer_crowd_id
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                data: [],
                fetchParam: {
                    customer_crowd_id: '',
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return flowingService.getDrugList(this.fetchParam).then(ret => {
                    this.data = ret.list
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
