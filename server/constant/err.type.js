module.exports = {
    userFormatError: {
        code: '10001',
        message: '用户名或密码为空',
        result: ''
    },
    userAlreadyExited: {
        code: '10002',
        message: '用户已经存在',
        result: ''
    },
    userRegisterError: {
        code: '00003',
        message: '用户注册时发生错误-后台',
        result: ''
    },
    userDoesNotExit: {
        code: '10101',
        message: '用户不存在',
        result: ''
    },
    userLoginError: {
        code: '00102',
        message: '用户登录失败-后台',
        result: ''
    },
    invalidPassword: {
        code: '10103',
        message: '用户密码错误',
        result: ''
    },
    tokenExpiredError: {
        code: '10201',
        message: '用户验证错误-Token过期',
        result: ''
    },
    invalidToken: {
        code: '10202',
        message: '用户验证错误-无效Token',
        result: ''
    },
    lackAdminPression: {
        code: '103001',
        message: '没有管理员权限，无法操作数据',
        result: ''
    },
    fileUploadError: {
        code: '104001',
        message: '上传文件失败',
        result: ''
    },
    unSupportFileType: {
        code: '104002',
        message: '不支持的文件类型',
        result: ''
    }
};
