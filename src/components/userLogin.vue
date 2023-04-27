<template>
    <transition name="userPlane">
        <div class="user-login-view" v-show="this.$store.getters._getDefaultShowUserLogin">
            <div v-if="!isLogined">
                <!-- 待用：三元式设计本机颜色 :style="{'background':item.flag === false ? '#FFFFFF':'#F56C6C'}"
-->
                <!-- <el-dialog title="用户登录/注册页面"> -->
                <el-form ref="userInfo" :model="userInfo" label-width="80px">
                    <!-- <div class="login-content"> -->
                    <!-- <div class="login-content-login" v-show="!loginSwitch"> -->
                    <div v-show="!loginSwitch">
                        <el-form-item label="用户名" label-position="left" required>
                            <el-input placeholder="请输入内容" v-model="userInfo.NameInput" clearable> </el-input>
                        </el-form-item>
                        <el-form-item label="密码" label-position="left" required>
                            <el-input placeholder="请输入密码" v-model="userInfo.PwdInput" show-password></el-input>
                        </el-form-item>
                    </div>
                    <!-- <div class="login-content-insert" v-show="loginSwitch"> -->
                    <div v-show="loginSwitch">
                        <el-form-item label="用户名" label-position="left" required>
                            <el-input placeholder="请输入内容" v-model="userInfo.NameInput_insert" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="密码" label-position="left" required>
                            <el-input placeholder="请输入密码" v-model="userInfo.PwdInput_insert" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="电话" label-position="left">
                            <el-input
                                placeholder="请输入电话"
                                v-model="userInfo.PhoneInput_insert"
                                clearable
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="邮箱" label-position="left">
                            <el-input
                                placeholder="请输入邮箱"
                                v-model="userInfo.EmailInput_insert"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <!-- 登录的时候不用选择，只需要在权限管理上【只做登录、注册、图层管理需要用到，不做权限管理、用户数据增删改查的部分】 -->
                        <el-form-item label="身份" label-position="left">
                            <el-radio v-model="userInfo.is_admin" :label="true">管理员</el-radio>
                            <el-radio v-model="userInfo.is_admin" :label="false">普通用户</el-radio>
                        </el-form-item>
                    </div>
                    <el-form-item label-position="left">
                        <el-switch v-model="loginSwitch" active-text="注册" inactive-text="登录"></el-switch>
                    </el-form-item>

                    <el-form-item class="footer">
                        <el-button @click="loginVisible = false">取 消</el-button>
                        <el-button type="primary" @click="userLogin">{{ loginSwitch ? '注册' : '登录' }}</el-button>
                    </el-form-item>
                </el-form>
                <!-- </el-dialog> -->
            </div>
            <div v-if="isLogined">
                <h2>{{ userInfo.NameInput == '' ? userInfo.NameInput_insert : userInfo.NameInput }} 登录成功啦</h2>
            </div>
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
        return {
            isLogined: false, //这个应该删掉
            loginSwitch: false, //这个放到vuex，登录后自动跳转
            userInfo: {
                NameInput: '',
                PwdInput: '',
                NameInput_insert: '',
                PwdInput_insert: '',
                PhoneInput_insert: '',
                EmailInput_insert: '',
                is_admin: false
            }
        };
    },
    methods: {
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
                });
                */
            } else {
                const userInfo = _self.userInfo; //.trim();
                // console.log('userInfo type:', typeof userInfo);
                const username = userInfo.NameInput_insert;
                const password = userInfo.PwdInput_insert;
                const phone = userInfo.PhoneInput_insert;
                const email = userInfo.EmailInput_insert;
                const is_admin = userInfo.is_admin == false ? '0' : '1';
                // console.log(name, psd);
                // #待补充校验规则 配合this.$refs['userInfoReg'].validate((valid)
                // 【在绑定规则发现和表项命名props、表格属性名userInfo.password，发现应当分开面板；分面板时候技术不够，总报错；没必要】
                // 由于前端的存在required，这段代码实际上不会执行到 错，element-ui的required只是当前端界面画出了个*
                if (!username || !password) {
                    _self.$message({
                        message: '请填写用户名或密码',
                        type: 'warning'
                    });
                    return;
                    //return会是什么效果？
                }
                /*      this.$refs['userInfoReg'].validate((valid) => {
                    if (valid) {
                        let opt = this.userInfo;
                        console.log(opt);
                    } else {
                        console.log('Error Submit!!');
                        return false;
                    }
                });
 */
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

                this.$store.dispatch('UserRegister', { username, password, is_admin }).then(() => {
                    this.$message({
                        message: '请立即登录',
                        type: 'success'
                    });
                    return;
                });
                /*  #这段也是成功的
               api.userRegister({
                    username,
                    password,
                    phone,
                    email,
                    is_admin
                }).then(({ data }) => {
                    // console.log('返回？', data);
                    _self.$message({
                        message: '请立即登录',
                        type: 'success'
                    });
                    return;
                }); */

                // 注册成功请登录可以用到elem.confirm
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
