const path = require('path');
const cors = require('koa-cors');

const Koa = require('koa');
const { koaBody } = require('koa-body');
const KoaStatic = require('koa-static');

const errHandler = require('./errHandler');
const router = require('../router');

const app = new Koa();

// app.use(async (ctx,next)=>{
//     let start = new Date();
//     await next();
//     let ms = new Date() - start;
//     console.log('%s %s  %s ms', ctx.method, ctx.url, ms); // 显示执行的时间
// });

//koaBody在所有路由注册之前app.use，这样就可以在ctx.request.body中获取得到的信息
app.use(
    koaBody({
        multipart: true,
        formidable: {
            //配置选项option里，不推荐使用相对路径
            uploadDir: path.join(__dirname, '../upload'),
            keepExtensions: true
        }
    })
);
app.use(KoaStatic(path.join(__dirname, '../upload')));
app.use(cors());

app.use(router.routes()).use(router.allowedMethods());

//统一的错误处理
app.on('error', errHandler);
/* router.use()
app.use(router.routes());
app.use(router.allowedMethods());
 */
// userRouter.get('/s',async (ctx)=>{
//     ctx.body="水逆退散";
//     console.log('好的了吗？');
//     console.log(ctx);//Promise { <pending>, body: '水逆退散' }
// })
// app.use(userRouter.routes()).use(userRouter.allowedMethods());

module.exports = app;
/* app.listen(4005, () => {
    console.log(`server is running on http://localhost:4005`);
});
 */
