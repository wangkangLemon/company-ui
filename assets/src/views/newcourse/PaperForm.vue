<template>
    <div>
        <AddForm 
            ref="form" 
            :paper="paper"
            :needStudyScore="false"
            :publishType="false"
            :on-submit="submitForm">
        </AddForm>
    </div>
</template>
<script>
    import AddForm from '../exam/paper/Form.vue'

    export default {
        components: {AddForm},
        props: {
            onSubmit: Function,
            paper: {
                type: Object,
                required: true
            }
        },
        methods: {
            submitForm () {
                this.$refs['form'].validateForm((pass) => {
                    if (!pass) {
                        return
                    }

                    this.onSubmit(this.$refs.form)
                })
            },
        }
    }
</script>
