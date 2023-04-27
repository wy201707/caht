//暂时不用了0127
const Koa = require('koa')
const { APP_PORT } = require('./server/config/config.default')
const userRouter = require('./server/routes/user')
const Router = require('koa-router')

const app = new Koa()
const router=new Router()

app.use(async function (ctx, next) {
  let start = new Date()
  await next()
  let ms = new Date() - start
  // console.log(ctx.request.origin)//http://localhost:3001
  console.log('%s %s  %s ms', ctx.method, ctx.url, ms)
})
// app.use((ctx, next) => {
//   ctx.body = 'hello world'
// })
router.use('/users' ,userRouter.routes())
app
  .use(router.routes())
  .use(router.allowedMethods())
/* app
  .use(userRouter.routes())
  .use(userRouter.allowedMethods())
 */
app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})