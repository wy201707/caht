import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './routers/router';
import store from './store';
import axios from './utils/axios';
import './font_4018410_27gy8zcpncb/iconfont.css';
// import axios from 'axios'; //这个估计会整体拎出去
// import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
// axios.defaults.timeout = 10000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.baseURL = 'http://localhost:3003';

// Vue.prototype.$axios = axios;

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
    axios,
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');
