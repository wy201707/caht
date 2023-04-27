const {
    userAlreadyExited,
    userFormatError,
    invalidPassword,
    userDoesNotExit,
    tokenExpiredError,
    invalidToken,
    lackAdminPression
} = require('../constant/err.type');
module.exports = (err, ctx) => {
    let status = 500;
    switch (err.code) {
        case userFormatError:
            status = 400; //Bad Request 	客户端请求的语法错误，服务器无法理解
            break;
        case userAlreadyExited:
        case userDoesNotExit:
            status = 409; //Conflict 	服务器完成客户端的PUT请求是可能返回此代码，服务器处理请求时发生了冲突
            break;

        //都是登录错误，要求登录
        case invalidToken:
        case invalidPassword:

        //tokenExpiredError 删除token,重新登录动作
        case tokenExpiredError:
            // 还有其他的
            status = 401; //含义：Unauthorized
            // 请求要求身份验证。对于需要登录的网页，服务器可能返回此响应
            break;

        // 弹窗提示无权限 （先别整太复杂）
        case lackAdminPression:
            status = 412; //Precondition Failed 	客户端请求信息的先决条件错误
            break;
        default:
            //这里有：userLoginError、userRegisterError
            status = 500;
    }
    ctx.status = status;
    ctx.body = err;
};
