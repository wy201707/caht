const { createUser, getUserInfo, updateById } = require('../service/user.service');
const { userRegisterError } = require('../constant/err.type');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.default');
class UserController {
    async register(ctx, next) {
        const { username, password, is_admin } = ctx.request.body;
        // console.log('进入注册阶段');
        // console.log(username, password, is_admin); //(JSON.stringify(ctx.request.body));

        // const { username, password,is_admin } = ctx.request.body;
        try {
            /*  可以更复杂，但没必要
             if(is_admin){
                const res = await createUser(username, password,is_admin);
            }else{
                 const res = await createUser(username, password);
            } */
            const res = await createUser({ username, password, is_admin });

            // console.log('controller', res);
            // ctx.body = ctx.request.body; //'用户注册成功';
            ctx.body = {
                code: 0,
                message: '用户注册成功',
                result: {
                    id: res.id,
                    username: res.username
                }
            };
            /*   console.log('user.controller.js 为啥没返回');
            返回了返回了，前端vuex的action调用的api返回的data，在控制台打印err.resonse.data或者resonse.data都能看到 */
        } catch (err) {
            // 增强系统健壮性
            console.log(err);
            ctx.app.emit('error', userRegisterError, ctx);
        }
    }
    async login(ctx, next) {
        const { username } = ctx.request.body;
        // ctx.body = `登录成功${username},欢迎回来！`;
        // 1．获取用户信息(在token的playload中，记录id, user_name，1s_admin
        try {
            // const res =await getUserInfo({username})
            // const {password,...resUser}=res //解析一下，把查询信息（res）中除了password的放在resUser里面
            const { password, ...res } = await getUserInfo({ username });
            ctx.body = {
                code: 0,
                message: '用户登录',
                result: {
                    //参数：加密信息，秘钥（服务器私钥）option，过期时间（1天）
                    token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }) //这里和老师敲的不一样,包有更新，用法稍改变  这个token返回前端放在那里呀？？？
                }
            };
        } catch (err) {
            console.error('用户身份验证失败', err);
        }
    }
    async changePassword(ctx, next) {
        /* 
        console.log(ctx.state.user);
        {
            id: 11,
            username: 'wy101',
            is_admin: false,
            iat: 1675070639,
            exp: 1675157039
          } */
        const id = ctx.state.user.id;
        const password = ctx.request.body.password;
        if (await updateById({ id, password })) {
            ctx.body = {
                code: 0,
                message: '修改密码成功',
                result: ''
            };
        } else {
            ctx.body = {
                code: '10108',
                message: '修改密码失败-未写入error.type',
                result: ''
            };
        }
        // console.log(id, password);
    }
}

module.exports = new UserController(); //导出实例化对象
