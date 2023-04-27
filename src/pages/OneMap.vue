<template>
    <div class="onemap-page">
        <MapView />
        <MapTools />
        <!-- <MapTree />
        <XZQHComponent />
        <ResultTable /> -->
        <!-- <TimeBar /> -->
        <!-- <InfoPlane /> -->
        <TimeInfo />
        <!-- <OneTime /> -->
        <TimeInfoOne />
        <!-- <XZQH2JSONData /> -->
        <UserLogin />
        <!-- <WindCanvas /> -->
        <ParticleAnimate />
        <SetTime />
        <SetTime2 />
        <!-- <SetTime :show="TimePanelVisible" @close="closeTimePanel" /> -->
    </div>
</template>

<script>
// import MapView from './../components/MapView';
import MapView from '../components/MapView';
import MapTools from '../components/MapTools';
/* import MapTree from '../components/MapTree'; */
/* import XZQHComponent from './../components/XZQHComponent'; */
// import TimeBar from './../components/TimeBar.vue';
import TimeInfo from './../components/TimeInfo';
// import OneTime from './../components/OneTime.vue';
// import InfoPlane from './../components/TimeInfo.vue';
/* import ResultTable from './../components/ResultTable'; */
import TimeInfoOne from './../components/TimeInfoOne.vue';
/* import XZQH2JSONData from './../components/XZQH2JSONData.vue'; */
import UserLogin from './../components/userLogin.vue';
import ParticleAnimate from './ParticleAnimate.vue';
// import WindCanvas from './../components/WindCanvas.vue';
import SetTime from './../components/SetTime.vue';
import SetTime2 from './../components/SetTime copy.vue';
export default {
    name: 'OneMap',
    components: {
        MapView,
        MapTools,
        // MapTree,
        // XZQHComponent,
        // ResultTable,
        // TimeBar
        // InfoPlane,
        TimeInfo,
        // OneTime,
        TimeInfoOne,
        // XZQH2JSONData,
        UserLogin,
        // WindCanvas.
        ParticleAnimate,
        SetTime,
        SetTime2
    },
    data() {
        return {
            // TimePanelVisible: false
        };
    },
    methods: {
        /*         openTimePanel() {
            this.TimePanelVisible = true;
        },
        closeTimePanel() {
            this.TimePanelVisible = false;
            // @click="openTimePanel"
        } */
    }
};
</script>

<style scoped>
.onemap-page {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
