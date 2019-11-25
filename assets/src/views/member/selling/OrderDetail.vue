<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-selling-medicine-container {
        @extend %content-container;
    }
</style>

<template>
    <main id="member-selling-medicine-container">
        <orderDetail :data="data"></orderDetail>
    </main>
</template>

<script>
    import orderDetail from '../component/orderDetail.vue'
    import sellingService from 'services/member/sellingService'

    export default {
        components: {
            orderDetail
        },
        props: {},
        activated () {},
        created () {
            this.order_id = this.$route.query.order_id
            if (this.$route.query.time) xmview.setContentTitle(`${this.$route.meta.title} - ${this.$route.query.time}`)
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
                order_id: '',
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return sellingService.getOrderDetail(this.order_id).then(ret => {
                    this.data = [ret]
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
