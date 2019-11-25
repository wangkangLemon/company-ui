<template>
    <div>
        <AddForm ref="form" :paper="form" :onSubmit="submitForm">
        </AddForm>
    </div>
</template>
<script>
    import AddForm from './Form.vue'
    import Paper from 'models/paper'

    export default {
        name: 'exam-paper-add',
        components: {AddForm},
        data () {
            let paper = new Paper()
            paper.type = 'exam'
            return {
                form: paper
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        methods: {
            submitForm () {
                this.$refs['form'].validateForm((pass) => {
                    if (!pass) {
                        xmview.showTip('error', '您填写的数据不对，请检查红色项')
                        return
                    }
                    this.form.save().then(() => {
                        xmview.showTip('success', '操作成功')
                        this.$router.push({name: 'test-paper-index'})
                    })
                })
            },
        }
    }
</script>
