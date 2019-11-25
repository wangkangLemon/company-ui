<style lang='scss' rel='stylesheet/scss'>
    @import "~utils/mixins/common";

    #test-content-container {
        @extend %content-container;
        border: none;
        .manage-container {
            @extend %right-top-btnContainer;
            > * {
                color: #fff;
                border-radius: 5px;
            }
            .add {
                background: rgb(0, 204, 255);
            }
            .catmange {
                background: rgb(153, 102, 204);
            }
        }
    }
</style>
<template>
    <section id="test-content-container">
        <keep-alive exclude="score-product-edit,score-product-add">
            <router-view></router-view>
        </keep-alive>
    </section>
</template>

<script>
    export default {}
</script>
