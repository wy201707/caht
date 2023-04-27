<template>
    <div class="map-view">
        <!-- 可以加个slot显示时间 -->
        <p v-if="$store.getters._getTimeSelected !== ''">{{ $store.getters._getTimeSelected }}</p>

        <span>目前是啥情况？</span>
        <!-- <p v-if="typeof $route.params.id !== 'undefined'">ID: {{ $route.params.id }}</p>
        <p v-if="typeof $route.params.dataType !== undefined">{{ $route.params.dataType }}</p> -->
    </div>
</template>

<script>
export default {
    name: 'PaticleAnimate',
    computed: {
        dataType() {
            return this.$route.params.dataType;
        }
    },
    components: {},
    mounted() {}
};
</script>

<style scoped>
.map-view {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
