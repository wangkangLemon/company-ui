<template>
    <div>
        <EditForm ref="form" :paper="form" :on-submit="submitForm">
        </EditForm>
    </div>
</template>
<script>
    import EditForm from './Form.vue'
    import Paper from 'models/paper'

    export default {
        name: 'exam-paper-edit',
        components: {EditForm},
        data () {
            let paper = new Paper()
            return {
                form: paper
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        mounted () {
            this.form.findById(this.$route.params.exam_id, this.$refs.form)
        },
        methods: {
            submitForm () {
                this.$refs['form'].validateForm((pass) => {
                    if (!pass) {
                        xmview.showTip('error', '您填写的数据不对，请检查红色项')
                        return
                    }
                    this.form.save(this.$refs.form).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.$router.push({name: 'test-paper-index'})
                    })
                })
            },
        }
    }
</script>
