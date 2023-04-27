const { APP_PORT } = require('./config/config.default');
const app=require('./app');//方便后期使用/换用其他框架


app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`);
})