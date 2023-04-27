const path = require('path');
const { fileUploadError, unSupportFileType } = require('../constant/err.type');

class GoodsController {
    async upload(ctx, next) {
        //这个可以抽离来着，但是这里练手只上传图片
        // console.log(ctx.request.files.file);
        const { file } = ctx.request.files || [];
        // console.log(file);//找到有用信息,mimetype:'image/png'
        /*   const fileType = ['image/jpeg', 'image/png']; */
        if (file) {
            /*           if (!fileType.includes(file.mimetype)) {
                return ctx.app.emit('error', unSupportFileType, ctx);
            } */
            ctx.body = {
                code: 0,
                message: '商品图片上传成功',
                result: {
                    goods_img: path.basename(file.filepath)
                }
            };
        } else {
            return ctx.app.emit('error', fileUploadError, ctx);
        }
    }
}
module.exports = new GoodsController();
