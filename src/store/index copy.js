import Vue from 'vue';
import Vuex from 'vuex';
import api from '../utils/axios';
// import { v } from '@/assets/js/es6-learn/circleplus';
Vue.use(Vuex);

const state = {
    _referenceScale: 9244650,
    _defaultView: '', //默认地图view
    _defaultMapTreeVisible: false, //该数据供maptools控制maptree是否显示，默认false,即maptree某栏不显示
    _defaultXZQHVisible: false, //行政区划面板显示/隐藏
    _defaultQueryResultVisible: false, //空间查询结果面板
    _defaultQueryResult: [], //空间查询结果
    _defaultTimeBarVisible: false, //时间条模块
    _defaultTimeInfoVisible: false, //时间选择模块
    _defaultOneRadarVisible: false, //单场显示雷达
    _defaultShowUserLogin: false, //显示用户登录、注册面板
    _ParticleDataType: 0, //粒子动画：'wind'是1，'wave':2，'cur'是3
    _DIYDistence: 0, //不应该放在vux来着，应该用arcgis prop属性或者
    _TimeSelected: '', //默认选择时间'',
    //#用户信息记得拆出去
    token: null,
    activeName: 'first',
    username: ''
};

const getters = {
    _getReferenceScale() {
        return state._referenceScale;
    },
    _getDefaultView() {
        return state._defaultView;
    },
    _getDefaultMapTreeVisible() {
        return state._defaultMapTreeVisible;
    },
    _getDefaultXZQHVisible() {
        return state._defaultXZQHVisible;
    },
    _getDefaultQueryResultVisible() {
        return state._defaultQueryResultVisible;
    },
    _getDefaultQueryResult() {
        return state._defaultQueryResult;
    },
    _getDefaultTimeBarVisible() {
        return state._defaultTimeBarVisible;
    },

    _getDefaultTimeInfoVisible() {
        return state._defaultTimeInfoVisible;
    },
    _getDefaultOneRadarVisible() {
        return state._defaultOneRadarVisible;
    },
    _getDefaultShowUserLogin() {
        return state._defaultShowUserLogin;
    },
    _getParticleDataType() {
        return state._ParticleDataType;
    },
    _getTimeSelected() {
        return state._TimeSelected;
    },
    //
    getToken() {
        return state.token;
    },
    getactiveName() {
        return state.activeName;
    },
    getUserName() {
        return state.username;
    }
};

const mutations = {
    _setReferenceScale(state, value) {
        state._referenceScale = value;
    },
    _setDefaultView(state, value) {
        state._defaultView = value;
    },
    _setDefaultMapTreeVisible(state, value) {
        state._defaultMapTreeVisible = value;
    },
    _setDefaultXZQHVisible(state, value) {
        state._defaultXZQHVisible = value;
    },
    _setDefaultQueryResultVisible(state, value) {
        state._defaultQueryResultVisible = value;
    },
    _setDefaultQueryResult(state, value) {
        state._defaultQueryResult = value;
    },

    _setDefaultTimeBarVisible(state, value) {
        state._defaultTimeBarVisible = value;
    },
    _setDefaultTimeInfoVisible(state, value) {
        state._defaultTimeInfoVisible = value;
    },
    _setDefaultOneRadarVisible(state, value) {
        state._defaultOneRadarVisible = value;
    },
    _setDefaultShowUserLogin(state, value) {
        state._defaultShowUserLogin = value;
    },
    _setParticleDataType(state, value) {
        state._ParticleDataType = value;
    },
    _setTimeSelected(state, value) {
        state._getTimeSelected = value;
    },

    LoginIn(state, data) {
        // setToken
        localStorage.setItem('token', data);
        state.token = data;
    },
    LoginOut(state) {
        // setActiveName
        localStorage.removeItem('token');
        state.activeName = null;
    },
    setUserName(state, data) {
        localStorage.setItem('username', data);
        state.username = data;
    }
};
const actions = {
    UserLogin({ commit }, data) {
        const { username, password } = data;
        // console.log('进入action1');
        return new Promise((resolve, reject) => {
            api.UserLogin({ username, password }).then(({ data }) => {
                // console.log('action data', data);
                commit('LoginIn', data.result);
                commit('setUserName', username);
                commit('_setDefaultShowUserLogin', false); //控制面板弹
                resolve();
                // resolve(true);#这里是返回方式，但是发现至少目前没有返回数据的必要，action中已经解决全部逻辑
                //其实只返回code就可以或者code也可以在这里处理。
                // 算了，就在vue吧，简单控制一下面板的弹回就行
            });
        });
    },

    UserLogout({ commit }) {
        commit('LoginOut');
    },

    // UserName({ commit }, data) {
    //     commit('setUserName', data);
    // }

    UserRegister({ commit }, data) {
        const { username, password, is_admin } = data;
        // 这里也路由写email phone 但没必要,后台也没写，如果加的话，要改user.controller里的注册函数（主要是修改接受参数），user.service里面加一个参数的判别，user.model不用改，email、phone本来是定义了的
        // console.log('进入action UserRegiste');
        return new Promise((resolve, reject) => {
            api.userRegister({ username, password, is_admin }).then(({ data }) => {
                // console.log('action data', data);
                // #如果没有操作store状态，没必要这么写，但是后来要是把loginSwitch加到vuex，就可以在这里操作loginSwitch状态了
                resolve();
            });
        });
    }
};

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});

export default store;
