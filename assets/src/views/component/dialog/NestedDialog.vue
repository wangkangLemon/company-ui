<script>
    import ElementUI from 'element-ui'

    export default {
        name: 'NestedDialog',
        mixins: [ElementUI.Dialog],
        props: {
            appendToBody: {
                type: Boolean,
                default: true
            }
        },
        mounted () {
            if (this.appendToBody) {
                document.body.appendChild(this.$el)
            }
        },
        destroyed () {
            if (this.appendToBody) {
                document.body.contains(this.$el) && document.body.removeChild(this.$el)
            }
        },
    }
</script>
