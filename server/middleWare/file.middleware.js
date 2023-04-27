const { unSupportFileType } = require('../constant/err.type');

const verifyFileType = async (ctx, next) => {
    const { file } = ctx.request.files || [];
    // console.log(file);//找到有用信息,mimetype:'image/png'
    const fileType = ['image/jpeg', 'image/png'];
    if (file) {
        if (!fileType.includes(file.mimetype)) {
            return ctx.app.emit('error', unSupportFileType, ctx);
        }
        ctx.body = '文件类型正确';
    }
    await next();
};
module.exports = {
    verifyFileType
};
