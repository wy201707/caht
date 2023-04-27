const Router = require('koa-router');

const { userValidator, verifyUserExited, cryptPassword, verifyLogin } = require('../middleWare/user.middleware');
const { register, login, changePassword } = require('../controllers/user.controller');
const { auth } = require('../middleWare/auth.middleware');

const router = new Router({ prefix: '/users' });

//中间件的单一功能原则  这是设计模式中的开闭原则吗？？？忘记了。
router.post('/register', userValidator, verifyUserExited, cryptPassword, register);
// router.post('/login', userValidator, verifyLogin, login);
router.post('/login', userValidator, verifyLogin, login);

//修改密码
router.patch('/', auth, cryptPassword, changePassword);

/* // GET /users/
router.get('/', async (ctx, next) => {
    // await next()
    let content = ctx;
    console.log(ctx);
    console.log(content);
    // console.log(this) //{}
    ctx.body = 'hello users';
});
router.get('/s', async (ctx, next) => {
    // await next()
    ctx.body = '/s hello users';
}); */

module.exports = router;
