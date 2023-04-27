const Router = require('koa-router');
const { upload } = require('../controllers/goods.controller');
const { auth, hasAdminPression } = require('../middleWare/auth.middleware');
const { verifyFileType } = require('../middleWare/file.middleware');
const router = new Router({ prefix: '/goods' });

//上传图片
router.post('/upload', auth, hasAdminPression, verifyFileType, upload);
module.exports = router;
