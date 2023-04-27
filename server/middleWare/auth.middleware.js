const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.default');
const { tokenExpiredError, invalidToken, lackAdminPression } = require('../constant/err.type');
//认证——判断是否登录
const auth = async (ctx, next) => {
    const { authorization = '' } = ctx.request.header;
    const token = authorization.replace('Bearer ', '');
    // console.log('token', token);
    try {
        //验证成功的话返回payload（id,username,is_admin,生成、更新时间）
        const user = jwt.verify(token, JWT_SECRET);
        ctx.state.user = user;
        // ctx.body = `修改密码成功,decoded user ${user}`;
    } catch (err) {
        console.log('用户鉴权失败');
        console.log(err);
        switch (err.name) {
            case 'TokenExpiredError':
                console.error('token已过期', err);
                return ctx.app.emit('error', tokenExpiredError, ctx);
            case 'JsonWebTokenError':
                console.error('无效token', err);
                return ctx.app.emit('error', invalidToken, ctx);
            default:
                console.error('其他错误，请查阅错误日志和jwt文档');
                return;
        }
    }

    // ctx.body = `修改密码成功,token=${token}`;

    await next();
};
//溯权——判断是否有操作数据的权限(已经登录的状态下)
const hasAdminPression = async (ctx, next) => {
    const { is_admin } = ctx.state.user;

    if (!is_admin) {
        console.error('该用户没有管理员的权限', ctx.state.user);
        return ctx.app.emit('error', lackAdminPression, ctx);
    }

    await next();
};

module.exports = {
    auth,
    hasAdminPression
};
