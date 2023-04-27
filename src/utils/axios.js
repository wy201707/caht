import axios from 'axios'; //这个估计会整体拎出去
// import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
import { Message } from 'element-ui';
/* import {
    userFormatError,
    userAlreadyExited,
    userDoesNotExit,
    invalidToken,
    invalidPassword,
    tokenExpiredError,
    lackAdminPression
} from './err.type'; //本来想这里更详细的错误处理来自，但是觉得没必要了。
 */
axios.defaults.timeout = 10000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://localhost:3003';

const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use = instance.interceptors.request.use;

// 防抖函数
const debounce = (() => {
    let timer = null;
    return (callback, wait) => {
        clearTimeout(timer);
        timer = setTimeout(callback, wait);
    };
})();

instance.interceptors.request.use(
    (config) => {
        /*    
        #听说没序列化容易出错，但是为啥我用户登录表格就没出错？。
        // 序列化
        config.data = qs.stringify(config.data);
        // 温馨提示,若是贵公司的提交能直接接受json 格式,可以不用 qs 来序列化的
        
        https://juejin.cn/post/6844903492948082702
        */
        if (localStorage.getItem('token')) {
            config.headers.Authorization = `token ${localStorage.getItem('token')}`.replace(/(^\")|(\"$)/g, '');
        }
        return config;
    },
    (err) => {
        /*         let status = '';
        if (err.request) {
            status = err.request;
        } else if (err.response) {
            status = err.response;
        } 
        好像不对呀？？？
        */
        return Promise.reject(err);
    }
);

// axios拦截响应  这里应该判断状态
instance.interceptors.response.use(
    (response) => {
        // console.log('还有点不明白，这个响应是浏览器响应前发生拦截还是响应后发生拦截', response);
        // 答：响应发生后，处理返回结果的，后端写的返回结果在res.data
        console.log('axios.js 打印response', response);

        if (response.data && response.status != 200) {
            // const resData = response.data;
            // const code = response.data.code;

            // res.response.success这啥？是自定义结构吧？
            /*       //这些返回的状态码都是500  ，可能是后台中app.on('error', errHandler);导致的
            const stateCode = response.status;
            switch (stateCode) {
                case 400:
                case 409:
                    debounce(() => {
                        Message({
                            showClose: true,
                            message: response.data.message ? response.data.message : '服务器响应结果有问题且无对应错误问题',
                            type: 'error'
                        });
                    }, 500); //原来：5000 ，会不会时间太长了
                    break;
                case 401:
                case 412:
                    debounce(() => {
                        MessageBox.confirm(response.data.message, '系统提示', {
                            confirmButtonText: '重新登录',
                            type: 'warning',
                            showCancelButton: false,
                            showClose: false
                        })
                            .then(() => {
                                window.location.href = '/';
                            }) //跳转登录页  这里可以用this.push()吗？
                            .catch(() => {
                                window.location.href = '/';
                            }); //跳转登录页
                    }, 5000);
                    break;
                // return Promise.reject(error);
                default:
                    debounce(() => {
                        Message({
                            //  饿了么的消息弹窗组件,类似toast
                            showClose: true,
                            message: response.data.message ? response.data.message : '服务器响应结果有问题且无对应错误问题',
                            type: 'error'
                        });
                    }, 500);
            } */
            // return Promise.reject(response.data.error.message);
            return Promise.reject(response.data.message);
            // }
        }

        /*    链接：https://juejin.cn/post/6844903492948082702
         */
        return response;
    },
    (err) => {
        // 请求错误时做些事
        let errCode = '';
        let resData = null;
        if (err.response) {
            console.log('err.response', err.response);
            resData = err.response;
            errCode = err.response.data.code || 500;
        } else if (err.request) {
            console.log('err.request', err.request);
            resData = err.request;
            errCode = err.response.status || 500;
        }
        switch (errCode) {
            case 400:
            case 409:
                debounce(() => {
                    Message({
                        showClose: true,
                        message: resData.data.message ? resData.data.message : '服务器响应结果有问题且无对应错误问题',
                        type: 'error'
                    });
                }, 500); //原来：5000 ，会不会时间太长了
                break;
            case 401:
            case 412:
                debounce(() => {
                    MessageBox.confirm(resData.data.message, '系统提示', {
                        confirmButtonText: '重新登录',
                        type: 'warning',
                        showCancelButton: false,
                        showClose: false
                    })
                        .then(() => {
                            window.location.href = '/';
                        }) //跳转登录页  这里可以用this.push()吗？
                        .catch(() => {
                            window.location.href = '/';
                        }); //跳转登录页
                }, 5000);
                break;
            // return Promise.reject(error);
            default:
                debounce(() => {
                    Message({
                        //  饿了么的消息弹窗组件,类似toast
                        showClose: true,
                        message: resData.data.message ? resData.data.message : '服务器响应结果有问题且无对应错误问题',
                        type: 'error'
                    });
                }, 500);
        }
        // https://blog.csdn.net/Zzzzzzzzzzzke/article/details/122879410

        // Message({
        //     //  饿了么的消息弹窗组件,类似toast
        //     showClose: true,
        //     message: err ? err : '服务器响应结果有问题且无对应错误问题',
        //     type: 'error'
        // });
        // console.log(err);
        return Promise.reject(err);
    }
);

export default {
    // 用户注册
    userRegister(data) {
        // console.log('axios.js中的数据', data);
        return instance.post('/users/register', data);
    },
    // 用户登录
    UserLogin(data) {
        // console.log('axios.js中的数据', data);
        return instance.post('/users/login', data);
    },
    /* 	// 获取用户
	getUser() {
		return instance.get('/api/user')
	}, */
    /* 	// 删除用户--->注销账户#
	delUser(data) {
		return instance.post('/api/delUser', data)
	} */
    GetWindyData(time) {
        //这里应该是根据时间拼接成访问字符串，
        //把雷达数据放进数据库后，应该也是根据时间查询返回数据，并整理格式。
        // return instance.get('http://localhost/vuegis/static/data/windydata.json');
        return instance.get('http://localhost/vuegis/static/data/20210806_0010.json');
    }
};
