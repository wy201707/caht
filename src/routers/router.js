import Vue from 'vue';
import Router from 'vue-router';
// import DataVisual from '../pages/DataVisual'
import OneMap from '../pages/OneMap';
import MoreScreen from './../components/MoreScreen';
import MapDataVisual from './../components/MapDataVisual';
import OneTime from './../components/OneTime.vue';
// import WindEcharts from './../components/WindEcharts.vue';
import MapEchart from './../components/MapEchart';
import userLogin from './../components/userLogin';
import TimeInfoOne from '@/components/TimeInfoOne.vue';
// import XZQH2JsonData from './../components/XZQH2JSONData.vue';
// import WindCanvas from '../pages/WindCanvas.vue';
// import ParticleAnimate from '@/components/ParticleAnimate'

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};
export default new Router({
    routes: [
        /*         {
            path: '/',
            component: userLogin //原先的登录界面是？？？
        }, */
        {
            path: '/',
            component: OneMap
        },
        {
            path: '/point',
            component: TimeInfoOne
        },
        // {
        //     path: '/paticle/:dataType',
        //     name: 'ParticleAnimate',
        //     component: () => import('@/pages/ParticleAnimate')
        // },
        /*      {
            path: '/paticle/:dataType',
            name: 'ParticleAnimate',
            // component: OneMap
            component: () => import('@/pages/ParticleAnimate')
        }, */
        /*         {
            path: '/main',
            // component: DataVisual //早就不行了
            // component: MapDataVisual //这是3D地图+echart ，这个可以用 0222
            component: WindCanvas
        }, */
        /*         {
            path: '/main',
            // component: DataVisual
            component: userLogin //这是地图
        }, */
        /*         {
            path: '/main',
            component: WindCanvas
        }, */
        /*  {
            path: '/onemap',
            component: OneMap
        }, */
        {
            path: '/onemap/one',
            component: MoreScreen
        },
        {
            path: '/test',
            component: OneTime
        },
        // {
        //     path:'/test2',
        //     component:WindEcharts
        // },
        {
            path: '/test2',
            component: MapEchart
        },
        /* {
            path: '/test2',
            component: XZQH2JsonData
        }, */
        {
            path: '*',
            redirect: '/' // 输入其他不存在的地址自动跳回首页
        }
    ],
    mode: 'history' //0904
    // mode: 'hash'
});
