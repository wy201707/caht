const bcrypt = require('bcryptjs');

const { getUserInfo } = require('../service/user.service');
const {
    userAlreadyExited,
    userFormatError,
    userRegisterError,
    userDoesNotExit,
    userLoginError,
    invalidPassword
} = require('../constant/err.type');

//合法性校验_register
const userValidator = async (ctx, next) => {
    const { username, password } = ctx.request.body;
    // console.log('#后台收到信息', username, password);
    if (!username || !password) {
        console.error('用户名或密码为空', ctx.request.body);
        /*  ctx.status = 400; //请求有问题，这里是因为格式错误
        ctx.body = {
            code: '10001', //博主编程习惯，第一位表示错误来源，0：后台，1：前台
            message: '用户名或密码为空',
            result: ''
        }; */
        // 改进
        ctx.app.emit('error', userFormatError, ctx);
        return;
    }
    // console.log('#USER.middleware。so?');
    await next();
};

//合理性校验_register
const verifyUserExited = async (ctx, next) => {
    const { username } = ctx.request.body;
    console.log('verifyUserExited');
    console.log('查询用户名是否已经注册', username);

    /* //第一版
    const res = await getUserInfo({ username });
    if (res) {
        ctx.status = 409; //请求与已存资源存在冲突
        ctx.body = {
            code: '10002',
            message: '用户已经存在',
            result: ''
        };      
        return;
    } */
    //第二版
    const res = await getUserInfo({ username });
    console.log('走到哪一步了？？？middleware.js', res);
    if (res) {
        ctx.app.emit('error', userAlreadyExited, ctx);
        return;
    }
    await next();
    /*第三版好像确实有问题，具体表现：重复值插入显示服务器内部存在错误【trycatch语句执行顺序，不是已发生错就直接catch?这里分明是用户名已存在。还是说ctx.app,emit('error')也会被捕捉？】
    表现二：正确用户信息无法插入   【卡住了，也无报错】 
 try {
        const res = await getUserInfo({ username });
        if (res) {
            console.error('用户名已经存在', { username }); //写在错误日志中
            ctx.app.emit('error', userAlreadyExited, ctx);
            await next();
            return;
        }
    } catch (err) {
        console.error(err);
        ctx.app.emit('error', userRegisterError, ctx);
        return;
    } */
};
//密码加密
const cryptPassword = async (ctx, next) => {
    const { password } = ctx.request.body;
    const salt = bcrypt.genSaltSync(10);
    // hash保存的是密文
    const hash = bcrypt.hashSync(password, salt);
    ctx.request.body.password = hash;
    console.log('为啥数据库要保存密文呀？');
    await next();
};

// 合理性校验_login(+ 密码解密)
const verifyLogin = async (ctx, next) => {
    //1.判断用户是否存在（不存在报错）
    const { username, password } = ctx.request.body;
    console.log('#输出语句，进入verifyLogin');
    try {
        const res = await getUserInfo({ username });
        if (!res) {
            console.error('用户不存在');
            ctx.app.emit('error', userDoesNotExit, ctx);
            return;
        }
        // 2.密码校验，比对密码，不匹配报错
        if (!bcrypt.compareSync(password, res.password)) {
            console.log('怎么没返回？');
            return ctx.app.emit('error', invalidPassword, ctx);
        }
    } catch (err) {
        console.error(err);
        // console.log()
        ctx.app.emit('error', userLoginError, ctx);
    }

    await next();
};

module.exports = {
    userValidator,
    verifyUserExited,
    cryptPassword,
    verifyLogin
};
