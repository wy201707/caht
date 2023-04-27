 
<template>
    <!-- 思路1：//router.js   path: '/paticle/:dataType',
    //app.vue  push（）
    //paticleAnimate 重新建立地图
        <MapView />
        <MapTools />
        <TimeInfo />
        <TimeInfoOne />
        <UserLogin />
    优点用到了vue-router，缺点：逻辑不对，没必要重建
    应该类似TimeInfoOne
    -->
    <div id="onemap-page">
        <MapView />
        <MapTools />
        <TimeInfo />
        <TimeInfoOne />
        <UserLogin />
        <span>目前是啥情况？</span>
        <p v-if="typeof $route.params.dataType !== \"undefined\" " > {{ $route.params.dataType }}</p>
    </div>
</template>

<script>
import MapView from '../components/MapView';
import MapTools from '../components/MapTools';
import TimeInfo from './../components/TimeInfo';
import TimeInfoOne from './../components/TimeInfoOne.vue';

import UserLogin from './../components/userLogin.vue';

export default {
    name: 'PaticleAnimate',
    computed: {
        dataType() {
            return this.$route.params.dataType;
        }
    },
    components: {
        MapView,
        MapTools,
        TimeInfo,
        TimeInfoOne,
        UserLogin,
    },
    mounted() {}
};
</script>

<style scoped>
    .{
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
