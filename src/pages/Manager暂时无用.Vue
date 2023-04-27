<template>
    <div class="Manager-page">
        <User-login />
        还没挂载到路由上，好像也没必要了，等等可以做图层管理那个组件（感觉所有放在一个组件上会不会累呀？）
        而且结果（尤其是与地图无关的）加载onemap组件上好像也不是很合理
    </div>
</template>

<script>
// import InfoPlane from './../components/TimeInfo.vue';
import ResultTable from './../components/ResultTable';
import UserLogin from './../components/userLogin.vue';

export default {
    name: 'Manager',
    components: {
        //    ResultTable,
        UserLogin
    },
    methods: {}
};
</script>

<style scoped>
.Manager-page {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
