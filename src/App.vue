<template>
    <div id="app">
        <el-container>
            <el-header class="sys-header">
                <div class="center">
                    <span>高频地波雷达可视化系统</span>
                </div>
                <div class="user-info">
                    <i class="el-icon-user-solid"></i>
                    <span>当前用户:</span>
                    <!-- <span @click="handleLogin">{{ username }}</span> -->
                    <span @click="handleLogin">{{ getUserName() }}</span>
                </div>
            </el-header>
            <el-container class="app-content-pannel">
                <el-aside class="sys-menu">
                    <!--原： <el-aside width="200px" h> 这里h是什么意思？  -->
                    <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo"
                        @select="handleMenuSelect"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        :collapse="true"
                    >
                        <el-menu-item index="1">
                            <!-- <i class="el-icon-monitor"></i> -->
                            <!-- <i class="el-icon-s-home"></i> -->
                            <i class="el-icon-my-home"></i>
                            <span slot="title">首页</span>
                        </el-menu-item>
                        <el-menu-item index="2">
                            <!-- <i class="el-icon-picture-outline"></i> 这个可以当地图打印 -->
                            <!-- <i class="el-iconfeng"></i>  阿里图库建立项目，导入格式-->
                            <i class="el-icon-my-wind"></i>
                            <span slot="title">风场</span>
                        </el-menu-item>
                        <el-menu-item index="3">
                            <i class="el-icon-my-wave"></i>
                            <span slot="title">海浪</span>
                        </el-menu-item>
                        <el-menu-item index="4">
                            <i class="el-icon-my-cur"></i>
                            <span slot="title">海流</span>
                        </el-menu-item>
                        <el-menu-item index="5">
                            <i class="el-icon-my-time"></i>
                            <span slot="title">选择时间</span>
                        </el-menu-item>
                        <el-menu-item index="6">
                            <i class="el-icon-my-show"></i>
                            <!-- <i class="el-icon-monitor"></i> -->
                            <span slot="title">点渲染</span>
                        </el-menu-item>
                        <el-menu-item index="7">
                            <i class="el-icon-my-play"></i>
                            <span slot="title">动画播放</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>

                <el-main class="sys-content">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>

        <!-- <SetTime :visible="TimePanelVisible" /> -->
        <!-- <el-dialog title="用户登录/注册页面" :visible.sync="loginVisible" width="30%">
            <div class="login-content">
                <div class="login-content-login" v-show="!loginSwitch">
                    <p>用户名</p>
                    <el-input placeholder="请输入内容" v-model="userNameInput" clearable> </el-input>
                    <p>密码</p>
                    <el-input placeholder="请输入密码" v-model="userPwdInput" show-password></el-input>
                </div>
                <div class="login-content-insert" v-show="loginSwitch">
                    <p>用户名</p>
                    <el-input placeholder="请输入内容" v-model="userNameInput_insert" clearable> </el-input>
                    <p>密码</p>
                    <el-input placeholder="请输入密码" v-model="userPwdInput_insert" clearable></el-input>
                    <p>电话</p>
                    <el-input placeholder="请输入电话" v-model="userPhoneInput_insert" clearable></el-input>
                    <p>邮箱</p>
                    <el-input placeholder="请输入邮箱" v-model="userEmailInput_insert" clearable></el-input>
                </div>
            </div>
            <br />
            <el-switch v-model="loginSwitch" active-text="注册" inactive-text="登录"></el-switch>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loginVisible = false">取 消</el-button>
                <el-button type="primary" @click="userLogin">{{ loginSwitch ? '注册' : '登录' }}</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
import SetTime from '@/components/SetTime';
//或者在main.js中引用+vue.use()即可全局使用axios
export default {
    name: 'App',
    components: { SetTime },
    /*     computed: {
        ...mapState({ showUserPlane: '_defaultShowUserLogin' })
    }, */
    data() {
        return {
            username: '未登录'
            // TimePanelVisible: false
            /*  loginVisible: false, */
            // userNameInput: '',
            // userPwdInput: '',
            // userNameInput_insert: '',
            // userPwdInput_insert: '',
            // userPhoneInput_insert: '',
            // userEmailInput_insert: ''
            // loginSwitch: false
        };
    },
    methods: {
        // 这里也要改 0000
        handleMenuSelect(index) {
            // this.$router.push('/'); //相当于只有onemap一个接口，所以这么写了，其实应该有多种功能。。。对应多个页面
            if (index === '1') {
                //跳转到首页
                this.$router.push('/');
            } else if (index === '2') {
                //跳转到风场粒子动画
                /*      this.$router.push({ path: '/paticle/wind' }); */
                const dataType = this.$store.getters._getParticleDataType;
                console.log('dataType=', dataType);
                this.$store.commit('_setParticleDataType', 1);
                this.$router.push('/'); //这里应当匹配未来的粒子动画组件
                //(0426:希望粒子动画只是添加图层，没必要把在线地图界面重建一遍) ，反正现在实现的所有功能都只是在线地图（就是onemap这个组件（当然他由好几个组件构成））

                //   path: '/paticle/:dataType',
                // this.$router.push('/main');

                // 修改router.js，组件+参数，并且修改vue
            } else if (index === '3') {
                // 浪
                this.$router.push('/');
                const dataType = this.$store.getters._getParticleDataType;
                console.log('dataType=', dataType);
                this.$store.commit('_setParticleDataType', 2);
            } else if (index === '4') {
                // 流
                this.$router.push('/');
                const dataType = this.$store.getters._getParticleDataType;
                this.$store.commit('_setParticleDataType', 3);
                console.log('dataType=', dataType, '-->', this.$store.getters._getParticleDataType);
            } else if (index === '5') {
                //选择时间 --组件
                // this.$router.push('/point');
                this.$router.push('/');
                this.$store.commit('_setTimePanelVisible', true);
                // this.TimePanelVisible = true;

                // // 其实这里应该用父子组件通信  10.06
                // const curVisible = this.$store.getters._getDefaultOneRadarVisible;

                // console.log('one radar', curVisible);
            } else if (index === '6') {
                this.$router.push('/');
                this.$store.commit('_setDefaultOneRadarVisible', true);
            } else if (index === '7') {
                this.$router.push('/');
                // const curVisible = this.$store.getters._getDefaultTimeInfoVisible;
                // console.log('goTimeInfo', curVisible);
                this.$store.commit('_setDefaultTimeInfoVisible', true);
            }
        },
        //弹出用户登录页面
        handleLogin() {
            // this.loginVisible = true;
            // this.$router.push('/login');

            const curVisible = this.$store.getters._getDefaultShowUserLogin;
            console.log('_getDefaultShowUserLogin=', curVisible);
            this.$store.commit('_setDefaultShowUserLogin', !curVisible);
        },
        getUserName() {
            let activeName = this.$store.getters.getUserName;
            activeName = activeName == '' ? this.username : activeName;
            return activeName;
        }

        /* //用户登录——传到后台
        userLogin() {
            const _self = this;

            if (!_self.loginSwitch) {
                const name = this.userNameInput;
                const psd = this.userPwdInput;
                // console.log(name, psd);
                axios
                    .get('http://localhost:3001/user/get', {
                        params: {
                            name: name,
                            password: psd
                        }
                    })
                    .then(function (response) {
                        if (response.data.status === 'success') {
                            if (response.data.data.length == 0) {
                                _self.$message({
                                    message: '该用户不存在，请注册',
                                    type: 'warning'
                                });
                            }
                            const password = response.data.data[0].password;
                            // console.log(password, psd);
                            if (password === psd) {
                                // console.log('login ok');
                                _self.$message({
                                    message: '登录成功啦',
                                    type: 'success'
                                });
                                _self.loginVisible = false;
                                _self.username = response.data.data[0].username;
                            } else {
                                _self.$message.error('登录失败，用户名或密码错误');
                                // console.log('fail');
                            }
                        }

                        // console.log(response.data.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                        _self.loginVisible = false;
                    });
            } else {
                const name = this.userNameInput_insert;
                const psd = this.userPwdInput_insert;
                const phone = this.userPhoneInput_insert;
                const email = this.userEmailInput_insert;
                // console.log(name, psd);
                if (!name || !psd) {
                    _self.$message({
                        message: '请填写用户名或密码',
                        type: 'warning'
                    });
                    return;
                    //return会是什么效果？
                }
                axios
                    .post(
                        'http://localhost:3001/user/insert',
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
                        _self.loginVisible = false;
                        console.log(error);
                    });
            }
        }
     */
    }
};
</script>

<!-- <style>

</style> -->

<style>
html,
body,
#app {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
}

/* 这里导致router-view+router+导航栏指向的onemap的mapTools文字错位（其实/指向的首页大屏中文字也会偏离，向下偏离40px）
body > .el-container {
    margin-bottom: 40px;
} */
.el-container {
    height: 100%;
}
.app-content-pannel {
    height: 100%;
}

.sys-content {
    /* padding: 5px !important; */
    padding: 2px !important;
    /* ! important提高权重值。不然的话，权重干不过el-main（padding=20px太宽了不好看），会导致配置无效*/
}

.sys-header {
    color: #fff;
    text-align: center;
    line-height: 60px;
    background-color: #32373e;
    font-size: 20px;
    /* font-weight: 600; */
    display: flex;
    justify-content: space-between;
}
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
.sys-menu {
    background-color: #545c64;
    width: 64px !important;
    overflow: hidden !important;
}
/* .OutPannel,
.ContentPannel {
    height: 100%;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
} */
/* 这（.morescreen-view）也没用上呀？ */
.morescreen-view {
    width: 100%;
    height: 820px;
}
.user-info {
    font-size: 15px;
}
.user-info > span:last-child:hover {
    color: #409eff;
    cursor: pointer;
}
/* .login-content {
    color: #32373e;
} */
/* .el-icon-my-wind {
  background-image: url(/public/static/icon/wind.png);
    background-image: url(/static/icon/train.jpg) center center no-repeat;
    background-size: 24px;
} */
.el-icon-my-home {
    background: url('~@/assets/icon/909399/home2.png') center no-repeat;
    background-size: cover;
}
.el-icon-my-home:before {
    content: '选择时间';
    font-size: 24px;
    visibility: hidden;
}

.el-icon-my-wind {
    background: url('~@/assets/icon/909399/wind2.png') center no-repeat;
    background-size: cover;
}
.el-icon-my-wind:before {
    content: '风场';
    font-size: 24px;
    visibility: hidden;
}
.el-icon-my-wave {
    background: url('~@/assets/icon/909399/wave.png') center no-repeat;
    background-size: cover;
}
.el-icon-my-wave:before {
    content: '海浪';
    font-size: 24px;
    visibility: hidden;
}
.el-icon-my-cur {
    background: url('~@/assets/icon/909399/cur.png') center no-repeat;
    background-size: cover;
}
.el-icon-my-cur:before {
    content: '海流';
    font-size: 24px;
    visibility: hidden;
}
.el-icon-my-time {
    background: url('~@/assets/icon/909399/time.png') center no-repeat;
    background-size: cover;
}
.el-icon-my-time:before {
    content: '选择时间';
    font-size: 26px;
    visibility: hidden;
}

.el-icon-my-show {
    /* background: url('~@/assets/icon/909399/point4.png') center no-repeat; */
    background: url('~@/assets/icon/909399/show.png') center no-repeat;
    background-size: cover;
}
.el-icon-my-show:before {
    content: '点渲染';
    font-size: 20px;
    visibility: hidden;
}
.el-icon-my-play {
    background: url('~@/assets/icon/909399/play.png') center no-repeat;
    background-size: cover;
}
.el-icon-my-play:before {
    content: '动画';
    font-size: 22px;
    visibility: hidden;
}
/* 原文链接：https://blog.csdn.net/baidu_19473529/article/details/109078590 */
</style>
