<template>
    <transition name="userPlane">
        <div class="user-login-view" v-show="this.$store.getters._getDefaultShowUserLogin">
            <!-- <div v-if="!isLogined"> -->
                <!-- 待用：三元式设计本机颜色 :style="{'background':item.flag === false ? '#FFFFFF':'#F56C6C'}"-->
            <div v-show="!loginSwitch">
                <el-form ref="userInfo" :model="userInfo" label-width="80px">
                        <el-form-item label="用户名" label-position="left">
                            <el-input placeholder="请输入内容" v-model="userInfo.NameInput" clearable> </el-input>
                        </el-form-item>
                        <el-form-item label="密码" label-position="left">
                            <el-input placeholder="请输入密码" v-model="userInfo.PwdInput" show-password></el-input>
                        </el-form-item>
                        <el-form-item label-position="left">
                            <el-switch v-model="loginSwitch" active-text="注册" inactive-text="登录"></el-switch>
                        </el-form-item>
    
                        <el-form-item class="footer">
                            <el-button @click="loginVisible = false">取 消</el-button>
                            <el-button type="primary" @click="userLogin">{{ loginSwitch ? '注册' : '登录' }}</el-button>
                        </el-form-item>
                    </el-from>
                </div>
                    <!-- <el-tab-pane label="用户登录" name="first"> -->
            </div>              

            <div v-show="loginSwitch">
                <el-form ref="userInfoReg" :model="userInfoReg" label-width="80px">
                    <el-form-item label="用户名" label-position="left" required>
                        <el-input placeholder="请输入内容" v-model="userInfoReg.username" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码" :rules="rules.password2" label-position="left">
                        <el-input type="password" v-model="userInfoReg.password" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="checkPass" label="再次输入" :rules="rules.checkPass" label-position="left">
                        <el-input type="password" v-model="userInfoReg.checkPass"></el-input>
                    </el-form-item>
                    <el-form-item prop="email" label="邮箱" :rules="rules.email" label-position="left">
                        <el-input v-model="userInfoReg.email" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="身份" label-position="left">
                        <el-radio v-model="userInfo.is_admin" :label="true">管理员</el-radio>
                        <el-radio v-model="userInfo.is_admin" :label="false">普通用户</el-radio>
                    </el-form-item>
                     <el-form-item label-position="left">
                        <el-switch v-model="loginSwitch" active-text="注册" inactive-text="登录"></el-switch>
                    </el-form-item>

                    <el-form-item class="footer">
                        <el-button @click="loginVisible = false">取 消</el-button>
                        <el-button type="primary" @click="userLogin">{{ loginSwitch ? '注册' : '登录' }}</el-button>
                    </el-form-item>    
                </el-form>
                 
            </div>

            <!-- <div v-if="isLogined">
                <h2>{{ userInfo.NameInput == '' ? userInfo.NameInput_insert : userInfo.NameInput }} 登录成功啦</h2>
            </div> -->
        </div>
    
    </transition>
</template>

<script>
import api from '../utils/axios';
import qs from 'qs'; //解析数据
// import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
/* import {} from './../err.type'; //本来想这里更详细的错误处理来自，但是觉得没必要了。
// #这里是复制的后端的err.type.js */
// import {
//     userFormatError,
//     userAlreadyExited,
//     userDoesNotExit,
//     invalidToken,
//     invalidPassword,
//     tokenExpiredError,
//     lackAdminPression
// } from 'err.type'; //本来想这里更详细的错误处理来自，但是觉得没必要了。
// import {UserLogin}
export default {
    /*     computed: {
        //     // ...mapState({ showUserPlane: '_defaultShowUserLogin' })

        showUserPlane() {
            return this.$store.getters._getDefaultShowUserLogin;
        }
    }, */
    data() {
        // 密码安全性要求
        //我不想用这个
        let validatePass1 = (rule, value, callback) => {
            // 6-16位, 数字, 字母, 字符至少包含两种, 同时不能包含中文和空格
            let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;
            if (!reg.test(value)) {
                callback(new Error('密码长度需6-16位，且包含字母和字符'));
            } else {
                callback();
            }
        };
        // 监测两次密码是否相同
        let validatePass2 = (rule, value, callback) => {
            value === ''
                ? callback(new Error('请再次输入密码'))
                : value !== this.userInfo.password
                ? callback(new Error('两次输入密码不一致!'))
                : callback();
        };
        return {
            // loginVisible: false,
            isLogined: false,
            loginSwitch: false,
            // account: '',
            // password: '',
            userInfo: {
                NameInput: '',
                PwdInput: ''
            },
            // 为啥要搞一个表格，分明就是两个功能
           userInfoReg: {
                username: '',
                password: '',
                checkPass: '',
                email: '',
                is_admin: ''
                // NameInput_insert: '',
                // PwdInput_insert: '',
                // PhoneInput_insert: '',
                // EmailInput_insert: '',
                // is_admin: false,
                // PwdInput_again: ''
            }, 
            // activeName: this.$store.state.activeName,
            rules: {
                email: [
                    {
                        required: false,
                        message: '请输入邮箱地址',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        validator: validatePass1,
                        trigger: 'blur'
                    }
                ],
                checkPass: [
                    {
                        required: true,
                        message: '请再次输入密码',
                        trigger: 'blur'
                    },
                    {
                        validator: validatePass2,
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        /*         loginToDo() {
            this.$router.push('/todolist'); // 编程式路由，通过push方法，改变路由。
        }, */
        //用户登录——传到后台
        userLogin() {
            const _self = this;

            if (!_self.loginSwitch) {
                const userInfo = _self.userInfo;
                const username = userInfo.NameInput;
                const password = userInfo.PwdInput;
                // console.log(username, password);
                /*                 
                0215
                console.log('前端传值：', { username, password });
                api.UserLogin({ username, password }).then(({ data }) => {
                    console.log('返回？', data);
                }); */

                this.$store.dispatch('UserLogin', { username, password }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '登录成功'
                    });
                });
                /*.then(({username,flag}) => {
                    console.log(
                        '统一的错误处理好像并没有让程序变得简单，这里害的处理一遍,不处理了，只有登录成功的情况界面弹回'
                    );
                    console.log('看这里data', flag);
                    if (flag) {
                        this.$store.commit('_setDefaultShowUserLogin', !flag);
                    }
                    //一下之前代码，应当注释调***
                    if (!data.info) {
                            this.$message({
                                type: 'info',
                                message: '账号不存在'
                            })
                        }
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: '登录成功'
                            })
                            this.$store.dispatch('UserLogin', data.token)
                            this.$store.dispatch('UserName', data.email)
                            let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                            this.$router.push({
                                path: redirect
                            })
                        } else {
                            this.$message({
                                type: 'info',
                                message: '密码错误'
                            })
                        }
                    //以上*** 
                });
                */
            } else {
                const userInfo = _self.userInfoReg; //.trim();
                // console.log('userInfo type:', typeof userInfo);
                const username = userInfo.NameInput_insert;
                const password = userInfo.PwdInput_insert;
                const phone = userInfo.PhoneInput_insert;
                const email = userInfo.EmailInput_insert;
                const isAdmin = userInfo.is_admin;
                // console.log(name, psd);
                // #待补充校验规则
                if (!username || !password) {
                    _self.$message({
                        message: '请填写用户名或密码',
                        type: 'warning'
                    });
                    return;
                    //return会是什么效果？
                }
                this.$refs['userInfoReg'].validate((valid) => {
                    if (valid) {
                        let opt = this.userInfo;
                        console.log(opt);
                    } else {
                        console.log('Error Submit!!');
                        return false;
                    }
                });

                /*这qs用到这里好像不对
                console.log(
                    '这是什么结果',
                    qs.stringify({
                        username,
                        password,
                        phone,
                        email,
                        isAdmin
                    })
                ); 
                //username=1&password=1&phone=1&email=1&isAdmin=false
                */
                api.userRegister({
                    username,
                    password,
                    phone,
                    email,
                    isAdmin
                }).then(({ data }) => {
                    console.log('返回？', data);
                });

                // 注册成功请登录可以用到elem.confirm
                /*  axios
                    .post(
                        'http://localhost:3003/user/insert',
                        qs.stringify({
                            name,
                            psd,
                            phone,
                            email
                        })
                        //qs模块：解析数据
                    )
                    .then(function (response) {
                        if (response.data.status === 'success') {
                            _self.$message({
                                message: '注册成功，请登录',
                                type: 'success'
                            });
                        } else {
                            _self.$message.error('用户注册失败');
                        }
                    })
                    .catch(function (error) {
                        // _self.loginVisible = false;
                        console.log(error);
                    });
             */
            }
        }
    }
};
</script>

<style scoped>
.userPlane-enter-active {
    transition: all 1s;
}

.userPlane-leave-active {
    transition: all 2s;
}

.userPlane-enter,
.userPlane-leave-to {
    opacity: 0;
    transform: translateX(90px);
    /* 这里移动幅度大写，略大于面板宽度 */
}
/* .login-content {
    color: #32373e;
} */

.user-login-view {
    position: absolute;
    /* padding: 15px 15px; */
    /* height: 80%; */
    /* width: 95%; */
    /* 弹性盒子，实现元素居中 */
    /* display: flex;
    justify-content: center;
    align-items: center; */
    /* top: 10%;
    left: 10%; */
    top: 60px;
    right: 20px;
    width: 300px;
    height: 100px;
    background-color: #fff;
    /* background-color: #8c99a7; */
    /* #6872b4; */
}
.el-form {
    background-color: #fff;
}
.el-form .footer {
    display: flex;
    justify-content: center;
}
.footer .el-button:first-child {
    margin-right: 28px;
}
.footer .el-button:last-child {
    margin-left: 28px;
}
</style>
